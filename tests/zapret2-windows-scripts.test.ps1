$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$Template = [IO.File]::ReadAllText((Join-Path $Root 'scripts\zapret2-windows.ps1'), [Text.Encoding]::UTF8)
$Tokens = $null
$ParseErrors = $null
$Ast = [System.Management.Automation.Language.Parser]::ParseInput($Template, [ref]$Tokens, [ref]$ParseErrors)
if ($ParseErrors.Count) { throw ($ParseErrors | Out-String) }

# Load only function definitions. Never run the script entry point or a binary.
foreach ($Definition in $Ast.FindAll({ param($Node) $Node -is [System.Management.Automation.Language.FunctionDefinitionAst] }, $false)) {
    . ([scriptblock]::Create($Definition.Extent.Text))
}
$script:Checks = 0
function Assert-True {
    param([bool]$Condition, [string]$Label)
    if (!$Condition) { throw "Assertion failed: $Label" }
    $script:Checks++
}
function Assert-Throws {
    param([scriptblock]$Code, [string]$Label)
    $Thrown = $false
    try { $null = & $Code } catch { $Thrown = $true }
    Assert-True $Thrown $Label
}

foreach ($Entry in @(@('install', 'Install'), @('update', 'Update'), @('uninstall', 'Uninstall'))) {
    $File = Join-Path $Root ('public\scripts\zapret2\zapret2-' + $Entry[0] + '.ps1')
    $Bytes = [IO.File]::ReadAllBytes($File)
    Assert-True ($Bytes[0] -eq 239 -and $Bytes[1] -eq 187 -and $Bytes[2] -eq 191) 'Windows PowerShell UTF-8 BOM'
    $Content = [IO.File]::ReadAllText($File)
    $Expected = $Template.Replace("`$Action = '__ACTION__'", ("`$Action = '" + $Entry[1] + "'")) -replace '\r?\n', "`r`n"
    Assert-True ($Content -ceq $Expected) "standalone $($Entry[0]) matches its source"
    $null = [System.Management.Automation.Language.Parser]::ParseFile($File, [ref]$Tokens, [ref]$ParseErrors)
    Assert-True ($ParseErrors.Count -eq 0) "standalone $($Entry[0]) syntax"
    Assert-True ($Content.Contains('https://github.com/bol-van/zapret-win-bundle/archive/refs/heads/master.zip')) 'official source URL'
}

foreach ($Path in @('C:\', 'C:\Windows', 'C:\zapret2\..', 'C:\zapret2;whoami', '\\server\zapret2')) {
    Assert-Throws { Assert-InstallDirectory $Path } "reject path $Path"
}
Assert-True (Test-ZapretDomain 'youtube.com') 'valid domain'
Assert-True (!(Test-ZapretDomain 'https://youtube.com')) 'reject URL'
Assert-Throws { ConvertTo-ZapretDomains 'youtube.com; $(whoami)' } 'reject shell text in domain list'
$Domains = @(ConvertTo-ZapretDomains "Example.org example.org;video.example.org")
Assert-True ($Domains.Count -eq 2 -and $Domains[0] -eq 'example.org') 'normalize and deduplicate domains'
$Strategy = '--payload=tls_client_hello --lua-desync=multisplit:pos=1,midsld'
Assert-True (Test-ZapretStrategy $Strategy) 'valid strategy'
foreach ($Bad in @('--dpi-desync=fake', '--lua-desync=fake;whoami', '--lua-desync=$(whoami)', '--lua-init=os.execute(bad)', '')) {
    Assert-True (!(Test-ZapretStrategy $Bad)) "reject strategy $Bad"
}
$Arguments = @(Get-ZapretArguments $Strategy)
Assert-True ($Arguments -contains '--hostlist=guide-hosts.txt') 'hostlist enabled'
Assert-True ($Arguments -contains '--lua-desync=multisplit:pos=1,midsld') 'strategy retained as data'

$TempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd('\') + '\'
$TestRoot = Join-Path $TempRoot ('zapret2-tests-' + [guid]::NewGuid().ToString('N'))
$Junction = Join-Path $TestRoot 'zapret2\external'
try {
    $Source = Join-Path $TestRoot 'official'
    $Destination = Join-Path $TestRoot 'zapret2'
    $null = New-Item -ItemType Directory -Path $Source, $Destination -Force
    foreach ($File in @('zapret-winws\winws2.exe', 'zapret-winws\WinDivert.dll', 'zapret-winws\WinDivert64.sys',
            'zapret-winws\lua\zapret-lib.lua', 'zapret-winws\lua\zapret-antidpi.lua', 'blockcheck\blockcheck2.cmd')) {
        $Path = Join-Path $Source $File
        $null = New-Item -ItemType Directory -Path (Split-Path -Parent $Path) -Force
        Set-Content -LiteralPath $Path -Value 'test fixture, not executable'
    }
    $null = New-Item -ItemType Directory -Path (Join-Path $Destination 'zapret-winws')
    Set-Content -LiteralPath (Join-Path $Destination 'zapret-winws\guide.conf') -Value 'original strategy'
    Set-Content -LiteralPath (Join-Path $Destination 'zapret-winws\guide-hosts.txt') -Value 'example.org'
    Set-Content -LiteralPath (Join-Path $Source 'zapret-winws\guide.conf') -Value 'must not replace user config'
    Copy-OfficialBundle $Source $Destination
    Assert-True ((Get-Content -LiteralPath (Join-Path $Destination 'zapret-winws\guide.conf') -Raw).Trim() -eq 'original strategy') 'update preserves config'
    Assert-True ((Get-Content -LiteralPath (Join-Path $Destination 'zapret-winws\guide-hosts.txt') -Raw).Trim() -eq 'example.org') 'update preserves hostlist'
    Assert-ZapretPackage $Destination
    Assert-Throws { Clear-DownloadWorkspace $TestRoot } 'cleanup rejects unrelated temp directory'
    Assert-True (Test-Path -LiteralPath $Destination) 'rejected cleanup leaves files intact'

    # Fake service/process inventory; no real Windows service is inspected or changed.
    $script:ServiceFixture = $null
    $script:ProcessFixture = @()
    $script:StoppedIds = @()
    function Get-CimInstance {
        param($ClassName, $Filter)
        if ($ClassName -eq 'Win32_Service') { return $script:ServiceFixture }
        if ($Filter -eq "Name='bash.exe'") { return $null }
        return $script:ProcessFixture
    }
    function Stop-Process { param($Id, [switch]$Force); $script:StoppedIds += $Id }
    $script:ServiceFixture = [pscustomobject]@{ PathName = '"C:\other\winws2.exe" --something' }
    Assert-Throws { Get-ManagedService $Destination } 'service ownership mismatch blocks operation'
    $script:ServiceFixture = $null
    $script:ProcessFixture = @(
        [pscustomobject]@{ ProcessId = 100; ExecutablePath = (Join-Path $Destination 'zapret-winws\winws2.exe') },
        [pscustomobject]@{ ProcessId = 200; ExecutablePath = 'C:\another\winws2.exe' }
    )
    Stop-ManagedZapret $Destination
    Assert-True ($script:StoppedIds.Count -eq 1 -and $script:StoppedIds[0] -eq 100) 'only matching install process is stopped'

    $Outside = Join-Path $TestRoot 'outside'
    $null = New-Item -ItemType Directory -Path $Outside
    Set-Content -LiteralPath (Join-Path $Outside 'keep.txt') -Value 'keep'
    $null = New-Item -ItemType Junction -Path $Junction -Target $Outside
    Assert-Throws { Assert-ZapretPackage $Destination } 'reject junction before copying or deletion'
    Assert-Throws { Copy-OfficialBundle $Source $Destination } 'update rejects destination junction'
    Assert-True (Test-Path -LiteralPath (Join-Path $Outside 'keep.txt')) 'junction target remains intact'
} finally {
    # Remove only the junction itself, then our verified unique temporary test directory.
    if (Test-Path -LiteralPath $Junction) { (Get-Item -LiteralPath $Junction -Force).Delete() }
    $Resolved = [IO.Path]::GetFullPath($TestRoot)
    if (!$Resolved.StartsWith($TempRoot, [StringComparison]::OrdinalIgnoreCase) -or
        (Split-Path -Leaf $Resolved) -notmatch '^zapret2-tests-[a-f0-9]{32}$') { throw 'Unsafe test cleanup path' }
    if (Test-Path -LiteralPath $Resolved) {
        Assert-NoReparsePoints $Resolved
        Remove-Item -LiteralPath $Resolved -Recurse -Force
    }
}
Write-Host "PASS: $script:Checks script checks; no driver, network download or real service operations performed."

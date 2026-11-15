#requires -Version 5.1
#requires -RunAsAdministrator
<#
  Source for three standalone downloads. Generate them with:
  node scripts/build-zapret2-windows.mjs
  Zapret binaries come only from https://github.com/bol-van/zapret-win-bundle
  This helper is maintained by DenPiligrim, not by the Zapret author.
#>
param([ValidateSet('Install', 'Update', 'Uninstall')][string]$Action = 'Install')

$ErrorActionPreference = 'Stop'

function Read-Choice {
    param([string]$Prompt, [bool]$Default = $false)
    while ($true) {
        $Hint = if ($Default) { 'Д/н' } else { 'д/Н' }
        $Answer = (Read-Host "$Prompt [$Hint]").Trim().ToLowerInvariant()
        if (!$Answer) { return $Default }
        if ($Answer -in @('д', 'да', 'y', 'yes')) { return $true }
        if ($Answer -in @('н', 'нет', 'n', 'no')) { return $false }
        Write-Host 'Введите да или нет.'
    }
}

function Assert-InstallDirectory {
    param([string]$Directory)
    if ($Directory -notmatch '^[a-z]:\\(?:[a-z0-9_-]+\\)*zapret2$') {
        throw 'Укажите путь вида C:\zapret2 или D:\Tools\zapret2, без пробелов и кириллицы. Последняя папка должна называться zapret2.'
    }
    $Resolved = [IO.Path]::GetFullPath($Directory).TrimEnd('\')
    $Ancestor = $Resolved
    while ($Ancestor) {
        if (Test-Path -LiteralPath $Ancestor) {
            $Item = Get-Item -LiteralPath $Ancestor -Force
            if (!$Item.PSIsContainer -or ($Item.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
                throw 'Папка и её родительские каталоги не должны быть файлами, ссылками или junction.'
            }
        }
        $Ancestor = Split-Path -Parent $Ancestor
    }
    return $Resolved
}

function Assert-NoReparsePoints {
    param([string]$Directory)
    $Pending = New-Object 'System.Collections.Generic.Stack[string]'
    $Pending.Push($Directory)
    while ($Pending.Count) {
        $Current = $Pending.Pop()
        $Item = Get-Item -LiteralPath $Current -Force
        if ($Item.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Обнаружена ссылка: $Current" }
        foreach ($Child in Get-ChildItem -LiteralPath $Current -Force) {
            if ($Child.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Обнаружена ссылка: $($Child.FullName)" }
            if ($Child.PSIsContainer) { $Pending.Push($Child.FullName) }
        }
    }
}

function Assert-ZapretPackage {
    param([string]$Directory)
    foreach ($File in @('zapret-winws\winws2.exe', 'zapret-winws\WinDivert.dll', 'zapret-winws\WinDivert64.sys',
            'zapret-winws\lua\zapret-lib.lua', 'zapret-winws\lua\zapret-antidpi.lua', 'blockcheck\blockcheck2.cmd')) {
        if (!(Test-Path -LiteralPath (Join-Path $Directory $File) -PathType Leaf)) { throw "Не найден файл комплекта: $File" }
    }
    Assert-NoReparsePoints $Directory
}

function Read-InstallDirectory {
    param([switch]$Existing)
    while ($true) {
        $Value = (Read-Host 'Папка Zapret 2 [C:\zapret2]').Trim().Trim('"').TrimEnd('\')
        if (!$Value) { $Value = 'C:\zapret2' }
        try {
            $Directory = Assert-InstallDirectory $Value
            if ($Existing) { Assert-ZapretPackage $Directory }
            return $Directory
        } catch { Write-Host $_.Exception.Message -ForegroundColor Yellow }
    }
}

function Test-ZapretDomain {
    param([string]$Domain)
    return $Domain.Length -le 253 -and $Domain -match '^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$'
}

function ConvertTo-ZapretDomains {
    param([string]$Text)
    $Values = @($Text.Trim().ToLowerInvariant() -split '[\s,;]+' | Where-Object { $_ } | Select-Object -Unique)
    if (!$Values.Count -or $Values.Count -gt 100) { throw 'Укажите от 1 до 100 доменов.' }
    foreach ($Domain in $Values) {
        if (!(Test-ZapretDomain $Domain)) { throw "Неверный домен: $Domain. Укажите имя без https:// и пути; для IDN используйте punycode." }
    }
    return $Values
}

function Test-ZapretStrategy {
    param([string]$Strategy)
    if (!$Strategy -or $Strategy.Length -gt 4000 -or $Strategy -notmatch '--lua-desync=') { return $false }
    foreach ($Option in ($Strategy -split '\s+')) {
        if ($Option -notmatch '^--(?:lua-desync|payload|out-range|in-range)=[a-z0-9_=,:.+/-]+$') { return $false }
    }
    return $true
}

function Get-ZapretArguments {
    param([string]$Strategy)
    if (!(Test-ZapretStrategy $Strategy)) { throw 'Неверный формат стратегии.' }
    return @('--chdir', '--lua-init=@lua/zapret-lib.lua', '--lua-init=@lua/zapret-antidpi.lua',
        '--wf-tcp-out=443', '--filter-tcp=443', '--filter-l7=tls', '--hostlist=guide-hosts.txt', '--payload=tls_client_hello') + @($Strategy -split '\s+')
}

function Get-ManagedService {
    param([string]$Directory)
    $Service = Get-CimInstance Win32_Service -Filter "Name='Zapret2Guide'"
    if ($Service) {
        $Exe = Join-Path $Directory 'zapret-winws\winws2.exe'
        $Expected = '^"?' + [regex]::Escape($Exe) + '"?\s'
        if ($Service.PathName -notmatch $Expected) { throw 'Служба Zapret2Guide относится к другой папке. Укажите правильную папку установки.' }
    }
    return $Service
}

function Assert-NoBundleShell {
    param([string]$Directory)
    $Shell = Join-Path $Directory 'cygwin\bin\bash.exe'
    if (Get-CimInstance Win32_Process -Filter "Name='bash.exe'" | Where-Object { $_.ExecutablePath -eq $Shell }) {
        throw 'Закройте окна blockcheck2 и Cygwin из этой папки и повторите запуск скрипта.'
    }
}

function Stop-ManagedZapret {
    param([string]$Directory)
    if (Get-ManagedService $Directory) {
        Stop-Service -Name 'Zapret2Guide'
        (Get-Service -Name 'Zapret2Guide').WaitForStatus('Stopped', [TimeSpan]::FromSeconds(30))
    }
    $Exe = Join-Path $Directory 'zapret-winws\winws2.exe'
    Get-CimInstance Win32_Process -Filter "Name='winws2.exe'" |
        Where-Object { $_.ExecutablePath -eq $Exe } |
        ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
}

function Clear-DownloadWorkspace {
    param([string]$WorkDirectory)
    $TempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd('\') + '\'
    $Resolved = [IO.Path]::GetFullPath($WorkDirectory).TrimEnd('\')
    if (!$Resolved.StartsWith($TempRoot, [StringComparison]::OrdinalIgnoreCase) -or
        (Split-Path -Leaf $Resolved) -notmatch '^zapret2-guide-download-[a-f0-9]{32}$') {
        throw 'Не удалось проверить путь временной папки.'
    }
    if (Test-Path -LiteralPath $Resolved) {
        Assert-NoReparsePoints $Resolved
        Remove-Item -LiteralPath $Resolved -Recurse -Force
    }
}

function Get-OfficialBundle {
    $WorkDirectory = Join-Path ([IO.Path]::GetTempPath()) ('zapret2-guide-download-' + [guid]::NewGuid().ToString('N'))
    $null = New-Item -ItemType Directory -Path $WorkDirectory
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        $Archive = Join-Path $WorkDirectory 'official.zip'
        Write-Host 'Скачивание из официального репозитория bol-van/zapret-win-bundle...'
        Invoke-WebRequest -UseBasicParsing -Uri 'https://github.com/bol-van/zapret-win-bundle/archive/refs/heads/master.zip' -OutFile $Archive
        Expand-Archive -LiteralPath $Archive -DestinationPath $WorkDirectory
        $Source = Join-Path $WorkDirectory 'zapret-win-bundle-master'
        Assert-ZapretPackage $Source
        return [pscustomobject]@{ Source = $Source; WorkDirectory = $WorkDirectory }
    } catch {
        Clear-DownloadWorkspace $WorkDirectory
        throw
    }
}

function Copy-OfficialBundle {
    param([string]$Source, [string]$Directory)
    $null = Assert-InstallDirectory $Directory
    Assert-ZapretPackage $Source
    if (Test-Path -LiteralPath $Directory) { Assert-NoReparsePoints $Directory }
    foreach ($Item in Get-ChildItem -LiteralPath $Source -Force) {
        # Guide files belong to the user and must survive an official bundle update.
        if ($Item.Name -like 'guide*') { continue }
        if ($Item.Name -eq 'zapret-winws' -and (Test-Path -LiteralPath (Join-Path $Directory 'zapret-winws'))) {
            foreach ($Child in Get-ChildItem -LiteralPath $Item.FullName -Force) {
                if ($Child.Name -notlike 'guide*') {
                    Copy-Item -LiteralPath $Child.FullName -Destination (Join-Path $Directory 'zapret-winws') -Recurse -Force
                }
            }
        } else {
            Copy-Item -LiteralPath $Item.FullName -Destination $Directory -Recurse -Force
        }
    }
}

function Install-ZapretInteractive {
    $Directory = Read-InstallDirectory
    $null = Get-ManagedService $Directory
    if ((Test-Path -LiteralPath $Directory) -and @(Get-ChildItem -LiteralPath $Directory -Force).Count) {
        Assert-ZapretPackage $Directory
        if (!(Read-Choice 'Папка уже существует. Продолжить настройку имеющегося комплекта?')) { return }
    } else {
        $Bundle = Get-OfficialBundle
        try {
            $null = New-Item -ItemType Directory -Path $Directory -Force
            Copy-OfficialBundle $Bundle.Source $Directory
        } finally { Clear-DownloadWorkspace $Bundle.WorkDirectory }
    }
    Write-Host "Файлы находятся в $Directory. Профиль обрабатывает HTTPS по TCP 443, без UDP и голосовых звонков."
    do {
        $Domain = (Read-Host 'Недоступный домен для проверки [youtube.com]').Trim().ToLowerInvariant()
        if (!$Domain) { $Domain = 'youtube.com' }
        if (!(Test-ZapretDomain $Domain)) { Write-Host 'Нужно имя домена без https:// и пути.' }
    } until (Test-ZapretDomain $Domain)
    $DefaultDomains = "$Domain googlevideo.com ytimg.com discord.com discord.gg discordapp.com discordapp.net"
    while ($true) {
        $InputDomains = Read-Host "Домены через пробел [$DefaultDomains]"
        if (!$InputDomains.Trim()) { $InputDomains = $DefaultDomains }
        try { $Domains = @(ConvertTo-ZapretDomains $InputDomains); break }
        catch { Write-Host $_.Exception.Message -ForegroundColor Yellow }
    }
    if (Read-Choice 'Запустить официальный blockcheck2 для подбора стратегии? Отключите другие VPN и средства обхода.' $true) {
        Assert-NoBundleShell $Directory
        Stop-ManagedZapret $Directory
        $PreviousDomain = [Environment]::GetEnvironmentVariable('DOMAINS', 'Process')
        try {
            $env:DOMAINS = $Domain
            Start-Process -FilePath $env:ComSpec -ArgumentList @('/d', '/c', (Join-Path $Directory 'blockcheck\blockcheck2.cmd')) -WorkingDirectory $Directory -Wait
        } finally { [Environment]::SetEnvironmentVariable('DOMAINS', $PreviousDomain, 'Process') }
        Write-Host 'Дождитесь конца теста в его окне. Нужны параметры успешного теста HTTPS из SUMMARY.'
        $null = Read-Host 'Когда тест завершён и параметры скопированы, нажмите Enter'
    }
    Write-Host 'Вставьте только параметры --lua-desync=..., при наличии --payload=..., --out-range=... и --in-range=....'
    Write-Host 'Готовой универсальной стратегии нет. Для выхода с сохранением скачанных файлов введите Q.'
    while ($true) {
        $Strategy = ((Read-Host 'Стратегия из SUMMARY').Trim() -replace '\s+', ' ')
        if ($Strategy -eq 'q') { return }
        if (Test-ZapretStrategy $Strategy) { break }
        Write-Host 'Не вставляйте имя программы, команду целиком или параметры --dpi-desync первой версии.' -ForegroundColor Yellow
    }
    Assert-NoBundleShell $Directory
    Stop-ManagedZapret $Directory
    $BinDirectory = Join-Path $Directory 'zapret-winws'
    foreach ($Name in @('guide.conf', 'guide-hosts.txt')) {
        $File = Join-Path $BinDirectory $Name
        if (Test-Path -LiteralPath $File) { Copy-Item -LiteralPath $File -Destination ($File + '.backup-' + [guid]::NewGuid().ToString('N')) }
    }
    Set-Content -LiteralPath (Join-Path $BinDirectory 'guide-hosts.txt') -Encoding ASCII -Value $Domains
    $Arguments = @(Get-ZapretArguments $Strategy)
    Set-Content -LiteralPath (Join-Path $BinDirectory 'guide.conf') -Encoding ASCII -Value $Arguments
    $Exe = Join-Path $BinDirectory 'winws2.exe'
    & $Exe '--dry-run' @Arguments
    if ($LASTEXITCODE -ne 0) { throw 'Проверка параметров winws2 не прошла. Повторите настройку с другой стратегией.' }
    $Config = (Join-Path $BinDirectory 'guide.conf').Replace('\', '/')
    $Trial = Start-Process -FilePath $Exe -ArgumentList ('"@' + $Config + '"') -WorkingDirectory $BinDirectory -PassThru
    Write-Host 'Пробный запуск открыт в отдельном окне. Проверьте сайты, видео и картинки в браузере.'
    if (!(Read-Choice 'Сайты работают с выбранной стратегией?')) {
        Stop-ManagedZapret $Directory
        Write-Host 'Zapret остановлен. Повторите установщик и выберите другую успешную стратегию.'
        return
    }
    if (Read-Choice 'Включить автозапуск службой Windows?') {
        Stop-ManagedZapret $Directory
        if (!(Get-ManagedService $Directory)) {
            $BinaryPath = '"' + $Exe + '" "@' + $Config + '"'
            $null = New-Service -Name 'Zapret2Guide' -DisplayName 'Zapret 2 (DenPiligrim guide)' -BinaryPathName $BinaryPath -StartupType Automatic
        } else { Set-Service -Name 'Zapret2Guide' -StartupType Automatic }
        Start-Service -Name 'Zapret2Guide'
        Get-Service -Name 'Zapret2Guide'
    } else {
        if (Get-ManagedService $Directory) { Set-Service -Name 'Zapret2Guide' -StartupType Manual }
        Write-Host 'Автозапуск отключён. Ручной запуск работает, пока открыто отдельное окно winws2; для остановки нажмите там Ctrl+C.'
    }
}

function Update-ZapretInteractive {
    $Directory = Read-InstallDirectory -Existing
    $null = Get-ManagedService $Directory
    Assert-NoBundleShell $Directory
    $Bundle = Get-OfficialBundle
    try {
        Stop-ManagedZapret $Directory
        $Backup = $Directory + '-backup-' + [guid]::NewGuid().ToString('N')
        $null = Assert-InstallDirectory $Directory
        Copy-Item -LiteralPath $Directory -Destination $Backup -Recurse
        Write-Host "Резервная копия: $Backup"
        try { Copy-OfficialBundle $Bundle.Source $Directory }
        catch { Write-Host "Обновление не завершено. Zapret остановлен, резервная копия: $Backup" -ForegroundColor Yellow; throw }
        Write-Host 'Файлы обновлены. guide.conf и guide-hosts.txt сохранены. Резервная копия остаётся рядом с установкой.'
        if ((Get-ManagedService $Directory) -and (Read-Choice 'Запустить установленную службу после обновления?')) {
            Start-Service -Name 'Zapret2Guide'
            Write-Host 'Проверьте сайты. Для остановки: Stop-Service -Name Zapret2Guide'
        } else {
            Write-Host 'Zapret остаётся остановленным. Для проверки вручную выполните:'
            Write-Host ('& "' + (Join-Path $Directory 'zapret-winws\winws2.exe') + '" "@' + (Join-Path $Directory 'zapret-winws\guide.conf').Replace('\', '/') + '"')
        }
    } finally { Clear-DownloadWorkspace $Bundle.WorkDirectory }
}

function Remove-ZapretInteractive {
    $Directory = Read-InstallDirectory -Existing
    $null = Get-ManagedService $Directory
    Assert-NoBundleShell $Directory
    $RemoveFiles = Read-Choice "Удалить также все файлы внутри $Directory?" $true
    Write-Host "Будут остановлены winws2 из $Directory и служба Zapret2Guide этой установки. Резервные копии рядом с папкой останутся."
    if ((Read-Host 'Для подтверждения введите УДАЛИТЬ') -cne 'УДАЛИТЬ') { Write-Host 'Удаление отменено.'; return }
    Stop-ManagedZapret $Directory
    if (Get-ManagedService $Directory) {
        sc.exe delete Zapret2Guide
        if ($LASTEXITCODE -ne 0) { throw 'Windows не смогла удалить службу. Перезагрузитесь и повторите удаление.' }
    }
    Write-Host 'Общий драйвер WinDivert может использоваться другими программами.'
    if (Read-Choice 'Открыть официальный скрипт удаления WinDivert? Только если другие программы его не используют.') {
        & (Join-Path $Directory 'zapret-winws\windivert_delete.cmd')
    }
    if ($RemoveFiles) {
        $Directory = Assert-InstallDirectory $Directory
        Assert-ZapretPackage $Directory
        Remove-Item -LiteralPath $Directory -Recurse -Force
        Write-Host "Папка $Directory удалена."
    } else { Write-Host 'Служба удалена, файлы оставлены по вашему выбору.' }
}

try {
    if (![Environment]::Is64BitOperatingSystem -or ![Environment]::Is64BitProcess -or
        (Get-CimInstance Win32_Processor | Where-Object { $_.Architecture -ne 9 }) -or
        [Environment]::OSVersion.Version.Build -lt 10240) {
        throw 'Нужна Windows 10/11 x64 (Intel/AMD) и 64-битная Windows PowerShell от администратора.'
    }
    Write-Host 'Zapret 2 - скрипт DenPiligrim. Бинарные файлы загружаются только из репозитория автора bol-van.'
    switch ($Action) {
        'Install' { Install-ZapretInteractive }
        'Update' { Update-ZapretInteractive }
        'Uninstall' { Remove-ZapretInteractive }
    }
    $null = Read-Host 'Готово. Нажмите Enter, чтобы закрыть скрипт'
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host 'Операция не завершена. Текст ошибки оставлен в этом окне.'
    $null = Read-Host 'Нажмите Enter, чтобы закрыть скрипт'
    exit 1
}

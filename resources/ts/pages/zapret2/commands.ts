export interface ZapretSettings {
  directory: string;
  testDomain: string;
  domains: string;
  strategy: string;
}

export const defaultZapretSettings: ZapretSettings = {
  directory: 'C:\\zapret2',
  testDomain: 'youtube.com',
  domains: 'youtube.com\ngooglevideo.com\nytimg.com\ndiscord.com\ndiscord.gg\ndiscordapp.com\ndiscordapp.net',
  strategy: '',
};

const isDomain = (value: string) => value.length <= 253 && /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(value);
const psQuote = (value: string) => `'${value.replaceAll("'", "''")}'`;

export function buildZapretCommands(settings: ZapretSettings) {
  const directory = settings.directory.trim().replace(/\\+$/, '');
  const domains = [...new Set(settings.domains.trim().toLowerCase().split(/[\s,;]+/).filter(Boolean))];
  const testDomain = settings.testDomain.trim().toLowerCase();
  const strategy = settings.strategy.trim().replace(/\s+/g, ' ');
  // Keep generated paths predictable, including commands that back up the installation.
  const directoryError = !/^[a-z]:\\(?:[a-z0-9_-]+\\)*zapret2$/i.test(directory);
  const domainError = !isDomain(testDomain);
  const domainsError = !domains.length || domains.length > 100 || domains.some(domain => !isDomain(domain));
  // Only accept standard packet-manipulation options, never a shell command or executable.
  const strategyError = !strategy || strategy.length > 4000 || !strategy.split(' ').every(option =>
    /^--(?:lua-desync|payload|out-range|in-range)=[a-z0-9_=,:.+/-]+$/i.test(option)) || !strategy.includes('--lua-desync=');
  const valid = !directoryError && !domainError && !domainsError;
  const prefix = `$ErrorActionPreference = 'Stop'\n$ZapretDir = ${psQuote(directory)}\n`;
  const stop = `Stop-Service -Name 'Zapret2Guide' -ErrorAction SilentlyContinue
Get-CimInstance Win32_Process -Filter "Name='winws2.exe'" |
  Where-Object { $_.ExecutablePath -eq (Join-Path $ZapretDir 'zapret-winws\\winws2.exe') } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }`;
  const download = `$WorkDir = Join-Path $env:TEMP ('zapret2-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $WorkDir | Out-Null
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -UseBasicParsing -Uri 'https://github.com/bol-van/zapret-win-bundle/archive/refs/heads/master.zip' -OutFile (Join-Path $WorkDir 'official.zip')
Expand-Archive -LiteralPath (Join-Path $WorkDir 'official.zip') -DestinationPath $WorkDir
$Source = Join-Path $WorkDir 'zapret-win-bundle-master'
foreach ($File in @('zapret-winws\\winws2.exe', 'zapret-winws\\lua\\zapret-lib.lua', 'zapret-winws\\lua\\zapret-antidpi.lua', 'blockcheck\\blockcheck2.cmd')) {
  if (!(Test-Path -LiteralPath (Join-Path $Source $File))) { throw "Incomplete archive: $File" }
}`;
  const config = `--chdir
--lua-init=@lua/zapret-lib.lua
--lua-init=@lua/zapret-antidpi.lua
--wf-tcp-out=443
--filter-tcp=443
--filter-l7=tls
--hostlist=guide-hosts.txt
--payload=tls_client_hello
${strategy}`;

  return {
    errors: { directory: directoryError, testDomain: domainError, domains: domainsError, strategy: strategyError },
    valid,
    ready: valid && !strategyError,
    install: valid ? `${prefix}if (Test-Path -LiteralPath $ZapretDir) { throw 'Folder already exists. Use the Update section.' }
if (![Environment]::Is64BitOperatingSystem -or $env:PROCESSOR_ARCHITECTURE -eq 'ARM64' -or $env:PROCESSOR_ARCHITEW6432 -eq 'ARM64') { throw 'This guide requires Windows x64 (Intel/AMD).' }
${download}
New-Item -ItemType Directory -Path (Split-Path -Parent $ZapretDir) -Force | Out-Null
Move-Item -LiteralPath $Source -Destination $ZapretDir
Write-Host 'Download complete. Continue to step 2.'` : '',
    check: valid ? `${prefix}$env:DOMAINS = ${psQuote(testDomain)}
try {
  & (Join-Path $ZapretDir 'blockcheck\\blockcheck2.cmd')
} finally {
  Remove-Item Env:DOMAINS -ErrorAction SilentlyContinue
}` : '',
    configure: valid && !strategyError ? `${prefix}Set-Content -LiteralPath (Join-Path $ZapretDir 'zapret-winws\\guide-hosts.txt') -Encoding ASCII -Value @'
${domains.join('\n')}
'@
Set-Content -LiteralPath (Join-Path $ZapretDir 'zapret-winws\\guide.conf') -Encoding ASCII -Value @'
${config}
'@
Write-Host 'Configuration saved.'` : '',
    run: valid ? `${prefix}& (Join-Path $ZapretDir 'zapret-winws\\winws2.exe') ('@' + (Join-Path $ZapretDir 'zapret-winws\\guide.conf').Replace('\\', '/'))` : '',
    autostart: valid ? `${prefix}$Exe = Join-Path $ZapretDir 'zapret-winws\\winws2.exe'
$Config = (Join-Path $ZapretDir 'zapret-winws\\guide.conf').Replace('\\', '/')
if (!(Test-Path -LiteralPath $Config)) { throw 'Complete step 3 first.' }
$BinaryPath = '"' + $Exe + '" "@' + $Config + '"'
New-Service -Name 'Zapret2Guide' -DisplayName 'Zapret 2 (DenPiligrim guide)' -BinaryPathName $BinaryPath -StartupType Automatic
Start-Service -Name 'Zapret2Guide'
Get-Service -Name 'Zapret2Guide'` : '',
    stop: valid ? `${prefix}${stop}` : '',
    update: valid ? `${prefix}if (!(Test-Path -LiteralPath (Join-Path $ZapretDir 'zapret-winws\\winws2.exe'))) { throw 'Installation not found. Check the folder in the guide settings.' }
${download}
${stop}
$Backup = $ZapretDir + '-backup-' + [guid]::NewGuid().ToString('N')
Copy-Item -LiteralPath $ZapretDir -Destination $Backup -Recurse
Copy-Item -Path (Join-Path $Source '*') -Destination $ZapretDir -Recurse -Force
Write-Host "Updated. Backup: $Backup"
Write-Host 'Test using step 3 before starting the service again.'` : '',
    restart: `Start-Service -Name 'Zapret2Guide'\nGet-Service -Name 'Zapret2Guide'`,
    remove: valid ? `${prefix}${stop}
if (Get-Service -Name 'Zapret2Guide' -ErrorAction SilentlyContinue) {
  sc.exe delete Zapret2Guide
  if ($LASTEXITCODE -ne 0) { throw 'Could not delete the service. Restart Windows and retry.' }
}

Write-Host 'Autostart removed. You can now delete the installation folder in Explorer.'
explorer.exe (Split-Path -Parent $ZapretDir)` : '',
  };
}

export interface OpenWrtSettings extends Omit<ZapretSettings, 'directory'> {
  routerAddress: string;
  sshPort: string;
  version: string;
  lan: string;
}

export const defaultOpenWrtSettings: OpenWrtSettings = {
  testDomain: defaultZapretSettings.testDomain,
  domains: defaultZapretSettings.domains,
  strategy: '',
  routerAddress: '192.168.1.1',
  sshPort: '22',
  version: 'v1.0.7',
  lan: 'lan',
};

export function buildOpenWrtCommands(settings: OpenWrtSettings) {
  const common = buildZapretCommands({ ...settings, directory: defaultZapretSettings.directory });
  const address = settings.routerAddress.trim();
  const version = settings.version.trim();
  const lan = settings.lan.trim();
  const addressError = !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(address) || address.split('.').some(part => Number(part) > 255);
  const portError = !/^\d{1,5}$/.test(settings.sshPort) || Number(settings.sshPort) < 1 || Number(settings.sshPort) > 65535;
  const versionError = !/^v\d+\.\d+\.\d+$/.test(version);
  const lanError = !/^[a-zA-Z0-9_][a-zA-Z0-9_-]{0,31}$/.test(lan);
  const valid = common.valid && !addressError && !portError && !versionError && !lanError;
  const ready = valid && !common.errors.strategy;
  const domains = [...new Set(settings.domains.trim().toLowerCase().split(/[\s,;]+/).filter(Boolean))];
  const strategy = settings.strategy.trim().replace(/\s+/g, ' ');
  const root = `set -eu
[ "$(id -u)" = 0 ] || { echo 'Connect as root first.'; exit 1; }
[ -f /etc/openwrt_release ] || { echo 'This command requires OpenWrt.'; exit 1; }
`;
  const download = `VERSION='${version}'
WORKDIR=$(mktemp -d /tmp/zapret2-guide.XXXXXX)
wget -O "$WORKDIR/release.tar.gz" "https://github.com/bol-van/zapret2/releases/download/$VERSION/zapret2-$VERSION-openwrt-embedded.tar.gz"
tar -xzf "$WORKDIR/release.tar.gz" -C "$WORKDIR"
SOURCE="$WORKDIR/zapret2-$VERSION"
[ -f "$SOURCE/install_easy.sh" ] && [ -f "$SOURCE/blockcheck2.sh" ] || { echo 'Incomplete archive.'; exit 1; }
printf '%s\\n' "$SOURCE" > /tmp/zapret2-guide-source`;
  const source = `SOURCE=$(cat /tmp/zapret2-guide-source 2>/dev/null) || { echo 'Repeat the download step after reboot.'; exit 1; }
case "$SOURCE" in /tmp/zapret2-guide.*/zapret2-v*) ;; *) echo 'Invalid source folder.'; exit 1;; esac
[ -f "$SOURCE/install_easy.sh" ] || { echo 'Repeat the download step.'; exit 1; }`;

  return {
    valid, ready,
    errors: { ...common.errors, routerAddress: addressError, sshPort: portError, version: versionError, lan: lanError },
    ssh: !addressError && !portError ? `ssh -p ${Number(settings.sshPort)} root@${address}` : '',
    prepare: valid ? `${root}df -h /overlay /tmp
if command -v opkg >/dev/null 2>&1; then
  opkg update
  opkg install ca-bundle wget-ssl
elif command -v apk >/dev/null 2>&1; then
  apk update
  apk add ca-bundle wget-ssl
else
  echo 'OpenWrt package manager not found.'; exit 1
fi
${download}
sh "$SOURCE/install_bin.sh"` : '',
    prerequisites: valid ? `${root}${source}
sh "$SOURCE/install_prereq.sh"` : '',
    check: valid ? `${root}${source}
if [ -x /etc/init.d/zapret2 ]; then /etc/init.d/zapret2 stop; fi
cd "$SOURCE"
DOMAINS='${settings.testDomain.trim().toLowerCase()}' IPVS=4 ENABLE_HTTP=0 ENABLE_HTTPS_TLS12=1 ENABLE_HTTPS_TLS13=1 ENABLE_HTTP3=0 SCANLEVEL=quick sh ./blockcheck2.sh` : '',
    configure: ready ? `${root}if [ -f /opt/zapret2/config ]; then
  TARGET=/opt/zapret2
  cp "$TARGET/config" "$TARGET/config.guide-backup"
else
  ${source}
  TARGET="$SOURCE"
fi
cp "$TARGET/config.default" "$TARGET/config"
cat >> "$TARGET/config" <<'ZAPRET_CONFIG'

# Parameters generated by the guide for OpenWrt firewall4 (nftables).
FWTYPE=nftables
DISABLE_IPV6=1
NFQWS2_ENABLE=1
NFQWS2_PORTS_TCP=443
NFQWS2_PORTS_UDP=
NFQWS2_PORTS_TCP_KEEPALIVE=
NFQWS2_PORTS_UDP_KEEPALIVE=
MODE_FILTER=hostlist
GETLIST=
FLOWOFFLOAD=none
OPENWRT_LAN='${lan}'
NFQWS2_OPT="--filter-tcp=443 --filter-l7=tls <HOSTLIST> --payload=tls_client_hello ${strategy}"
ZAPRET_CONFIG
cat > "$TARGET/ipset/zapret-hosts-user.txt" <<'ZAPRET_DOMAINS'
${domains.join('\n')}
ZAPRET_DOMAINS` : '',
    install: valid ? `${root}${source}
sh "$SOURCE/install_easy.sh"` : '',
    status: '/etc/init.d/zapret2 status\nlogread -e zapret2\nlogread -e nfqws2',
    start: '/etc/init.d/zapret2 start',
    stop: '/etc/init.d/zapret2 stop',
    enable: '/etc/init.d/zapret2 enable\n/etc/init.d/zapret2 restart\n/etc/init.d/zapret2 enabled && echo "Autostart enabled"',
    disable: '/etc/init.d/zapret2 disable\n/etc/init.d/zapret2 stop',
    update: valid ? `${root}[ -f /opt/zapret2/config ] || { echo 'Installation not found.'; exit 1; }
BACKUP="/root/zapret2-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BACKUP" -C /opt/zapret2 config ipset init.d/openwrt/custom.d
printf 'Settings backup: %s\\n' "$BACKUP"
${download}
/etc/init.d/zapret2 stop` : '',
    remove: `${root}[ -f /opt/zapret2/uninstall_easy.sh ] || { echo 'Installation not found.'; exit 1; }
sh /opt/zapret2/uninstall_easy.sh`,
    removeFiles: "[ -f /opt/zapret2/uninstall_easy.sh ] && [ ! -e /etc/init.d/zapret2 ] && rm -r /opt/zapret2",
  };
}

import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import ts from 'typescript';

// Exercise the real generator without adding a TS test runner to the project.
const source = readFileSync(new URL('../resources/ts/pages/zapret2/commands.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2021 } });
const { buildZapretCommands, defaultZapretSettings, buildOpenWrtCommands, defaultOpenWrtSettings } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);

test('installation uses the author repository and waits for a measured strategy', () => {
  const commands = buildZapretCommands(defaultZapretSettings);
  assert.equal(commands.valid, true);
  assert.equal(commands.ready, false);
  assert.equal(commands.configure, '');
  assert.match(commands.install, /https:\/\/github.com\/bol-van\/zapret-win-bundle\/archive\/refs\/heads\/master.zip/);
  assert.match(commands.install, /Folder already exists/);
});

test('custom inputs reach installation, testing, config, update and removal', () => {
  const commands = buildZapretCommands({
    directory: 'D:\\Tools\\zapret2', testDomain: 'example.org', domains: 'example.org\nvideo.example.org\nexample.org',
    strategy: '--payload=tls_client_hello --lua-desync=multisplit:pos=1,midsld',
  });
  assert.equal(commands.ready, true);
  for (const key of ['install', 'check', 'configure', 'run', 'autostart', 'stop', 'update', 'remove']) {
    assert.ok(commands[key].includes("$ZapretDir = 'D:\\Tools\\zapret2'"), key);
  }
  assert.match(commands.check, /\$Domains = 'example.org'/);
  assert.match(commands.check, /\$env:DOMAINS = \$Domains/);
  assert.match(commands.check, /& \$Bash -ic '\.\/blockcheck2\.sh'/);
  assert.match(commands.configure, /example.org\nvideo.example.org\n'@/);
  assert.match(commands.configure, /--lua-desync=multisplit:pos=1,midsld/);
  assert.match(commands.run, /'@' \+.*guide.conf/);
  assert.ok(commands.autostart.includes(`$BinaryPath = '"' + $Exe + '" @"' + $Config + '"'`));
  assert.match(commands.autostart, /Invoke-CimMethod .*Change .*PathName = \$BinaryPath/);
  assert.match(commands.update, /Copy-Item -LiteralPath \$ZapretDir -Destination \$Backup/);
  assert.doesNotMatch(commands.remove, /Remove-Item/);
});

test('Windows update skips an identical bundle and backs up a changed one', { skip: process.platform !== 'win32' }, t => {
  const root = mkdtempSync(join(tmpdir(), 'zapret-guide-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const bundle = join(root, 'zapret-win-bundle-master');
  const install = join(root, 'zapret2');
  for (const base of [bundle, install]) {
    for (const name of ['zapret-winws/winws2.exe', 'zapret-winws/lua/zapret-lib.lua', 'zapret-winws/lua/zapret-antidpi.lua', 'cygwin/bin/bash.exe', 'blockcheck/zapret2/blockcheck2.sh']) {
      const path = join(base, name);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, 'current');
    }
  }
  const hosts = join(install, 'zapret-winws/guide-hosts.txt');
  writeFileSync(hosts, 'example.org');
  const update = buildZapretCommands(defaultZapretSettings).update.replace("$ZapretDir = 'C:\\zapret2'", '$ZapretDir = Join-Path $env:TEMP zapret2');
  const run = () => {
    const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `
      function Invoke-WebRequest { param([switch]$UseBasicParsing, $Uri, $OutFile) }
      function Expand-Archive { param($LiteralPath, $DestinationPath)
        Copy-Item (Join-Path $env:TEMP zapret-win-bundle-master) $DestinationPath -Recurse
      }
      function Stop-Service { Set-Content (Join-Path $env:TEMP stopped) yes }
      function Get-CimInstance {}
      ${update}`], { env: { ...process.env, TEMP: root }, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return result.stdout;
  };
  const backups = () => readdirSync(root).filter(name => name.startsWith('zapret2-backup-'));
  assert.match(run(), /Already up to date/);
  assert.deepEqual(backups(), []);
  assert.equal(existsSync(join(root, 'stopped')), false);
  const lua = join(install, 'zapret-winws/lua/zapret-lib.lua');
  writeFileSync(lua, 'outdated');
  assert.match(run(), /Updated\. Backup:/);
  assert.equal(backups().length, 1);
  assert.equal(existsSync(join(root, 'stopped')), true);
  assert.equal(readFileSync(lua, 'utf8'), 'current');
  assert.equal(readFileSync(hosts, 'utf8'), 'example.org');
  assert.match(run(), /Already up to date/);
  assert.equal(backups().length, 1);
});

test('Windows blockcheck receives a space-separated list of validated domains', () => {
  const build = testDomain => buildZapretCommands({ ...defaultZapretSettings, testDomain });
  const commands = build(' YouTube.com ,discord.com, youtube.com ');
  assert.match(commands.check, /^\$Domains = 'youtube\.com discord\.com'$/m);
  assert.match(commands.check, /\$env:DOMAINS = \$Domains/);
  for (const invalid of ['youtube.com, https://discord.com', 'youtube.com,', 'youtube.com, bad;command']) {
    assert.equal(build(invalid).check, '');
  }
});

test('blockcheck lines produce separate TLS and optional QUIC profiles', () => {
  const quic = '--wf-l3=ipv4 --wf-udp-out=443 --payload=quic_initial --lua-desync=fake:blob=fake_default_quic:repeats=1';
  for (const actions of [
    '--lua-desync=multisplit:blob=fake_default_tls:ip_autottl=-5,3-20:pos=2:nodrop:repeats=1 --lua-desync=fakeddisorder:pos=host+1:ip_autottl=-5,3-20',
    '--lua-desync=fake:blob=fake_default_tls:tcp_seq=1000000:repeats=1 --lua-desync=fakedsplit:pos=host+1:tcp_seq=1000000',
  ]) {
    const tls = '--wf-l3=ipv4 --wf-tcp-out=443 --payload=tls_client_hello ' + actions;
    const build = (strategy, quicStrategy) => buildZapretCommands({ ...defaultZapretSettings, strategy, quicStrategy }).configure;
    const config = build(tls, quic);
    assert.equal(config, build('winws2 ' + tls, 'winws2 ' + quic));
    assert.equal(config.match(/--wf-l3=ipv4/g)?.length, 1);
    assert.equal(config.match(/--payload=tls_client_hello/g)?.length, 1);
    assert.ok(config.includes(actions.replace(' ', '\n') + '\n--new\n--filter-udp=443\n--filter-l7=quic\n--hostlist=guide-hosts.txt\n--payload=quic_initial\n--lua-desync=fake:blob=fake_default_quic:repeats=1'));
    assert.doesNotMatch(build(tls, ''), /--new|--wf-udp/);
    assert.equal(build(tls, tls), '');
    assert.equal(build(tls, quic + '; calc'), '');
  }
});

test('invalid paths, domains and shell text cannot become executable commands', () => {
  for (const directory of ['C:\\', 'C:\\Windows', 'C:\\zapret2\\..', "C:\\zapret2'; Stop-Computer", '\\\\server\\zapret2']) {
    const commands = buildZapretCommands({ ...defaultZapretSettings, directory });
    assert.equal(commands.valid, false, directory);
    assert.equal(commands.install, '');
    assert.equal(commands.remove, '');
  }
  for (const testDomain of ['https://youtube.com', 'youtube.com;Stop-Computer', '']) {
    assert.equal(buildZapretCommands({ ...defaultZapretSettings, testDomain }).valid, false);
  }
  for (const strategy of ['--dpi-desync=fake', '--lua-desync=fake; Stop-Computer', '--lua-desync=$(whoami)', "--lua-init=os.execute('bad')", '--lua-desync=fake\n& calc']) {
    const commands = buildZapretCommands({ ...defaultZapretSettings, strategy });
    assert.equal(commands.ready, false, strategy);
    assert.equal(commands.configure, '');
  }
});

test('generated scripts parse in Windows PowerShell without execution', { skip: process.platform !== 'win32' }, () => {
  const commands = buildZapretCommands({ ...defaultZapretSettings, strategy: '--lua-desync=multisplit:pos=1,midsld' });
  const scripts = Object.fromEntries(Object.entries(commands).filter(([, value]) => typeof value === 'string'));
  const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `
    $Scripts = [Console]::In.ReadToEnd() | ConvertFrom-Json
    foreach ($Property in $Scripts.PSObject.Properties) {
      $ParseErrors = $null
      $Tokens = $null
      $null = [System.Management.Automation.Language.Parser]::ParseInput($Property.Value, [ref]$Tokens, [ref]$ParseErrors)
      if ($ParseErrors.Count) { Write-Output ($Property.Name + ': ' + ($ParseErrors | Out-String)); exit 1 }
    }
  `], { input: JSON.stringify(scripts), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('OpenWrt commands use the official binary release and keep per-router inputs', () => {
  const commands = buildOpenWrtCommands({ ...defaultOpenWrtSettings,
    routerAddress: '192.168.8.1', sshPort: '2222', version: 'v1.0.7', lan: 'home',
    testDomain: 'example.org', domains: 'example.org\nvideo.example.org', strategy: '--lua-desync=multisplit:pos=1,midsld',
  });
  assert.equal(commands.ready, true);
  assert.equal(commands.ssh, 'ssh -p 2222 root@192.168.8.1');
  assert.match(commands.prepare, /github.com\/bol-van\/zapret2\/releases\/download/);
  assert.match(commands.prepare, /openwrt-embedded.tar.gz/);
  assert.match(commands.prepare, /opkg install/);
  assert.match(commands.prepare, /apk add/);
  assert.match(commands.check, /DOMAINS='example.org'/);
  assert.match(commands.configure, /OPENWRT_LAN='home'/);
  assert.match(commands.configure, /<HOSTLIST>/);
  assert.match(commands.configure, /example.org\nvideo.example.org/);
  assert.match(commands.install, /install_easy.sh/);
  assert.match(commands.update, /tar -czf.*config ipset init.d\/openwrt\/custom.d/);
  assert.match(commands.remove, /uninstall_easy.sh/);
  assert.doesNotMatch(commands.remove, /rm -r/);
  assert.match(commands.removeFiles, /\[ ! -e \/etc\/init.d\/zapret2 \]/);
});

test('OpenWrt rejects unsafe router inputs and does not reuse an untested strategy', () => {
  assert.equal(buildOpenWrtCommands(defaultOpenWrtSettings).ready, false);
  for (const changes of [
    { routerAddress: '999.1.1.1' }, { routerAddress: '192.168.1.1;reboot' }, { sshPort: '0' }, { sshPort: '65536' },
    { version: 'v1.0.7;reboot' }, { lan: "lan'\nreboot" }, { testDomain: 'https://example.org' },
  ]) {
    const commands = buildOpenWrtCommands({ ...defaultOpenWrtSettings, ...changes });
    assert.equal(commands.valid, false, JSON.stringify(changes));
    assert.equal(commands.prepare, '');
    assert.equal(commands.configure, '');
  }
});

test('OpenWrt shell scripts parse without running router commands', context => {
  const shell = process.platform === 'win32' ? 'sh.exe' : 'sh';
  const probe = spawnSync(shell, ['-n'], { input: '', encoding: 'utf8' });
  if (probe.error?.code === 'ENOENT') {
    context.skip('A POSIX shell is not installed');
    return;
  }
  const commands = buildOpenWrtCommands({ ...defaultOpenWrtSettings, strategy: '--lua-desync=multisplit:pos=1,midsld' });
  for (const [name, value] of Object.entries(commands)) {
    if (typeof value !== 'string') continue;
    const result = spawnSync(shell, ['-n'], { input: value, encoding: 'utf8' });
    assert.equal(result.status, 0, `${name}: ${result.stderr || result.error || ''}`);
  }
});

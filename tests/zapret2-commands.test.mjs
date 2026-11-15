import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
  assert.match(commands.check, /\$env:DOMAINS = 'example.org'/);
  assert.match(commands.configure, /example.org\nvideo.example.org\n'@/);
  assert.match(commands.configure, /--lua-desync=multisplit:pos=1,midsld/);
  assert.match(commands.run, /'@' \+.*guide.conf/);
  assert.match(commands.update, /Copy-Item -LiteralPath \$ZapretDir -Destination \$Backup/);
  assert.doesNotMatch(commands.remove, /Remove-Item/);
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

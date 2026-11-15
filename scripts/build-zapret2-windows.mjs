import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const source = readFileSync(new URL('./zapret2-windows.ps1', import.meta.url), 'utf8');
const output = new URL('../public/scripts/zapret2/', import.meta.url);
mkdirSync(output, { recursive: true });
for (const [file, action] of [['install', 'Install'], ['update', 'Update'], ['uninstall', 'Uninstall']]) {
  // A BOM preserves Russian prompts in Windows PowerShell 5.1.
  writeFileSync(new URL(`zapret2-${file}.ps1`, output), '\uFEFF' + source.replace("$Action = '__ACTION__'", `$Action = '${action}'`).replace(/\r?\n/g, '\r\n'));
}

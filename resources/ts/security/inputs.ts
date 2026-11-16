export const isIPv4 = (value: string) => /^(?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3}$/.test(value)
  && value.split('.').every(part => Number(part) <= 255);
export const isDomain = (value: string) => value.length <= 253
  && /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(value);
export const isHost = (value: string) => isIPv4(value) || isDomain(value);
export const isHostOrIPv6 = (value: string) => {
  if (isHost(value)) return true;
  const address = value.startsWith('[') && value.endsWith(']') ? value.slice(1, -1) : value;
  if (address.length > 45 || !/^[a-fA-F0-9:.]+$/.test(address) || !address.includes(':')) return false;
  try { return new URL(`http://[${address}]/`).hostname.startsWith('['); } catch { return false; }
};
export const isPort = (value: string) => /^\d{1,5}$/.test(value) && Number(value) >= 1 && Number(value) <= 65535;
export const isPath = (value: string) => value.length <= 512 && /^\/(?:[a-zA-Z0-9_.-]+\/?)*$/.test(value)
  && !value.split('/').includes('..') && !value.split('/').includes('.');
export const isVersion = (value: string) => /^v?\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value);
export const isName = (value: string) => /^[a-zA-Z_][a-zA-Z0-9_-]{0,63}$/.test(value);
export const isTextSecret = (value: string) => value.trim().length > 0 && value.length <= 256
  && Array.from(value).every(char => char.charCodeAt(0) >= 32 && char.charCodeAt(0) !== 127);
export const isSafeToken = (value: string) => /^[a-zA-Z0-9_.=-]{1,2048}$/.test(value);
export const isEmail = (value: string) => value.length <= 254 && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(value);
export const isUUID = (value: string) => /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value);
// URL is also embedded in command/systemd/YAML literals: reject shell and control syntax.
export const isSafeHttpsUrl = (value: string) => {
  if (value.length > 2048 || !/^https:\/\/[a-zA-Z0-9./?&=_~%:+,@#-]+$/.test(value)) return false;
  try { const url = new URL(value); return isHost(url.hostname) && !url.username && !url.password; } catch { return false; }
};
export const optional = (check: (value: string) => boolean) => (value: string) => value === '' || check(value);
export const safeExternalUrl = (value: string | undefined) => {
  try { const url = new URL(value ?? ''); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : undefined; } catch { return undefined; }
};
export function validateFields(fields: Record<string, [string, (value: string) => boolean]>) {
  return Object.entries(fields).filter(([, [value, check]]) => !check(value)).map(([label]) => label);
}
export function randomSecret(bytes = 24) {
  const values = new Uint8Array(bytes);
  crypto.getRandomValues(values);
  return Array.from(values, value => value.toString(16).padStart(2, '0')).join('');
}
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));

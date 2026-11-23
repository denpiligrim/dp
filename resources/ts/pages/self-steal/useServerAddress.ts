import { useEffect, useRef, useState } from 'react';
import { COUNTRIES } from '../../components/countries';
import { isDomain, isIPv4 } from '../../security/inputs';

async function lookupIp(domain: string, signal: AbortSignal): Promise<string> {
  const response = await fetch('https://dns.google/resolve?type=A&name=' + encodeURIComponent(domain), { signal });
  if (!response.ok) return '';
  const data = await response.json();
  return data.Answer?.find((rr: { type: number; data: string }) => rr.type === 1 && isIPv4(rr.data))?.data ?? '';
}

async function lookupCountry(ip: string, signal: AbortSignal): Promise<{country: string | null; reason?: string}> {
  const response = await fetch('/api/ip-country/' + ip, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Country service unavailable');
  return response.json();
}

export function useServerAddress(initialDomain: string, sampleIp: string, enabled = true) {
  const [domain, setDomain] = useState(initialDomain);
  const [ip, setIp] = useState(sampleIp);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('Пример адреса');
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => pending.current?.abort(), [enabled]);

  function reset() {
    pending.current?.abort();
    setCode('');
    setStatus('');
  }

  async function resolve(fromDomain: boolean) {
    if (!enabled || (fromDomain ? !isDomain(domain) : !isIPv4(ip))) return;
    reset();
    const request = new AbortController();
    pending.current = request;
    const signal = () => AbortSignal.any([request.signal, AbortSignal.timeout(8000)]);
    let address = ip;
    try {
      if (fromDomain) {
        setStatus('Ищем A-запись…');
        address = await lookupIp(domain, signal());
        if (request.signal.aborted) return;
        setIp(address);
        if (!address) { setStatus('Введите IPv4 вручную'); return; }
      }
      setStatus('Определяем страну…');
      const { country, reason } = await lookupCountry(address, signal());
      if (!request.signal.aborted) {
        setCode(country ?? '');
        setStatus(reason === 'non_public' ? 'Для этого IP страна не назначена. Введите публичный IPv4 сервера.' : 'Страна не указана в базе');
      }
    } catch {
      if (!request.signal.aborted) setStatus(address ? 'Сервис определения страны временно недоступен' : 'Введите IPv4 вручную');
    }
  }

  const country = COUNTRIES.find(item => item.code === code);
  const hint = country ? (new Intl.DisplayNames(['ru'], { type: 'region' }).of(country.code) ?? country.name) : status;
  return {
    domain, ip, countryCode: country?.code, hint,
    editDomain(value: string) { reset(); setDomain(value.trim().toLowerCase()); setIp(''); },
    edit(value: string) { reset(); setIp(value.trim()); },
    resolveDomain: () => resolve(true),
    resolveCountry: () => resolve(false),
  };
}

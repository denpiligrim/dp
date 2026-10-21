import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import '../../sass/wishlist.scss';

type Wish = { id: number; name: string; occupied: boolean; mine: boolean };
const storageKey = 'wishlist.browser.v1';

export default function Wishlist() {
  const [items, setItems] = useState<Wish[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const token = useRef('');
  const pending = useRef(false);
  const ready = useRef(false);

  function apply(next: Wish[], reset = false) {
    setItems(next);
    const own = next.filter(item => item.mine).map(item => item.id);
    setSelected(previous => reset ? own : previous.filter(id => next.some(item => item.id === id && (!item.occupied || item.mine))));
    try {
      localStorage.setItem(storageKey, JSON.stringify({ token: token.current, ids: own }));
    } catch {
      ready.current = false;
      setError('Браузер не сохраняет данные. Разрешите локальное хранилище, чтобы управлять своим выбором.');
    }
  }

  async function fetchItems() {
    const response = await fetch('/api/wishlist', { headers: { 'X-Wishlist-Token': token.current, Accept: 'application/json' }, cache: 'no-store' });
    if (!response.ok) throw new Error('Не удалось загрузить список. Попробуйте ещё раз.');
    return (await response.json()).items as Wish[];
  }

  async function load() {
    setLoading(true);
    setError('');
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
      token.current = /^[a-f0-9]{64}$/.test(stored?.token) ? stored.token : Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, '0')).join('');
      // Persist ownership before any reservation can be sent.
      localStorage.setItem(storageKey, JSON.stringify({ token: token.current, ids: stored?.ids || [] }));
      ready.current = true;
      apply(await fetchItems(), true);
    } catch (e) {
      ready.current = false;
      setError(e instanceof Error ? e.message : 'Не удалось открыть список. Проверьте доступ к хранилищу браузера.');
    } finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  async function save() {
    if (pending.current || !ready.current) return;
    pending.current = true;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/wishlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Wishlist-Token': token.current },
        body: JSON.stringify({ ids: selected }),
      });
      if (response.status === 409) {
        const data = await response.json();
        apply(await fetchItems());
        throw new Error(data.message);
      }
      if (!response.ok) throw new Error('Не удалось сохранить выбор. Повторите попытку.');
      apply((await response.json()).items, true);
      setNotice('Выбор сохранён. Спасибо, что готовите сюрприз!');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Нет соединения. Попробуйте сохранить ещё раз.');
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  const own = items.filter(item => item.mine).map(item => item.id);
  const changed = selected.length !== own.length || selected.some(id => !own.includes(id));
  const available = items.filter(item => !item.occupied).length;

  return <main className="wishlist-page">
    <Helmet><title>Список желаний — Wishlist</title><meta name="description" content="Выберите подарок из списка желаний и сохраните свой выбор." /></Helmet>
    <div className="wishlist-wrap">
      <div className="wishlist-eyebrow"><span /> LITTLE THINGS, BIG JOY</div>
      <header className="wishlist-intro"><div className="wishlist-symbol" aria-hidden="true">✧</div><h1>Список <em>желаний</em></h1><p>Идеи для маленьких и больших сюрпризов.<br />Выберите то, что хочется подарить.</p></header>
      <section className="wishlist-panel" aria-label="Список подарков" aria-busy={loading}>
        <div className="wishlist-panel-heading"><div><span className="wishlist-kicker">WISHLIST</span><h2>Подарки с настроением</h2></div><span className="wishlist-count">{loading ? 'Загрузка…' : `${available} свободно`}</span></div>
        <div className="wishlist-legend"><span><i /> Можно выбрать</span><span><i className="mine" /> Ваш выбор</span><span><i className="taken" /> Уже дарят</span></div>
        {loading ? <div className="wishlist-empty">Собираем желания…</div> : items.length === 0 ? <div className="wishlist-empty"><span aria-hidden="true">✧</span><h3>Желания скоро появятся</h3><p>Загляните чуть позже — здесь будут идеи подарков.</p></div> : <div className="wishlist-items">{items.map((item, index) => {
          const disabled = (item.occupied && !item.mine) || saving || !ready.current;
          const checked = selected.includes(item.id);
          return <label key={item.id} className={`wishlist-item ${disabled && !saving ? 'is-taken' : ''} ${checked ? 'is-selected' : ''}`}>
            <span className="wishlist-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="wishlist-item-name">{item.name}<small>{item.occupied && !item.mine ? 'Уже кто-то подарит' : item.mine ? 'Забронировано вами' : checked ? 'Не забудьте сохранить выбор' : 'Будет приятно получить'}</small></span>
            <input type="checkbox" checked={checked} disabled={disabled} onChange={() => { setSelected(current => checked ? current.filter(id => id !== item.id) : [...current, item.id]); setNotice(''); }} aria-label={item.name} />
          </label>;
        })}</div>}
        <div className="wishlist-actions"><div><strong>Выбрано: {selected.length}</strong><p>Можно вернуться и изменить решение.</p></div><button type="button" disabled={loading || saving || !ready.current || !changed} onClick={save}>{saving ? 'Сохраняем…' : 'Сохранить выбор'}<span aria-hidden="true"> ↗</span></button></div>
      </section>
      <div aria-live="polite">{error && <div className="wishlist-message is-error" role="alert">{error} {!ready.current && <button type="button" onClick={load}>Повторить</button>}</div>}{notice && <div className="wishlist-message">{notice}</div>}</div>
      <p className="wishlist-note"><span aria-hidden="true">◈</span> Ваш выбор запоминается в этом браузере.<br />Если очистить его данные или открыть другой браузер, изменить бронь не получится.</p>
      <div className="wishlist-signoff">С заботой о будущих сюрпризах <span>✧</span></div>
    </div>
  </main>;
}

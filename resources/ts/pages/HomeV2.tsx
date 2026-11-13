import { KeyboardEvent, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import useMediaQuery from '@mui/material/useMediaQuery';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import PixelAuthor from '../components/PixelAuthor';
import seo from '../../data/home-v2-seo.json';
import '../../sass/home-v2.scss';

const topics = [
  {
    id: 'freedom', title: 'Свободный интернет', short: 'Обход блокировок', icon: PublicOutlinedIcon, color: 'mint', file: 'internet.config',
    comment: '// чтобы привычные сервисы оставались под рукой', variable: 'connection', value: 'без лишних преград',
    heading: 'Интернет должен соединять.', accent: 'Давай вернём ему эту функцию.',
    text: 'Разбираюсь в обходе блокировок и показываю, как настроить свой VPN, прокси и маршрутизацию. С командами, пояснениями и ответами на «а почему у меня не так?».',
    tags: ['VPN', 'VLESS', 'Amnezia', 'CDN'],
    links: [{ to: '/guides/ultimate-vpn', title: 'Свой VPN: от сервера до подключения', detail: 'SSH, 3x-ui, сертификаты и клиенты', tag: 'ГАЙД' }, { to: '/guides/cdn-setup', title: 'CDN для VLESS XHTTP', detail: 'Разбираем настройку по шагам', tag: 'ПРАКТИКА' }],
    source: 'https://youtu.be/-9UJ_Bz03_s', sourceLabel: 'Посмотреть разбор на YouTube',
  },
  {
    id: 'hacks', title: 'Технические лайфхаки', short: 'Меньше рутины', icon: TerminalOutlinedIcon, color: 'lavender', file: 'lifehacks.ts',
    comment: '// небольшая настройка — большая разница', variable: 'everyday', value: 'проще, чем вчера',
    heading: 'А что, так тоже можно было?', accent: 'Да. Сейчас покажу как.',
    text: 'Раздельное туннелирование, настройки серверов и полезные инструменты. Собираю приёмы, которые экономят время и помогают подружиться с техникой.',
    tags: ['Маршрутизация', 'Linux', 'SSH', 'Серверы'],
    links: [{ to: 'https://t.me/denpiligrim_web/1011', title: 'Каким приложениям нужен VPN?', detail: 'Разбираемся с раздельным туннелированием', tag: 'ЛАЙФХАК' }, { to: '/guides/yandex-cloud-vm', title: 'Своя виртуальная машина', detail: 'Создаём сервер в Yandex Cloud', tag: 'ГАЙД' }],
    source: 'https://youtube.com/shorts/JdQEf1qqVGI', sourceLabel: 'Короткая видеоинструкция',
  },
  {
    id: 'crypto', title: 'Криптовалюта', short: 'Личный опыт / web3', icon: CurrencyBitcoinIcon, color: 'peach', file: 'crypto.notes',
    comment: '// исследовать, задавать вопросы, делать выводы', variable: 'crypto', value: 'любопытство + здравый смысл',
    heading: 'Крипта без хрустального шара.', accent: 'Опыт, вопросы и технологии.',
    text: 'Интересуюсь криптовалютой и DeFi, делюсь наблюдениями и историями из собственного опыта. Что происходит за интерфейсом кошелька и где технология встречается с реальностью?',
    tags: ['Криптовалюта', 'DeFi', 'Web3', 'Кошельки'],
    links: [{ to: 'https://t.me/denpiligrim_web/997', title: 'Кошелёк, DeFi и неожиданные вопросы', detail: 'Личная история из Telegram', tag: 'ОПЫТ' }, { to: '/crypto', title: 'Криптораздел сайта', detail: 'Данные и инструменты для наблюдения за рынком', tag: 'ИНСТРУМЕНТЫ' }],
    source: 'https://t.me/denpiligrim_web', sourceLabel: 'Читать заметки в Telegram',
  },
  {
    id: 'code', title: 'Код и свои проекты', short: 'Из идеи в инструмент', icon: CodeRoundedIcon, color: 'blue', file: 'projects.tsx',
    comment: '// делаю то, чем хочется пользоваться самому', variable: 'idea', value: 'работающий инструмент',
    heading: 'Когда готового решения мало,', accent: 'пишу своё.',
    text: 'Разрабатываю сайты и инструменты, а ещё делюсь процессом. Например, 3DP-MANAGER помогает работать с VPN-сервером — его развитие тоже можно наблюдать в блоге.',
    tags: ['React', 'TypeScript', 'PHP', '3DP-MANAGER'],
    links: [{ to: '/3dp-manager', title: 'Знакомься: 3DP-MANAGER', detail: 'Мой инструмент для работы с VPN-сервером', tag: 'ПРОЕКТ' }, { to: '/dev', title: 'Веб-разработка', detail: 'Сайты, интерфейсы и задачи, которые я решаю', tag: 'ПОРТФОЛИО' }],
    source: 'https://t.me/denpiligrim_web/1014', sourceLabel: 'Что дальше: планы разработки',
  },
];

function ResourceLink({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return to.startsWith('/') ? <Link to={to} className={className}>{children}</Link> : <a href={to} className={className} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function TopicExplorer() {
  const [active, setActive] = useState(0);
  const isNarrow = useMediaQuery('(max-width: 720px)');
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const topic = topics[active];
  const changeWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % topics.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + topics.length - 1) % topics.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = topics.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <div className="lab-explorer" data-color={topic.color}>
      <div className="lab-windowbar"><span className="lab-windowdots" aria-hidden="true"><i /><i /><i /></span><span>denpiligrim / explore</span><span className="lab-live">interactive mode</span></div>
      <div className="lab-explorer-body">
        <div className="lab-files">
          <p className="lab-micro">ВЫБЕРИ, ЧТО ИНТЕРЕСНО</p>
          <div role="tablist" aria-label="Темы блога" aria-orientation={isNarrow ? 'horizontal' : 'vertical'}>
            {topics.map((item, index) => {
              const Icon = item.icon;
              return <button type="button" role="tab" id={`topic-${item.id}`} aria-controls={`panel-${item.id}`} aria-selected={index === active} tabIndex={index === active ? 0 : -1} ref={node => { tabsRef.current[index] = node; }} key={item.id} data-color={item.color} onClick={() => setActive(index)} onKeyDown={event => changeWithKeyboard(event, index)}>
                <Icon aria-hidden="true" /><span><strong>{item.title}</strong><small>{item.short}</small></span><span className="lab-tab-arrow" aria-hidden="true">↗</span>
              </button>;
            })}
          </div>
          <div className="lab-files-note"><span aria-hidden="true">↳</span> Любопытство —<br />хорошая точка входа.</div>
        </div>
        <div className="lab-editor">
          {topics.map((item, index) => (
            <article role="tabpanel" id={`panel-${item.id}`} aria-labelledby={`topic-${item.id}`} tabIndex={0} hidden={active !== index} key={item.id}>
              <div className="lab-file-tab"><item.icon aria-hidden="true" />{item.file}<span aria-hidden="true">×</span></div>
              <div className="lab-editor-content">
                <div className="lab-code-preview" aria-label="Заметка в стиле кода">
                  <span className="lab-line"><i aria-hidden="true">01</i><span className="syntax-comment">{item.comment}</span></span>
                  <span className="lab-line"><i aria-hidden="true">02</i><code><span className="syntax-keyword">const</span> {item.variable} <span className="syntax-punctuation">=</span> <span className="syntax-string">'{item.value}'</span>;</code></span>
                </div>
                <h3>{item.heading}<br /><span>{item.accent}</span></h3>
                <p className="lab-topic-description">{item.text}</p>
                <div className="lab-tags">{item.tags.map(tag => <code key={tag}>{tag}</code>)}</div>
                <p className="lab-micro lab-start-label">С ЧЕГО НАЧАТЬ</p>
                <div className="lab-resources">{item.links.map(link => <ResourceLink to={link.to} className="lab-resource" key={link.to}><span><small>{link.tag}</small><strong>{link.title}</strong><span>{link.detail}</span></span><ArrowOutwardIcon aria-hidden="true" /></ResourceLink>)}</div>
                <a className="lab-source-link" href={item.source} target="_blank" rel="noopener noreferrer">{item.sourceLabel}<span aria-hidden="true">↗</span></a>
              </div>
            </article>
          ))}
          <div className="lab-statusbar"><span>✓ из личного опыта</span><span>UTF-8 <span aria-hidden="true">·</span> curiosity: true</span></div>
        </div>
      </div>
    </div>
  );
}

export default function HomeV2() {
  return (
    <main className="home-lab">
      <Helmet defer={false}>
        <html lang="ru" />
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={seo.url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="DenPiligrim" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={seo.url} />
        <meta property="og:image" content={seo.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="DenPiligrim — технологии понятнее, интернет свободнее" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.image} />
        <meta name="twitter:image:alt" content="DenPiligrim — технологии понятнее, интернет свободнее" />
        <script type="application/ld+json">{JSON.stringify(seo.schema)}</script>
      </Helmet>
      <div className="lab-container">
        <div className="lab-topline"><span><b aria-hidden="true">✳</b> ЛИЧНАЯ ЛАБОРАТОРИЯ DENPILIGRIM</span><span className="lab-top-note">код · свобода · любопытство</span></div>
        <section className="lab-hero" aria-labelledby="lab-title">
          <div className="lab-intro">
            <p className="lab-eyebrow"><span /> ПРИВЕТ. Я DENPILIGRIM.</p>
            <h1 id="lab-title">Технологии<br /><span>понятнее.</span><br />Интернет <em>свободнее.</em></h1>
            <p className="lab-lead">{seo.intro}</p>
            <div className="lab-hero-actions"><Link className="lab-button lab-button-primary" to="/guides">Найти полезный гайд <ArrowOutwardIcon /></Link><a className="lab-button lab-button-quiet" href="#explore">Что здесь интересного <span aria-hidden="true">↓</span></a></div>
            <div className="lab-hero-socials"><a href={seo.socials.youtube} target="_blank" rel="noopener noreferrer"><YouTubeIcon />YouTube <span>смотрим</span></a><a href={seo.socials.telegram} target="_blank" rel="noopener noreferrer"><TelegramIcon />Telegram <span>обсуждаем</span></a></div>
          </div>
          <PixelAuthor />
        </section>
        <div className="lab-ticker" aria-label="Темы сайта"><span><PublicOutlinedIcon />обход блокировок</span><span><TerminalOutlinedIcon />технические лайфхаки</span><span><CurrencyBitcoinIcon />криптовалюта</span><span><CodeRoundedIcon />свои проекты</span></div>
        <section className="lab-explore-section" id="explore" aria-labelledby="lab-explore-heading">
          <div className="lab-section-heading"><div><p className="lab-eyebrow">01 / ДАВАЙ РАЗБЕРЁМСЯ</p><h2 id="lab-explore-heading">Сложное — <code>по полочкам.</code></h2></div><p>Я тестирую, собираю и объясняю.<br />Ты выбираешь, что хочется узнать.</p></div>
          <div className="lab-about"><span className="lab-about-bracket" aria-hidden="true">{'{ }'}</span><p>Здесь я делюсь <code className="syntax-mint">полезными гайдами</code>, рассказываю про <code className="syntax-lavender">обход блокировок</code>, нахожу <code className="syntax-blue">технические лайфхаки</code> и исследую <code className="syntax-peach">криптовалюту</code>. Без заумного тона: с примерами, личным опытом и желанием докопаться до сути.</p></div>
          <TopicExplorer />
          <div className="lab-follow"><div className="lab-follow-copy"><span className="lab-follow-icon" aria-hidden="true">↗</span><div><h3>Продолжим за пределами этой вкладки?</h3><p>Видеоразборы — на YouTube. Находки, заметки и общение — в Telegram.</p></div></div><div className="lab-follow-links"><a href={seo.socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube-канал DenPiligrim"><YouTubeIcon /><span>YouTube</span><ArrowOutwardIcon /></a><a href={seo.socials.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram-канал DenPiligrim"><TelegramIcon /><span>Telegram</span><ArrowOutwardIcon /></a></div></div>
        </section>
        <div className="lab-bottom"><span><span className="syntax-keyword">return</span> curiosity <span className="syntax-punctuation">+</span> practice;</span><Link to="/">Прежняя главная ↗</Link></div>
      </div>
    </main>
  );
}

import type { GuideLink, GuidePartner, GuideStep } from '../../components/guides/types';
import IshostingIcon from '../../svgIcons/IshostingIcon';
import BegetIcon from '../../svgIcons/BegetIcon';
import GikIcon from '../../svgIcons/GikIcon';

export const guideSteps: GuideStep[] = [
  { id: 'ssl-cert', title: 'SSL-сертификат', detail: 'Certbot и HTTPS', description: 'Подготовим сервер и выпустим сертификат для HTTPS.' },
  { id: 'website', title: 'Сайт и Nginx', heading: 'Сайт и прокси Nginx', detail: 'Страница и проксирование', description: 'Создадим страницу-заглушку и настроим передачу запросов в Xray.' },
  { id: '3x-ui', title: 'Панель 3x-ui', heading: 'Панель управления 3x-ui', detail: 'Установка и доступ', description: 'Установим Xray, подключим сертификат и откроем доступ к панели.' },
  { id: 'cdn-resource', title: 'Подключение CDN', detail: 'Источник и домен', description: 'Укажем источник, выберем домен и отключим кеширование.' },
  { id: 'xhttp-inbound', title: 'VLESS XHTTP', detail: 'Инбаунд и клиент', description: 'Соберём конфигурацию инбаунда и добавим клиента.' },
];

export const partners: GuidePartner[] = [
  { label: 'Аренда зарубежного сервера', detail: 'is*hosting', href: 'https://ishosting.io/affiliate/MjIwOSM4', icon: <IshostingIcon />, sponsored: true },
  { label: 'CDN и виртуальные серверы', detail: 'Бегет', href: 'https://beget.com/p1519472', icon: <BegetIcon />, sponsored: true },
  { label: 'VPN для Wi-Fi и мобильного интернета', detail: 'Gik VPN', href: 'https://t.me/Gik_VPN_Bot?start=ref9I0EryhK', icon: <GikIcon />, sponsored: true },
];

export const resourceLinks: GuideLink[] = [
  { label: 'Сервер · is*hosting', href: 'https://ishosting.io/affiliate/MjIwOSM4', sponsored: true },
  { label: 'CDN · Бегет', href: 'https://beget.com/p1519472/cloud/cdn', sponsored: true },
  { label: 'CDN · Selectel', href: 'https://selectel.ru/?ref_code=b25e58bc73', sponsored: true },
];

export const moreLinks: GuideLink[] = [
  { label: 'Amnezia Premium · скидка 15%', href: 'https://storage.googleapis.com/amnezia/amnezia.org?m-path=premium&arf=PDREDMECND8VNTBJ&coupon=DENPILIGRIM', sponsored: true },
  { label: 'CDN · VK Cloud', href: 'https://cloud.vk.com/cdn/' },
  { label: 'CDN · Timeweb', href: 'https://timeweb.cloud/r/gw781521', sponsored: true },
  { label: 'CDNvideo', href: 'https://www.cdnvideo.ru/solutions/cdn-for-website-acceleration/' },
  { label: 'VPN · Gik', href: 'https://t.me/Gik_VPN_Bot?start=ref9I0EryhK', sponsored: true },
];

import profile from '../../../data/ru-routing-profile.json';

export function routingProfileUrl(app: 'happ' | 'incy') {
  return `${app}://routing/add/${btoa(JSON.stringify(profile))}`;
}

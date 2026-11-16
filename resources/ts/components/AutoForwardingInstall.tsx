import { Box, TextField, Typography } from '@mui/material';
import { GuideCodeBlock } from './guides/GuideCodeBlock';
import { isIPv4 } from '../security/inputs';

interface Props {
  originIp: string;
  intermediateIp: string;
  setOriginIp: (ip: string) => void;
  setIntermediateIp: (ip: string) => void;
}

export default function AutoForwardingInstall({ originIp, intermediateIp, setOriginIp, setIntermediateIp }: Props) {
  const valid = isIPv4(originIp) && isIPv4(intermediateIp);
  return <Box className="guide-panel" sx={{ my: 4 }}>
    <Typography variant="h5" gutterBottom>Установка перенаправления через SSH</Typography>
    <Typography paragraph>Подключитесь к промежуточному серверу в своём терминале. Пароль или SSH-ключ вводите только в терминале.</Typography>
    <TextField fullWidth label="IP основного сервера" value={originIp} onChange={event => setOriginIp(event.target.value.trim())} error={!isIPv4(originIp)} sx={{ mb: 2 }} />
    <TextField fullWidth label="IP промежуточного сервера" value={intermediateIp} onChange={event => setIntermediateIp(event.target.value.trim())} error={!isIPv4(intermediateIp)} sx={{ mb: 2 }} />
    {valid && <>
      <GuideCodeBlock title="Терминал · подключение к промежуточному серверу" code={`ssh root@${intermediateIp}`} />
      <GuideCodeBlock title="SSH-терминал · промежуточный сервер" code={`ORIGIN_IP='${originIp}' bash -c "$(curl -fsSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/ba6db6edd57c090ee848f0ba5b8559f913f457f2/forwarding_install.sh)"`} />
    </>}
  </Box>;
}

import { ReactNode } from 'react';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TelegramIcon from '@mui/icons-material/Telegram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { GuideSupportButton } from './GuidePage';

export interface GuideHeaderProps {
  title: ReactNode;
  intro: ReactNode;
  category?: string;
  eyebrow?: string;
  tags?: string[];
  stepCount?: number;
  updatedLabel?: string;
  telegramUrl?: string;
  settingsHref?: string;
  videoUrl?: string;
  onVideoClick?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
}

export function GuideHeader({ title, intro, category = 'СЕТИ И VPN', eyebrow = 'ПОШАГОВЫЙ ГАЙД', tags = [], stepCount,
  updatedLabel, telegramUrl = 'https://t.me/denpiligrim_web', settingsHref, videoUrl, onVideoClick, actions, children }: GuideHeaderProps) {
  const count = stepCount ?? 0;
  const stepWord = count % 100 >= 11 && count % 100 <= 14 ? 'шагов' : count % 10 === 1 ? 'шаг' : count % 10 >= 2 && count % 10 <= 4 ? 'шага' : 'шагов';
  const labels = stepCount === undefined ? tags : [...tags, `${stepCount} ${stepWord}`];
  const separator = typeof title === 'string' ? title.indexOf(':') : -1;
  const heading = typeof title === 'string' && separator >= 0 ? <><span>{title.slice(0, separator + 1)}</span>{title.slice(separator + 1)}</> : title;
  return (
    <Box component="header" className="guide-hero">
      <Box className="guide-hero-topline">
        <Stack direction="row" spacing={1} className="guide-eyebrow"><span>{category}</span><span className="guide-dot" /><span>{eyebrow}</span></Stack>
        {telegramUrl && <Chip component="a" href={telegramUrl} target="_blank" rel="noopener noreferrer" clickable icon={<TelegramIcon />} label="Telegram-канал" size="small" variant="outlined" className="guide-telegram" />}
      </Box>
      <Typography component="h1">{heading}</Typography>
      <Typography component="p" className="guide-lead">{intro}</Typography>
      {(labels.length > 0 || updatedLabel) && (
        <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} className="guide-tags">
          {labels.map(tag => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
          {updatedLabel && <span className="guide-updated">{updatedLabel}</span>}
        </Stack>
      )}
      <Box className="guide-hero-actions">
        {actions ?? <>
          {settingsHref && <Button component="a" href={settingsHref} variant="contained" endIcon={<ArrowForwardIcon />}>Настроить параметры</Button>}
          <GuideSupportButton startIcon={<FavoriteBorderIcon />} />
          {videoUrl && <Button component="a" href={videoUrl} target="_blank" rel="noopener noreferrer" startIcon={<YouTubeIcon sx={{ color: '#ff0000' }} />} variant="text">Смотреть видео</Button>}
          {onVideoClick && <Button onClick={onVideoClick} startIcon={<YouTubeIcon sx={{ color: '#ff0000' }} />} variant="text">Смотреть видео</Button>}
        </>}
      </Box>
      {children}
    </Box>
  );
}

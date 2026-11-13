import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid2 as Grid, IconButton, Stack, Typography } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import BannerHosting from './BannerHosting';
import BannerBeget from './BannerBeget';

type Channel = { title: string; url: string; description: string; subscriber_count: number | null };
type Video = { id: string; title: string; published_at: string; url: string; thumbnail: string };

export default function YouTubeBlog() {
  const { t, i18n } = useTranslation();
  const [channel, setChannel] = useState<Channel>({ title: 'DenPiligrim', url: 'https://www.youtube.com/@denpiligrim', description: '', subscriber_count: null });
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    axios.get('/api/youtube/channel', { signal: controller.signal })
      .then(({ data }) => {
        setChannel(data.channel);
        setVideos(data.videos);
      })
      .catch(error => {
        if (controller.signal.aborted) return;
        if (error.response?.data?.channel) setChannel(error.response.data.channel);
        setError(true);
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);

  return (
    <>
      <Grid size={{ xs: 12, sm: 6, md: 4 }} className="blog-channel">
        <Card className="blog-channel-card" variant="outlined" sx={{ position: 'sticky', top: '16px' }}>
          <CardContent>
            <Typography variant="h6" component="h1">{t('youtubeChannel')}</Typography>
            <Box sx={{ mt: 3 }}>
              <Stack direction="row" spacing={3}>
                <IconButton className="blog-youtube-icon" size="large" href={channel.url} target="_blank" rel="noopener noreferrer" aria-label={t('youtubeChannel')}><YouTubeIcon fontSize="large" /></IconButton>
                <Box>
                  <Typography variant="h6" component="h2" fontWeight={600}>{channel.title}<IconButton size="small" href={channel.url} target="_blank" rel="noopener noreferrer" aria-label={t('youtubeChannel')}><OpenInNewIcon fontSize="small" /></IconButton></Typography>
                  <Typography className="blog-youtube-subscribers" variant="caption" component="p" gutterBottom aria-live="polite">{loading ? '…' : channel.subscriber_count === null ? '—' : new Intl.NumberFormat(i18n.language === 'ru' ? 'ru-RU' : 'en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(channel.subscriber_count)} {t('subscribers')}</Typography>
                  <Typography variant="body1" component="p" whiteSpace="pre-line">{channel.description || t('youtubeDescription')}</Typography>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }} className="blog-feed blog-youtube-feed" aria-busy={loading}>
        {loading ? <Box className="blog-feed-state" role="status"><CircularProgress size={30} aria-label={t('youtubeLoading')} /></Box> : error ? (
          <Box className="blog-feed-state" role="status"><Typography>{t('youtubeUnavailable')}</Typography><Button onClick={() => setAttempt(value => value + 1)}>{t('blogRetry')}</Button></Box>
        ) : videos.length === 0 ? <Box className="blog-feed-state" role="status"><Typography>{t('youtubeEmpty')}</Typography></Box> : videos.map(video => (
          <Card className="blog-post blog-video" component="a" href={video.url} target="_blank" rel="noopener noreferrer" key={video.id} aria-label={`${video.title} — ${t('youtubeWatch')}`} variant="outlined">
            <Box className="blog-video-cover"><CardMedia component="img" image={video.thumbnail} alt={video.title} loading="lazy" /><PlayArrowRoundedIcon className="blog-video-play" aria-hidden="true" /></Box>
            <CardContent>
              <Typography className="blog-video-title" component="h2" variant="h6">{video.title}</Typography>
              <Typography className="blog-post-meta" component="p" variant="caption"><time dateTime={video.published_at}>{new Date(video.published_at).toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : 'en-US')}</time><OpenInNewIcon aria-hidden="true" /></Typography>
            </CardContent>
          </Card>
        ))}
        {!loading && <Box className="blog-read-more" textAlign="center"><Button href={channel.url} target="_blank" rel="noopener noreferrer">{t('youtubeMore')}</Button></Box>}
      </Grid>
      <Grid size={{ xs: 12, md: 4 }} className="blog-promos">{i18n.language === 'ru' ? [<BannerHosting variant="mobile" />, <BannerBeget variant="mobile" />][Math.floor(Math.random() * 2)] : <BannerHosting variant="mobile" />}</Grid>
    </>
  );
}

import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid2 as Grid, IconButton, Link, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TelegramIcon from '@mui/icons-material/Telegram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RenderTextWithLinks from '../components/RenderTextWithLinks';
import { Helmet } from 'react-helmet';
import BannerHosting from '../components/BannerHosting';
import BannerBeget from '../components/BannerBeget';
import YouTubeBlog from '../components/YouTubeBlog';
import '../../sass/blog.scss';

const Blog = () => {

  const navigator = useNavigate();
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const [posts, setPosts] = useState([]);
  const [platform, setPlatform] = useState<'telegram' | 'youtube'>('telegram');
  const [postsError, setPostsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [subscribersLoading, setSubscribersLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    axios.get('/api/telegram/subscribers', { signal: controller.signal })
      .then(({ data }) => {
        const count = data.subscriber_count;
        setSubscriberCount(Number.isInteger(count) && count >= 0 ? count : null);
      })
      .catch(() => {
        if (!controller.signal.aborted) setSubscriberCount(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setSubscribersLoading(false);
      });
    return () => controller.abort();
  }, []);

  const translatePost = async (text: string, postId: number) => {
    try {
      const response = await axios.post('/api/translate', {
        text: text,
        post_id: postId
      });
      const updatedPosts = posts.map(post => {
        if (post.message_id === postId) {
          return {
            ...post,
            text_en: response.data.translated_text
          };
        }
        return post;
      });

      setPosts(updatedPosts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Запрос на сервер для получения данных
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (error) {
        setPostsError(true);
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const telegramUsername = posts[0]?.chat_username ?? 'denpiligrim_web';

  return (
    <main className="blog-lab"><div className="blog-container">
      <Helmet defer={false}>
        <meta name="description" content="Personal Telegram and YouTube channels of private developer and crypto-enthusiast DenPiligrim." />
        <meta name="keywords" content="site, development, service, programmer, frontend, backend, react, blog, telegram" />
        <meta property="og:title" content={t('titleBlog')} />
        <meta property="og:description" content="Personal Telegram and YouTube channels of private developer and crypto-enthusiast DenPiligrim." />
        <title>{t('titleBlog')}</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/blog'} />
        <script type="application/ld+json">
          {JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Homepage",
                  "item": "https://denpiligrim.ru/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": import.meta.env.VITE_APP_URL + '/blog'
                }
              ]
            }
          )}
        </script>
      </Helmet>
      <Grid container className="blog-navigation">
        <Grid size={{ xs: 12 }} pt={3} pb={1}>
          <Button variant="text" startIcon={<ArrowBackIosIcon />} onClick={() => navigator('/')}>
            {t('mainPage')}
          </Button>
        </Grid>
      </Grid>
      <Tabs className="blog-platforms" value={platform} onChange={(_, value) => setPlatform(value)} aria-label={t('blogSources')}>
        <Tab id="blog-tab-telegram" aria-controls="blog-feed-panel" value="telegram" icon={<TelegramIcon />} iconPosition="start" label="Telegram" />
        <Tab id="blog-tab-youtube" aria-controls="blog-feed-panel" value="youtube" icon={<YouTubeIcon />} iconPosition="start" label="YouTube" />
      </Tabs>
      <Grid container spacing={3} className="blog-layout" role="tabpanel" id="blog-feed-panel" aria-labelledby={`blog-tab-${platform}`}>
        {platform === 'youtube' ? <YouTubeBlog /> : <>
        <Grid size={{ xs: 12, sm: 6, md: 4 }} className="blog-channel">
          <Card className="blog-channel-card" variant="outlined" sx={{ position: 'sticky', top: '16px' }}>
            <CardContent>
              <Typography variant='h6' component='h1'>{t('telegramChat')}</Typography>
              <Box sx={{
                width: '100%',
                display: 'flex',
                mt: 3,
                alignItems: 'center'
              }}>
                <Stack direction="row" spacing={3}>
                  <Box>
                    <IconButton
                      sx={{
                        backgroundColor: theme.palette.action.hover,
                        "&:hover": {
                          backgroundColor: '#3390ec'
                        },
                        transition: 'all 0.5s ease'
                      }}
                      size='large'
                      href={'https://t.me/' + telegramUsername}
                      target='_blank'
                    >
                      <TelegramIcon fontSize='large' />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography variant='h6' component='h2' fontWeight={600}>
                      {posts[0]?.chat_title ?? 'DenPiligrim'}
                      <IconButton
                        size='small'
                        href={'https://t.me/' + telegramUsername}
                        target='_blank'
                      >
                        <OpenInNewIcon fontSize='small' />
                      </IconButton>
                    </Typography>
                    <Typography className="blog-subscriber-count" variant='caption' component='p' gutterBottom sx={{ color: theme.palette.text.secondary }} aria-live="polite">{subscriberCount === null ? (subscribersLoading ? '…' : '—') : subscriberCount.toLocaleString(i18n.language === 'ru' ? 'ru-RU' : 'en-US')} {t('followers')}</Typography>
                    <Typography variant='body1' component='p' whiteSpace='pre-line'>{t('telegramDescr')}</Typography>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }} className="blog-feed">
          {loading && <Box className="blog-feed-state" role="status"><CircularProgress size={30} /></Box>}
          {postsError && <Box className="blog-feed-state" role="status"><Typography>{t('blogPostsUnavailable')}</Typography></Box>}
          {posts.map((post, i) => (
            <Card className="blog-post" key={post.message_id} sx={{ width: '100%', mx: 'auto', mt: i !== 0 ? 2 : 0 }} variant='outlined'>
              {post.photo && (
                <CardMedia
                  component="img"
                  image={post.photo}
                  alt={'Telegram Post №' + post.message_id}
                  sx={{ objectFit: 'contain', maxHeight: 500, background: 'linear-gradient(0deg, rgba(18,18,18,1) 0%, rgba(39,39,39,1) 100%)' }}
                />
              )}
              <CardContent>
                <Typography className="blog-post-text" variant="body1" component="div" whiteSpace="pre-line" gutterBottom>
                  {i18n.language === 'en' && post.hasOwnProperty('text_en') ? (
                    <RenderTextWithLinks key={'post_text_en_' + post.message_id} text={post.text_en} />
                  ) : (
                    <RenderTextWithLinks key={'post_text_' + post.message_id} text={post.text} />
                  )}
                </Typography>
                <Typography className="blog-post-meta" variant="caption" component="p" color="textSecondary" display="flex" alignItems="end">
                  <Link href={'https://t.me/' + post.chat_username} target="_blank" color="inherit" underline="always">
                    {post.chat_title}
                  </Link>
                  ,&nbsp;{new Date(post.date).toLocaleDateString()}
                  {i18n.language === 'en' && !post.hasOwnProperty('text_en') && (
                    <IconButton
                      sx={{ marginLeft: 1, marginBottom: -0.5 }}
                      title='Translate post to English'
                      onClick={() => translatePost(post.text, post.message_id)}
                    >
                      <TranslateIcon />
                    </IconButton>
                  )}
                  <IconButton
                    sx={{ float: 'right', marginLeft: 'auto', marginBottom: -0.5 }}
                    href={'https://t.me/' + post.chat_username + '/' + post.message_id}
                    target='_blank'
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </Typography>
              </CardContent>
            </Card>
          ))}
          <Box className="blog-read-more" width='100%' textAlign='center'>
            <Link variant='caption' href={'https://t.me/' + telegramUsername} target="_blank" color="textSecondary" underline="always">
              {t('readMore')}
            </Link>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} className="blog-promos">
          {i18n.language === 'ru' ? [<BannerHosting variant='mobile' />, <BannerBeget variant='mobile' />][Math.floor(Math.random() * 2)] : <BannerHosting variant='mobile' />}
        </Grid>
        </>}
      </Grid>
    </div></main>
  )
}

export default Blog

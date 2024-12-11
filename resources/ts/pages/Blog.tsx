import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid2 as Grid, IconButton, Link, Stack, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as cheerio from 'cheerio';

const renderTextWithLinks = (text: string): React.ReactNode => {
  const urlRegex = /(https?:\/\/[\w._-]+(?:\/[\w._-]*)*)/g;

  const parts = text.split(urlRegex);

  let firstTelegramLink: string | null = null;

  const nodes = parts.map((part, index) => {
    if (urlRegex.test(part)) {
      if (!firstTelegramLink && part.startsWith('https://t.me')) {
        firstTelegramLink = part;
      }

      return (
        <Link key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</Link>
      );
    }

    return <span key={index}>{part}</span>;
  });

  if (firstTelegramLink) {
    axios.get('/fetch-html?url=' + encodeURIComponent(firstTelegramLink))
      .then(res => {
        const data = res.data;

        const $ = cheerio.load(data);

        const channelName = $('meta[property="og:title"]').attr('content') || '';
        const messageText = $('meta[property="og:description"]').attr('content') || '';

        console.log(channelName);
        console.log(messageText);        

        if (channelName && messageText) {
          nodes.push(
            <Card sx={{ width: '100%', mt: 2, background: '#272727' }} variant='outlined'>
              <CardContent>
                <Typography variant="body1">
                  {channelName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {messageText}
                </Typography>
              </CardContent>
            </Card>
          );
        }
      });
  }
  return nodes;
};

const Blog = () => {

  const navigator = useNavigate();
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Запрос на сервер для получения данных
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12 }} pt={3} pb={1}>
          <Button variant="text" startIcon={<ArrowBackIosIcon />} onClick={() => navigator('/')}>
            {t('mainPage')}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} p={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ position: 'sticky', top: '16px' }}>
            <CardContent>
              <Typography variant='h6' component='p'>{t('telegramChat')}</Typography>
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
                      href={'https://t.me/' + posts[0].chat_username}
                      target='_blank'
                    >
                      <TelegramIcon fontSize='large' />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography variant='h6' component='p' fontWeight={600}>
                      {posts[0].chat_title}
                      <IconButton
                        size='small'
                        href={'https://t.me/' + posts[0].chat_username}
                        target='_blank'
                      >
                        <OpenInNewIcon fontSize='small' />
                      </IconButton>
                    </Typography>
                    <Typography variant='caption' component='p' gutterBottom sx={{ color: theme.palette.text.secondary }}>20+ {t('followers')}</Typography>
                    <Typography variant='body1' component='p' whiteSpace='pre-line'>{t('telegramDescr')}</Typography>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {posts.map((post, i) => (
            <Card key={post.message_id} sx={{ width: '100%', mx: 'auto', mt: i !== 0 ? 2 : 0 }} variant='outlined'>
              {post.photo && (
                <CardMedia
                  component="img"
                  image={post.photo}
                  alt={post.text || 'Telegram Post'}
                  sx={{ objectFit: 'contain', maxHeight: 500, background: 'linear-gradient(0deg, rgba(18,18,18,1) 0%, rgba(39,39,39,1) 100%)' }}
                />
              )}
              <CardContent>
                <Typography variant="body1" component="div" whiteSpace="pre-line" gutterBottom>
                  {renderTextWithLinks(post.text)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  <Link href={'https://t.me/' + post.chat_username} target="_blank" color="inherit" underline="always">
                    {post.chat_title}
                  </Link>
                  ,&nbsp;{new Date(post.date + ' UTC').toLocaleString()}
                  <IconButton
                    sx={{ float: 'right' }}
                    href={'https://t.me/' + post.chat_username + '/' + post.message_id}
                    target='_blank'
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </Typography>
              </CardContent>
            </Card>
          ))}
          <Box width='100%' textAlign='center'>
            <Link variant='caption' href={'https://t.me/' + posts[0].chat_username} target="_blank" color="textSecondary" underline="always">
              {t('readMore')}
            </Link>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Blog
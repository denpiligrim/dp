import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid2 as Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Blog = () => {

  const navigator = useNavigate();
  const { t, i18n } = useTranslation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Запрос на сервер для получения данных
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data.reverse());
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
        {posts.map((post) => (
          <Grid size={{ xs: 12 }} key={post.message_id}>
            <Card sx={{ width: '100%', maxWidth: '500px', mx: 'auto' }}>
              {post.photo && (
                <CardMedia
                  component="img"
                  image={post.photo}
                  alt={post.caption || 'Telegram Post'}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {post.caption || 'Без подписи'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(post.date + ' UTC').toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default Blog
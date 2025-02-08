import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box, Grid2 as Grid } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface FormData {
  text: string;
  images: File[];
  socialNetworks: {
    vk: boolean;
    telegram: boolean;
    x: boolean;
  };
}

const Post: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [images, setImages] = useState<File[]>([]);
  const navigator = useNavigate();
  const { t, i18n } = useTranslation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages([...images, ...Array.from(event.target.files)]);
    }
  };

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('text', data.text);
    images.forEach((image, index) => formData.append(`images[${index}]`, image));
    formData.append('socialNetworks', JSON.stringify(data.socialNetworks));

    const response = await fetch('/api/createPost', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Пост успешно создан!');
      reset();
      setImages([]);
    } else {
      alert('Ошибка при создании поста.');
    }
  };

  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12 }} pt={3} pb={1}>
          <Button variant="text" startIcon={<ArrowBackIosIcon />} onClick={() => navigator('/')}>
            {t("mainPage")}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} p={2}>
        <Box p={2}>
          <Typography variant="h4" gutterBottom>
            Создать пост
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Текст поста"
                  {...register('text', { required: true })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button variant="contained" component="label">
                  Загрузить изображения
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                <Box mt={1}>
                  {images.map((image, index) => (
                    <Typography key={index} variant="body2">
                      {image.name}
                    </Typography>
                  ))}
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={<Checkbox {...register('socialNetworks.vk')} />}
                  label="ВКонтакте"
                />
                <FormControlLabel
                  control={<Checkbox {...register('socialNetworks.telegram')} />}
                  label="Телеграм"
                />
                <FormControlLabel
                  control={<Checkbox {...register('socialNetworks.x')} />}
                  label="X"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button type="submit" variant="contained" color="primary">
                  Отправить
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </>
  );
};

export default Post;
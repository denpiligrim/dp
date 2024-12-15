import { Box, Typography, Dialog, useTheme, useMediaQuery, DialogTitle, DialogContent, IconButton, Link } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/scss/image-gallery.scss";
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const PortfolioModal = ({ project, open, onClose }: any) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, i18n } = useTranslation();
  const [slider, setSlider] = useState<string[]>([project.img_1, project.img_2, project.img_3]);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const galleryRef = useRef(null);
  const slickRef = useRef(null);

  const handleSlideChange = (index: number, initiator: string) => {
    if (initiator === 'gallery') {
      slickRef.current.slickGoTo(index);
    }
    setCurrentIndex(index);
  };

  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    infinite: true,
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    variableWidth: false,
    variableHeight: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true,
    className: "sticky",
    beforeChange: (current: number, next: number) => handleSlideChange(next, 'slider')
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  useEffect(() => {
    if (galleryRef.current && fullscreen) {
      galleryRef.current.toggleFullScreen();
      galleryRef.current.slideToIndex(currentIndex);
    }
  }, [fullscreen])

  return (
    <>    
      <Dialog
        fullScreen={fullScreen}
        maxWidth="md"
        open={open}
        onClose={onClose}
      >
        <DialogTitle variant="h5">
          <span>{i18n.language === 'en' ? project.title_en : project.title}</span><CloseIcon sx={{ float: 'right', cursor: 'pointer', "&:hover": { opacity: '.7' } }} onClick={onClose} />
        </DialogTitle>
        <DialogContent>
        <Box sx={{ width: '100%', maxHeight: '500px' }}>
          <Slider ref={slickRef} {...settings}>
            {slider.map((img, index) => (
              <Box key={'slider-item' + index} sx={{ position: 'relative', width: '100%', maxHeight: '500px' }}>
                <img
                  src={img}
                  alt={'slider-item' + index}
                  style={{ width: '100%', maxHeight: '500px', marginLeft: 'auto', marginRight: 'auto', objectFit: 'contain' }}
                  loading='lazy'
                />
                <IconButton aria-label="fullscreen" onClick={toggleFullscreen} sx={{
                  backgroundColor: '#121212',
                  "&:hover": {
                    backgroundColor: '#121212',
                    opacity: '.9'
                  },
                  position: 'absolute',
                  top: 5,
                  right: 5
                }}>
                  <FullscreenIcon sx={{ color: 'white' }} />
                </IconButton>
              </Box>
            ))}
          </Slider>
          </Box>          
          <Typography mt={4} variant="body1" component="div" dangerouslySetInnerHTML={{ __html: i18n.language === 'en' ? project.description_en : project.description }} />
          { project.url && <Typography variant="body1"><strong>{t('site')}:</strong> <Link href={project.url} target="_blank">{project.url}</Link></Typography> }
          { project.githubUrl && <Typography variant="body1"><strong>GitHub:</strong> <Link href={project.githubUrl} target="_blank">{project.githubUrl}</Link></Typography> }
        </DialogContent>
      </Dialog>
      {fullscreen && (
        <ImageGallery
          ref={galleryRef}
          items={slider.map((el, index) => {
            return {
              original: el,
              originalAlt: 'gallery-item' + index,
              thumbnail: el,
              thumbnailAlt: 'gallery-item' + index
            }
          })}
          showPlayButton={false}
          showIndex
          onSlide={(i) => handleSlideChange(i, 'gallery')}
          autoPlay={false}
          onScreenChange={(f) => !f && toggleFullscreen()}
        />
      )}
    </>
  )
};

export default PortfolioModal;
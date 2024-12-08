import { Box, Typography, Dialog } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/scss/image-gallery.scss";

const PortfolioModal = ({ project, open, onClose }: any) => (
  <Dialog open={open} onClose={onClose}>
    <Box sx={{ p: 4, bgcolor: "background.paper", maxWidth: 800, mx: "auto", mt: 5 }}>
      <Typography variant="h4">{project.title}</Typography>
      <Typography variant="body1" dangerouslySetInnerHTML={{ __html: project.description }} />
      <Slider>
        {[project.img_1, project.img_2, project.img_3].map((img, index) => (
          <img key={index} src={img} alt={`Slide ${index + 1}`} />
        ))}
      </Slider>
    </Box>
  </Dialog>
);

export default PortfolioModal;
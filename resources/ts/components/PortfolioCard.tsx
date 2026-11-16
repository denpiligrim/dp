import { Card, CardMedia, CardContent, Typography, IconButton, Box } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useTranslation } from "react-i18next";
import { safeExternalUrl } from '../security/inputs';

const PortfolioCard = ({ project, onClick }: any) => {
  const { t, i18n } = useTranslation();

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardMedia component="img" height="140" image={project.img_preview} alt={i18n.language === 'en' ? project.title_en : project.title} sx={{ cursor: "pointer" }} onClick={onClick} />
      <CardContent>
        <Typography variant="h6" component="h3" onClick={onClick} sx={{ cursor: "pointer", minHeight: '64px' }}>{i18n.language === 'en' ? project.title_en : project.title}</Typography>
        <Typography variant="caption" component="p" color="textSecondary"><span>{new Date(project.date).toLocaleDateString()}</span><span style={{ float: 'right' }}>{t(project.type)}</span></Typography>
        <Box sx={{ display: "flex", mt: 2 }}>
          {project.url && (
            <IconButton href={safeExternalUrl(project.url)} target="_blank" rel="noopener noreferrer">
              <OpenInNewIcon />
            </IconButton>
          )}
          {project.githubUrl && (
            <IconButton href={safeExternalUrl(project.githubUrl)} target="_blank" rel="noopener noreferrer">
              <GitHubIcon />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  )
};

export default PortfolioCard;

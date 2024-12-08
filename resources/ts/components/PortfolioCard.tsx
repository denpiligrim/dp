import { Card, CardMedia, CardContent, Typography, IconButton, Box } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GitHubIcon from "@mui/icons-material/GitHub";

const PortfolioCard = ({ project, onClick }: any) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardMedia component="img" height="140" image={project.img_preview} alt={project.title} sx={{ cursor: "pointer" }} onClick={onClick} />
    <CardContent>
      <Typography variant="h6" onClick={onClick} sx={{ cursor: "pointer" }}>{project.title}</Typography>
      <Typography variant="caption" color="textSecondary">{new Date(project.date).toLocaleDateString()}</Typography>
      <Box sx={{ display: "flex", mt: 2 }}>
        <IconButton href={project.url} target="_blank">
          <OpenInNewIcon />
        </IconButton>
        {project.githubUrl && (
          <IconButton href={project.githubUrl} target="_blank">
            <GitHubIcon />
          </IconButton>
        )}
      </Box>
    </CardContent>
  </Card>
);

export default PortfolioCard;
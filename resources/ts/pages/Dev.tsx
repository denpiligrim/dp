import { useEffect, useState } from "react";
import { Button, CircularProgress, Grid2 as Grid, Typography } from "@mui/material";
import axios from "axios";
import FiltersPanel from "../components/FiltersPanel";
import PortfolioCard from "../components/PortfolioCard";
import PortfolioModal from "../components/PortfolioModal";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Dev = () => {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const navigator = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const { data } = await axios.get("/api/portfolio", { params: filters });
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [filters]);

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
            {t("mainPage")}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} p={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <FiltersPanel onFilterChange={setFilters} />
          <Typography variant="body1" component="div" color="warning" my={3} textAlign="center">Раздел находится в разработке!</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={2} p={0}>
            {projects.map((project) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4, xxl: 3 }} key={project.id}>
                <PortfolioCard
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        {selectedProject && (
          <PortfolioModal
            project={selectedProject}
            open={!!selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </Grid>
    </>
  );
};

export default Dev;
import { useEffect, useState } from "react";
import { Button, CircularProgress, Grid2 as Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import axios from "axios";
import FiltersPanel from "../components/FiltersPanel";
import PortfolioCard from "../components/PortfolioCard";
import PortfolioModal from "../components/PortfolioModal";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

const Dev = () => {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTechnologies, setSelectedTechnologies] = useState<any[]>([]);
  const [filtersOpen, setOpenFilters] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const navigator = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const open = Boolean(anchorEl);

  const fetchProjects = async () => {
    const { data } = await axios.get("/api/portfolio", { params: { ...filters, sort: sortOption } });
    const firstTechs = [
      "JavaScript",
      "TypeScript",
      "React",
      "Material UI",
      "PHP",
      "Laravel",
      "MySQL",
      "HTML",
      "CSS",
      "SASS"
    ];
    const uniqueTechnologies = Array.from(
      new Set(
        data
          .flatMap((project) =>
            project.technologies
              .split(",")
              .map((tech: string) => tech.trim())
              .filter((tech: string) => tech !== "")
          )
      )
    );
    uniqueTechnologies.sort((a: any, b: any) => {
      const indexA = firstTechs.indexOf(a);
      const indexB = firstTechs.indexOf(b);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return a.localeCompare(b);
    });

    if (uniqueTechnologies.length > 0) setSelectedTechnologies(uniqueTechnologies);
    setProjects(data);
    setLoading(false);
  };

  const sortProjects = (by: string) => {
    setAnchorEl(null);
    setSortOption(by);
    if (sortOption !== by) {
      const sortedProjects = [...projects];

      switch (by) {
        case "newest":
          sortedProjects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          break;

        case "oldest":
          sortedProjects.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          break;

        case "az":
          sortedProjects.sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));
          break;

        case "za":
          sortedProjects.sort((a, b) => b.title.localeCompare(a.title, "en", { sensitivity: "base" }));
          break;

        default:
          console.warn(`Unknown sort type: ${by}`);
          break;
      }

      setProjects(sortedProjects);
    }
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
      <Helmet defer={false}>
        <meta name="description" content="Portfolio of private developer with experience of more than 15 years DenPiligrim. Websites, web services, scripts, API integrations." />
        <meta name="keywords" content="site, development, service, programmer, frontend, backend, react, cryptocurrencies, charts, metrics" />
        <meta property="og:title" content={t('titleDev')} />
        <meta property="og:description" content="Portfolio of private developer with experience of more than 15 years DenPiligrim. Websites, web services, scripts, API integrations." />
        <title>{t('titleDev')}</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/dev'} />
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
                  "item": "https://paycot.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Dev",
                  "item": import.meta.env.VITE_APP_URL + '/dev'
                }
              ]
            }
          )}
        </script>
      </Helmet>
      <Grid container>
        <Grid size={{ xs: 12 }} pt={3} pb={1}>
          <Button variant="text" startIcon={<ArrowBackIosIcon />} onClick={() => navigator('/')}>
            {t("mainPage")}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} p={2}>
        <Grid size={{ xs: 12, md: 3 }} position="relative">
          <Typography
            variant="h1"
            sx={{
              position: 'absolute',
              left: '-9999px',
              top: 'auto',
              width: '1px',
              height: '1px',
              color: '#121212',
              overflow: 'hidden'
            }}
          >
            {t('h1Dev')}
          </Typography>
          <FiltersPanel onFilterChange={setFilters} technologies={selectedTechnologies} openFiltersModal={filtersOpen} onCloseFiltersModal={setOpenFilters} />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={2} p={0} height="100%">
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #272727' }}>
              <Typography variant="body1" component="h2">{t('totalProjects') + ': ' + projects.length}</Typography>
              <IconButton
                sx={{ ml: 'auto' }}
                onClick={(e) => setAnchorEl(e.target as HTMLButtonElement)}
              >
                <SortIcon />
              </IconButton>
              <IconButton
                sx={{
                  display: {
                    xs: 'inline-flex',
                    md: 'none'
                  }
                }}
                onClick={() => setOpenFilters(prev => !prev)}
              >
                <FilterAltIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={(e) => setAnchorEl(null)}
              >
                <MenuItem selected={sortOption === 'newest'} onClick={() => sortProjects('newest')}>
                  {t('newest')}
                </MenuItem>
                <MenuItem selected={sortOption === 'oldest'} onClick={() => sortProjects('oldest')}>
                  {t('oldest')}
                </MenuItem>
                <MenuItem selected={sortOption === 'az'} onClick={() => sortProjects('az')}>
                  {t('az')}
                </MenuItem>
                <MenuItem selected={sortOption === 'za'} onClick={() => sortProjects('za')}>
                  {t('za')}
                </MenuItem>
              </Menu>
            </Grid>
            {projects.length > 0 ? projects.map((project) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4, xxl: 3 }} key={project.id}>
                <PortfolioCard
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              </Grid>
            )) : (
              <Grid size={{ xs: 12 }} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}>
                <Typography variant="h6" component="p" color="textDisabled">{t('isEmpty')}</Typography>
              </Grid>
            )}
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
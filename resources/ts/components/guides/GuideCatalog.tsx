import '../../../sass/guide-catalog.scss';
import { useMemo, useState } from 'react';
import { Box, Button, Chip, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export interface GuideSummary {
  title: string;
  description: string;
  to: string;
  category: string;
}

export function GuideCard({ guide, number }: { guide: GuideSummary; number: number; }) {
  return (
    <Box component="article" className="guide-catalog-card">
      <Link component={RouterLink} to={guide.to} underline="none" className="guide-catalog-card-link">
        <Box className="guide-catalog-card-meta"><span>{guide.category}</span><span>{String(number).padStart(2, '0')}</span></Box>
        <Typography component="h2">{guide.title}</Typography>
        <Typography component="p">{guide.description}</Typography>
        <span className="guide-catalog-card-action">Читать гайд<ArrowForwardIcon fontSize="small" /></span>
      </Link>
    </Box>
  );
}

export function GuideCatalog({ items }: { items: GuideSummary[]; }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Все');
  const categories = useMemo(() => ['Все', ...new Set(items.map(item => item.category))], [items]);
  const filtered = useMemo(() => {
    const words = query.trim().toLocaleLowerCase('ru').split(/\s+/).filter(Boolean);
    return items.filter(item => {
      const text = `${item.title} ${item.description} ${item.category}`.toLocaleLowerCase('ru');
      return (category === 'Все' || item.category === category) && words.every(word => text.includes(word));
    });
  }, [items, query, category]);

  return (
    <Box component="main" id="guides-list" className="guide-catalog">
      <Box className="guide-catalog-toolbar">
        <TextField fullWidth label="Найти гайд" placeholder="3x-ui, CDN, SSH…" value={query} onChange={event => setQuery(event.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }} />
        <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} className="guide-catalog-filters" aria-label="Темы гайдов">
          {categories.map(value => <Chip key={value} label={value} clickable onClick={() => setCategory(value)}
            aria-pressed={category === value} variant="outlined" className={category === value ? 'is-active' : ''} />)}
        </Stack>
      </Box>
      <Box className="guide-catalog-count" role="status" aria-live="polite">Найдено: {filtered.length} из {items.length}</Box>
      <Box className="guide-catalog-grid">
        {filtered.map(guide => <GuideCard key={guide.to} guide={guide} number={items.indexOf(guide) + 1} />)}
      </Box>
      {filtered.length === 0 && <Box className="guide-catalog-empty"><SearchIcon /><Typography component="h2">Ничего не нашлось</Typography><Typography>Попробуйте другое название или выберите все темы.</Typography><Button variant="outlined" onClick={() => { setQuery(''); setCategory('Все'); }}>Сбросить поиск</Button></Box>}
    </Box>
  );
}

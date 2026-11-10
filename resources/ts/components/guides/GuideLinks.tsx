import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Link, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { guideLinkRel } from './types';
import { GuideLink, GuidePartner } from './types';

export function GuidePartnerLinks({ items }: { items: GuidePartner[]; }) {
  return (
    <Box component="nav" aria-label="Партнёрские сервисы" className="guide-partners">
      {items.map(item => (
        <Link key={item.href} href={item.href} target="_blank" rel={guideLinkRel(item.sponsored)} underline="none" className="guide-partner">
          <span className="guide-partner-icon">{item.icon}</span>
          <Box><strong>{item.label}</strong>{item.detail && <small>{item.detail}</small>}</Box>
          <ArrowForwardIcon className="guide-partner-arrow" />
        </Link>
      ))}
    </Box>
  );
}

export function GuideResources({ links, moreLinks = [], title = 'Полезные ссылки', description = 'Сервисы из инструкции и дополнительные материалы.' }: {
  links: GuideLink[];
  moreLinks?: GuideLink[];
  title?: string;
  description?: string;
}) {
  return (
    <Box component="section" className="guide-resources">
      <Typography component="h2" variant="h6">{title}</Typography>
      <Typography component="p">{description}</Typography>
      <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
        {links.map(link => <Button key={link.href} component="a" href={link.href} target="_blank" rel={guideLinkRel(link.sponsored)} variant="outlined">{link.label} ↗</Button>)}
      </Stack>
      {moreLinks.length > 0 && (
        <Accordion disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Ещё сервисы</Typography></AccordionSummary>
          <AccordionDetails><Stack spacing={1.5}>
            {moreLinks.map(link => <Link key={link.href} href={link.href} target="_blank" rel={guideLinkRel(link.sponsored)} color="text.secondary">{link.label} ↗</Link>)}
          </Stack></AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}

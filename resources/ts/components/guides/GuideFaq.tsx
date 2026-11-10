import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GuideFaqItem } from './types';

export function GuideFaq({ items, id = 'faq', title = 'Частые вопросы', eyebrow = 'ЕСЛИ ОСТАЛИСЬ ВОПРОСЫ' }: {
  items: GuideFaqItem[];
  id?: string;
  title?: string;
  eyebrow?: string;
}) {
  return (
    <Box component="section" className="guide-faq" id={id}>
      <span className="guide-small-label">{eyebrow}</span>
      <Typography component="h2" variant="h5">{title}</Typography>
      {items.map(({ question, answer }) => (
        <Accordion key={question} disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography component="h3">{question}</Typography></AccordionSummary>
          <AccordionDetails><Typography>{answer}</Typography></AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

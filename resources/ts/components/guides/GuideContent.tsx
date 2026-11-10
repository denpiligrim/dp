import { ReactNode } from 'react';
import { Alert, AlertTitle, Box, Paper, Typography } from '@mui/material';
import { AlertProps, PaperProps } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TuneIcon from '@mui/icons-material/Tune';
import { GuideStep } from './types';

export function GuideArticle({ children }: { children: ReactNode; }) {
  return <Box component="article" className="guide-article">{children}</Box>;
}

type GuideSectionProps = { children: ReactNode; } & (
  { step: GuideStep; number: number; steps?: never; id?: never; } |
  { steps: GuideStep[]; id: string; step?: never; number?: never; }
);

export function GuideSection(props: GuideSectionProps) {
  const { children } = props;
  const index = props.steps?.findIndex(step => step.id === props.id) ?? -1;
  const step = props.step ?? props.steps?.[index];
  const number = props.number ?? index + 1;
  if (!step) throw new Error(`Unknown guide section: ${props.id}`);
  return (
    <Box component="section" id={step.id} className="guide-step">
      <Box className="guide-step-heading">
        <span className="guide-step-number">{String(number).padStart(2, '0')}</span>
        <Box>
          <Typography component="h2" variant="h5">{step.heading ?? step.title}</Typography>
          {step.description && <Typography component="p" className="guide-step-description">{step.description}</Typography>}
        </Box>
      </Box>
      {children}
    </Box>
  );
}

export function GuidePanel({ children, className = '', ...props }: PaperProps) {
  return <Paper elevation={0} {...props} className={`guide-panel ${className}`}>{children}</Paper>;
}

export function GuidePrerequisites({ items, children, title = 'Перед началом' }: { items: string[]; children?: ReactNode; title?: string; }) {
  return (
    <Box className="guide-before">
      <Typography component="h2">{title}</Typography>
      <Box className="guide-requirements">{items.map(item => <span key={item}><CheckCircleOutlineIcon />{item}</span>)}</Box>
      {children && <Typography component="p">{children}</Typography>}
    </Box>
  );
}

export function GuideAlert({ title, children, severity = 'info', icon = <InfoOutlinedIcon />, ...props }: Omit<AlertProps, 'title'> & { title?: ReactNode; }) {
  return <Alert severity={severity} icon={icon} {...props}>{title && <AlertTitle>{title}</AlertTitle>}{children}</Alert>;
}

export function GuideValues({ title, rows, icon = <TuneIcon fontSize="small" /> }: { title?: string; rows: ([string, ReactNode] | string[])[]; icon?: ReactNode; }) {
  return (
    <Paper elevation={0} className="guide-preview">
      {title && <Typography component="h3" className="guide-preview-title">{icon}{title}</Typography>}
      <Box component="dl" className="guide-values">
        {rows.map(([label, value]) => <Box key={label} className="guide-value"><Typography component="dt">{label}</Typography><Typography component="dd">{value}</Typography></Box>)}
      </Box>
    </Paper>
  );
}

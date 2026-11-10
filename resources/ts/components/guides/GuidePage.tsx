import { createContext, useContext, useState } from 'react';
import { ReactNode } from 'react';
import { Box, Button, Link, Typography } from '@mui/material';
import { ButtonProps, LinkProps } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import SupportModal from '../SupportModal';
import '../../../sass/guide.scss';

const SupportContext = createContext<(() => void) | null>(null);

/** Scopes guide styles and owns the support dialog shared by header and footer. */
export function GuidePage({ children }: { children: ReactNode; }) {
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <SupportContext.Provider value={() => setSupportOpen(true)}>
      <Box className="guide">
        <Box className="guide-page">{children}</Box>
        <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      </Box>
    </SupportContext.Provider>
  );
}

export function GuideBackLink({ to = '/guides', label = 'Все гайды' }: { to?: string; label?: string; }) {
  return (
    <Box className="guide-breadcrumbs">
      <Link component={RouterLink} to={to} color="text.secondary" underline="hover">
        <ArrowBackIcon fontSize="small" />{label}
      </Link>
    </Box>
  );
}

export function GuideSupportButton({ children = 'Поддержать автора', ...props }: Omit<ButtonProps, 'onClick'>) {
  const openSupport = useContext(SupportContext);
  if (!openSupport) throw new Error('GuideSupportButton must be inside GuidePage');

  return <Button variant="outlined" {...props} onClick={openSupport}>{children}</Button>;
}

export function GuideSupportLink({ children, ...props }: Omit<LinkProps, 'onClick'>) {
  const openSupport = useContext(SupportContext);
  if (!openSupport) throw new Error('GuideSupportLink must be inside GuidePage');
  return <Link component="button" {...props} onClick={openSupport}>{children}</Link>;
}

export function GuideSupportFooter({ title = 'Гайд пригодился?', description = 'Можно поддержать новые инструкции.' }: {
  title?: string;
  description?: string;
}) {
  return (
    <Box className="guide-support">
      <Box><Typography component="h2" variant="h6">{title}</Typography><Typography>{description}</Typography></Box>
      <GuideSupportButton />
    </Box>
  );
}

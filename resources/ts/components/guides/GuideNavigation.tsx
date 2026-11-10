import { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import { Box, Link, Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { GuideStep } from './types';

export function useActiveGuideStep(steps: GuideStep[]) {
  const [activeStep, setActiveStep] = useState(steps[0]?.id ?? '');

  useEffect(() => {
    const updateActiveStep = () => {
      let current = steps[0]?.id ?? '';
      for (const step of steps) {
        const section = document.getElementById(step.id);
        if (section && section.getBoundingClientRect().top <= 180) current = step.id;
      }
      setActiveStep(current);
    };
    updateActiveStep();
    window.addEventListener('scroll', updateActiveStep, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveStep);
  }, [steps]);

  return [activeStep, setActiveStep] as const;
}

interface GuideNavigationProps {
  steps: GuideStep[];
  faqHref?: string;
  settingsHref?: string;
}

export function GuideTableOfContents({ steps, faqHref, settingsHref }: GuideNavigationProps) {
  const [activeStep, setActiveStep] = useActiveGuideStep(steps);

  return (
    <Box component="nav" aria-label="Содержание гайда" className="guide-toc">
      <Typography component="p" className="guide-small-label">В ЭТОМ ГАЙДЕ</Typography>
      {steps.map((step, index) => (
        <Link key={step.id} href={`#${step.id}`} aria-current={activeStep === step.id ? 'step' : undefined}
          className={`guide-toc-link ${activeStep === step.id ? 'is-active' : ''}`} underline="none" onClick={() => setActiveStep(step.id)}>
          <span className="guide-toc-number">{String(index + 1).padStart(2, '0')}</span>
          <Box><strong>{step.title}</strong>{step.detail && <small>{step.detail}</small>}</Box>
        </Link>
      ))}
      {faqHref && <Link href={faqHref} className="guide-toc-extra" underline="hover">Частые вопросы ↗</Link>}
      {settingsHref && <Link href={settingsHref} className="guide-toc-extra" underline="hover"><TuneIcon fontSize="small" /> Параметры гайда</Link>}
    </Box>
  );
}

export function GuideLayout({ children, ...navigation }: GuideNavigationProps & { children: ReactNode; }) {
  return (
    <Box className="guide-layout">
      <Box component="aside" className="guide-sidebar"><GuideTableOfContents {...navigation} /></Box>
      <Box component="main" className="guide-main">{children}</Box>
    </Box>
  );
}

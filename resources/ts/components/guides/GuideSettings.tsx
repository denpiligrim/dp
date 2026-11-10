import { ReactNode } from 'react';
import { Box, FormControlLabel, Grid2 as Grid, Paper, Switch, TextField, Typography } from '@mui/material';
import { TextFieldProps } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

export function GuideSettings({ children, footer, layout = 'grid', id = 'guide-settings', title = 'Сначала — ваши параметры',
  description = 'Заполните один раз. Команды и примеры ниже обновятся автоматически.' }: {
    children: ReactNode;
    footer?: ReactNode;
    layout?: 'grid' | 'custom';
    id?: string;
    title?: string;
    description?: string;
  }) {
  return (
    <Paper elevation={0} id={id} className="guide-settings">
      <Box className="guide-settings-heading">
        <span className="guide-icon-tile"><TuneIcon /></span>
        <Box><Typography component="h2" variant="h5">{title}</Typography><Typography component="p">{description}</Typography></Box>
      </Box>
      {layout === 'grid' ? <Grid container spacing={2.5}>{children}</Grid> : children}
      {footer}
    </Paper>
  );
}

/** A normal MUI TextField in the responsive guide settings grid. */
export function GuideField({ columns = 6, ...props }: TextFieldProps & { columns?: 6 | 12; }) {
  return <Grid size={{ xs: 12, sm: columns }}><TextField fullWidth {...props} /></Grid>;
}

export function GuideSudoToggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void; }) {
  return (
    <Box className="guide-settings-footer">
      <FormControlLabel control={<Switch checked={checked} onChange={event => onChange(event.target.checked)} size="small" />} label="Добавлять sudo в команды" />
      <Typography variant="caption">Включите, если работаете не от root</Typography>
    </Box>
  );
}

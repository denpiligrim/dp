import { useEffect, useState } from "react";
import { Box, Button, Select, MenuItem, Typography, FormGroup, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, useTheme, useMediaQuery } from "@mui/material";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/ru';
import { DateRange } from "@mui/x-date-pickers-pro/models";
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close';
import { PickersShortcutsItem } from "@mui/x-date-pickers";
import BannerHosting from "./BannerHosting";

const FiltersPanel = ({ onFilterChange, technologies, openFiltersModal, onCloseFiltersModal }: any) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const minDate = '2021-12-30';
  const [date, setDate] = useState<DateRange<Dayjs>>([
    dayjs(minDate),
    dayjs()
  ]);
  const [type, setType] = useState("all");
  const [applyBtnDisabled, setApplyBtnDisabled] = useState<boolean>(false);
  const [shortcutsItems, setShortcutsItems] = useState<PickersShortcutsItem<DateRange<Dayjs>>[] | null>(null);

  const handleApplyFilters = () => {
    setApplyBtnDisabled(true);
    onFilterChange({ date_from: date[0].format('YYYY-MM-DD'), date_to: date[1].format('YYYY-MM-DD'), type, technologies: null, sort: null });
    setTimeout(() => {
      if (openFiltersModal) onCloseFiltersModal(prev => !prev);
      setApplyBtnDisabled(false);
    }, 1000);
  };

  useEffect(() => {
    const onLanguageChange = () => {
      const shortcuts: PickersShortcutsItem<DateRange<Dayjs>>[] = [
        {
          label: t('lastWeek'),
          getValue: () => {
            const today = dayjs();
            return [today.subtract(7, 'day'), today];
          },
        },
        {
          label: t('lastMonth'),
          getValue: () => {
            const today = dayjs();
            return [today.subtract(30, 'day'), today];
          },
        },
        {
          label: t('lastYear'),
          getValue: () => {
            const today = dayjs();
            return [today.subtract(1, 'year'), today];
          },
        },
        { label: t('reset'), getValue: () => [dayjs(minDate), dayjs()] },
      ];
      setShortcutsItems(shortcuts);
    };

    i18n.on('languageChanged', onLanguageChange);
    onLanguageChange();
  }, []);

  return (
    <>
      {isMobile ? (
        <Dialog
          fullScreen
          open={openFiltersModal}
          onClose={() => onCloseFiltersModal(prev => !prev)}
        >
          <DialogTitle variant="h5">
            <span>{t('filtersTitle')}</span><CloseIcon sx={{ float: 'right', cursor: 'pointer', "&:hover": { opacity: '.7' } }} onClick={() => onCloseFiltersModal(prev => !prev)} />
          </DialogTitle>
          <DialogContent>
            <Box>
              <Typography variant="body2" component="h3" mb={1.5}>{t('date')}</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language === 'ru' ? 'ru' : 'en'}>
                <DemoContainer components={['DateRangePicker', 'DateRangePicker']} sx={{ pt: 0 }}>
                  <DemoItem component="DateRangePicker">
                    <DateRangePicker
                      slotProps={{
                        shortcuts: {
                          items: shortcutsItems,
                        },
                        actionBar: { actions: [] },
                      }}
                      minDate={dayjs(minDate)}
                      maxDate={dayjs()}
                      localeText={{
                        start: '',
                        end: '',
                        toolbarTitle: t('dateRange')
                      }}
                      value={date}
                      onChange={(newValue) => setDate(newValue)}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
              <Typography variant="body2" component="h3" mt={1.5}>{t('type')}</Typography>
              <Select
                label=""
                value={type}
                onChange={(e) => setType(e.target.value)}
                fullWidth
                sx={{ mt: 1.5 }}
              >
                <MenuItem value="all">{t('all')}</MenuItem>
                <MenuItem value="service">{t('service')}</MenuItem>
                <MenuItem value="site">{t('site')}</MenuItem>
                <MenuItem value="script">{t('script')}</MenuItem>
                <MenuItem value="api">{t('api')}</MenuItem>
              </Select>
              <Typography variant="body2" component="h3" mt={1.5}>{t('technologies')}</Typography>
              <FormGroup sx={{
                flexWrap: 'nowrap',
                overflow: 'auto',
                maxHeight: '420px'
              }}>
                {technologies.length > 0 && technologies.map((technology: string) => (
                  <FormControlLabel
                    key={technology}
                    control={
                      <Checkbox
                        checked
                        disabled
                      />
                    }
                    label={technology}
                  />
                ))}
              </FormGroup>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button disabled={applyBtnDisabled} variant="contained" fullWidth sx={{ mx: 'auto', maxWidth: '300px' }} onClick={handleApplyFilters}>
              {t('apply')}
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Box sx={{
          display: 'flex',
          flex: '1',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          <Typography variant="body2" component="h3" mb={1.5}>{t('date')}</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language === 'ru' ? 'ru' : 'en'}>
            <DemoContainer components={['DateRangePicker', 'DateRangePicker']} sx={{ pt: 0 }}>
              <DemoItem component="DateRangePicker">
                <DateRangePicker
                  slotProps={{
                    shortcuts: {
                      items: shortcutsItems,
                    },
                    actionBar: { actions: [] },
                  }}
                  minDate={dayjs(minDate)}
                  maxDate={dayjs()}
                  localeText={{
                    start: '',
                    end: '',
                    toolbarTitle: t('dateRange')
                  }}
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
          <Typography variant="body2" component="h3" mt={1.5}>{t('type')}</Typography>
          <Select
            label=""
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
            sx={{ mt: 1.5 }}
          >
            <MenuItem value="all">{t('all')}</MenuItem>
            <MenuItem value="service">{t('service')}</MenuItem>
            <MenuItem value="site">{t('site')}</MenuItem>
            <MenuItem value="script">{t('script')}</MenuItem>
            <MenuItem value="api">{t('api')}</MenuItem>
          </Select>
          <Typography variant="body2" component="h3" mt={1.5}>{t('technologies')}</Typography>
          <FormGroup sx={{
            flexWrap: 'nowrap',
            overflow: 'auto',
            flex: '1'
          }}>
            {technologies.length > 0 && technologies.map((technology: string) => (
              <FormControlLabel
                key={technology}
                control={
                  <Checkbox
                    checked
                    disabled
                  />
                }
                label={technology}
              />
            ))}
          </FormGroup>
          <Button disabled={applyBtnDisabled} variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleApplyFilters}>
            {t('apply')}
          </Button>
        </Box>
      )}
    </>
  );
};

export default FiltersPanel;
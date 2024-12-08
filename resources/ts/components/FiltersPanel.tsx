import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  useMediaQuery,
} from "@mui/material";

const FiltersPanel = ({ onFilterChange }: any) => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [type, setType] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [sort, setSort] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleApplyFilters = () => {
    onFilterChange({ dateRange, type, technologies, sort });
  };

  return (
    <Box>
      <TextField
        label="Дата с"
        type="date"
        value={dateRange.from}
        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
        fullWidth
      />
      <TextField
        label="Дата до"
        type="date"
        value={dateRange.to}
        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Select
        label="Тип"
        value={type}
        onChange={(e) => setType(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      >
        <MenuItem value="">Все</MenuItem>
        <MenuItem value="service">Веб-сервис</MenuItem>
        <MenuItem value="site">Сайт</MenuItem>
        <MenuItem value="script">Скрипт</MenuItem>
        <MenuItem value="api">API</MenuItem>
      </Select>
      <TextField
        label="Технологии (через запятую)"
        value={technologies}
        onChange={(e) => setTechnologies(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Select
        label="Сортировка"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      >
        <MenuItem value="newest">Сначала новые</MenuItem>
        <MenuItem value="oldest">Сначала старые</MenuItem>
        <MenuItem value="a-z">А-Я</MenuItem>
        <MenuItem value="z-a">Я-А</MenuItem>
      </Select>
      <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleApplyFilters}>
        Применить
      </Button>
    </Box>
  );
};

export default FiltersPanel;
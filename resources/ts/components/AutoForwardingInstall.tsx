import { useState } from 'react';
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Paper, Stack } from '@mui/material';
import axios from 'axios';

interface AutoForwardingInstallProps {
  originIp: string;
  intermediateIp: string;
  setOriginIp: (ip: string) => void;
  setIntermediateIp: (ip: string) => void;
}

const AutoForwardingInstall = ({ originIp, intermediateIp, setOriginIp, setIntermediateIp }: AutoForwardingInstallProps) => {
  const [formData, setFormData] = useState({
    port: 22,
    username: 'root',
    auth_type: 'password',
    auth_value: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [output, setOutput] = useState('');

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setOutput('');
    try {
      const response = await axios.post('/api/install-forwarding', {
        origin_ip: originIp,
        intermediate_ip: intermediateIp,
        ...formData
      });
      setError(false);
      setOutput(response.data.output);
      setInstalled(true);
    } catch (err: any) {
      setError(true);
      setOutput(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Автоматическая установка перенаправления
      </Typography>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <TextField
          required
          name="origin_ip"
          label="IP основного сервера"
          value={originIp}
          onChange={(e) => setOriginIp(e.target.value)}
          sx={{ width: { xs: '100%', md: '50%' } }}
        />
        <TextField
          required
          name="intermediate_ip"
          label="IP промежуточного сервера"
          value={intermediateIp}
          onChange={(e) => setIntermediateIp(e.target.value)}
          sx={{ width: { xs: '100%', md: '50%' } }}
        />
        <TextField
          required
          type="number"
          name="port"
          label="SSH Порт"
          value={formData.port}
          onChange={handleChange}
          sx={{ width: { xs: '100%', md: '50%' } }}
        />
        <TextField
          required
          name="username"
          label="Пользователь"
          value={formData.username}
          onChange={handleChange}
          sx={{ width: { xs: '100%', md: '50%' } }}
        />
        <FormControl sx={{ width: { xs: '100%', md: '50%' } }}>
          <InputLabel>Тип авторизации</InputLabel>
          <Select
            name="auth_type"
            value={formData.auth_type}
            onChange={handleChange}
            label="Тип авторизации"
          >
            <MenuItem value="password">Пароль</MenuItem>
            <MenuItem value="key">SSH Ключ</MenuItem>
          </Select>
        </FormControl>
        <TextField
          required
          name="auth_value"
          label={formData.auth_type === 'password' ? "Пароль" : "Приватный ключ"}
          type={formData.auth_type === 'password' ? "password" : "text"}
          multiline={formData.auth_type === 'key'}
          rows={formData.auth_type === 'key' ? 4 : 1}
          value={formData.auth_value}
          onChange={handleChange}
          sx={{ width: { xs: '100%', md: '50%' } }}
        />
      </Stack>
      <Button type="submit" variant="contained" disabled={loading || installed} size="large">
        {loading ? 'Установка...' : 'Установить'}
      </Button>
      {output ? (
        <Paper sx={{ mt: 3, p: 2, bgcolor: '#1e1e1e', color: error ? 'red' : 'green', whiteSpace: 'pre-wrap', fontFamily: 'monospace', overflowX: 'auto' }}>
          {output}
        </Paper>
      ) : (
        <>
          {loading && (
            <Paper sx={{ mt: 3, p: 2, bgcolor: '#1e1e1e', color: 'gray', whiteSpace: 'pre-wrap', fontFamily: 'monospace', overflowX: 'auto' }}>
              Выполняется установка...
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default AutoForwardingInstall;
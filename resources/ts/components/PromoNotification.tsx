import React, { useState } from 'react';
import { Snackbar, Alert, Button, Slide } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // Иконка ключа/VPN
import { useNavigate } from 'react-router-dom';

// Анимация появления (слайд снизу)
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const PromoNotification = () => {
  // Изначально уведомление открыто
  const navigator = useNavigate();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      // autoHideDuration={null} означает, что само оно не исчезнет
      autoHideDuration={null} 
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      // Позиция: снизу справа
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      sx={{ maxWidth: '400px', top: { xs: 130, md: 80 } }} // Отступ снизу (на мобильных выше, чтобы не перекрыть кнопку)
    >
      <Alert
        onClose={handleClose}
        severity="info" // Синий цвет (инфо), можно сменить на 'success' (зеленый)
        variant="filled" // Полная заливка цветом для привлечения внимания
        icon={<VpnKeyIcon fontSize="inherit" color='warning' />}
        sx={{ 
          width: '100%', 
          bgcolor: '#00192eff', // Яркий синий цвет
          color: '#fff',
          fontWeight: 'bold',
          '& .MuiAlert-icon': {
            color: '#fff'
          }
        }}
      >
        <Button variant="text" onClick={() => navigator('/3dp-manager')} sx={{ p: 0, m: 0, textDecoration: 'underline' }}>3DP-MANAGER</Button> — новая утилита для стабильного VPN подключения!
      </Alert>
    </Snackbar>
  );
};

export default PromoNotification
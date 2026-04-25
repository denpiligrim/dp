import { useState } from 'react';
import { 
  Box, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions 
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { QRCodeSVG } from 'qrcode.react'; 

export const NaiveConverter = ({ processedLink }) => {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  return (
    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<QrCodeIcon />}
              onClick={() => setIsQrModalOpen(true)}
            >
              Показать QR код
            </Button>
          </Box>
        </Box>

      <Dialog 
        open={isQrModalOpen} 
        onClose={() => setIsQrModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle align="center">QR-код NaiveProxy</DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <QRCodeSVG 
            value={processedLink} 
            size={512}
            level="L"
            includeMargin
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsQrModalOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
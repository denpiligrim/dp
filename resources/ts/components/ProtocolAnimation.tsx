import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import { useState, useEffect } from 'react';

const flipAnimation = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(-100%) rotateX(-90deg); 
  }
  5% { 
    opacity: 1; 
    transform: translateY(0) rotateX(0deg); 
  }
  20% { 
    opacity: 1; 
    transform: translateY(0) rotateX(0deg); 
  }
  25% { 
    opacity: 0; 
    transform: translateY(100%) rotateX(90deg); 
  }
  100% { 
    opacity: 0; 
    transform: translateY(100%) rotateX(90deg); 
  }
`;

const protocols = ['vless', 'hysteria2', 'MTProto', 'SOCKS5', 'AmneziaWG'];

export default function ProtocolAnimation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % protocols.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        mb: 3
      }}
    >

      <Box sx={{
        position: 'relative',
        height: { xs: '40px', md: '50px' },
        overflow: 'hidden',
        flexGrow: 1,
        perspective: '1000px',
        display: 'flex',
        alignItems: 'center'
      }}>
        {protocols.map((protocol, i) => (
          <Typography
            key={protocol}
            variant="h3"
            component="span"
            color="primary"
            sx={{
              fontWeight: 'bold',
              position: 'absolute',
              left: 0,
              top: 0,
              whiteSpace: 'nowrap',
              opacity: 0,
              animation: i === index ? `${flipAnimation} 4s cubic-bezier(0.23, 1, 0.32, 1) infinite` : 'none',
              transformOrigin: '50% 50% -25px',
            }}
          >
            {protocol}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
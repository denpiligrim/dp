import { Box, BoxProps } from '@mui/material';

export default function InlineCode({ children, sx, ...props }: BoxProps) {
  return (
    <Box
      component="code"
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.08)',
        color: 'primary.light',
        px: 0.8,
        py: 0.2,
        borderRadius: '6px',
        fontFamily: 'monospace',
        fontSize: '0.85em',
        whiteSpace: 'nowrap',
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
import { Box, BoxProps, Tooltip } from '@mui/material';
import { useState } from 'react';

// Расширяем стандартные пропсы Box, добавляя наш кастомный пропс copy
interface InlineCodeProps extends BoxProps {
  copy?: boolean;
}

export default function InlineCode({ children, sx, copy = false, ...props }: InlineCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Если пропс copy не передан или равен false, ничего не делаем
    if (!copy) return;

    const textToCopy = typeof children === 'string' ? children : String(children);
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Ошибка копирования: ', err);
    });
  };

  // Выносим саму верстку кода в отдельную переменную, 
  // чтобы не дублировать ее для вариантов с тултипом и без
  const codeElement = (
    <Box
      component="code"
      onClick={copy ? handleCopy : undefined}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.08)',
        color: 'primary.light',
        px: 0.8,
        py: 0.2,
        borderRadius: '6px',
        fontFamily: 'monospace',
        fontSize: '0.85em',
        whiteSpace: 'nowrap',
        // Условные стили: применяем hover и курсор только если copy={true}
        ...(copy && {
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.16)',
          },
        }),
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );

  // Если copy={true}, оборачиваем в Tooltip
  if (copy) {
    return (
      <Tooltip 
        title={copied ? "Скопировано!" : "Нажмите, чтобы скопировать"} 
        placement="top"
        arrow
      >
        {codeElement}
      </Tooltip>
    );
  }

  // В противном случае просто возвращаем элемент
  return codeElement;
}
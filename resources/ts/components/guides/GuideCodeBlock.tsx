import { ComponentProps } from 'react';
import { Box } from '@mui/material';
import CodeBlock from '../CodeBlock';

type GuideCodeBlockProps = ComponentProps<typeof CodeBlock> & { title?: string; };
const titles: Record<string, string> = { bash: 'Терминал', json: 'Конфигурация JSON', nginx: 'Конфигурация Nginx', html: 'HTML' };

export function GuideCodeBlock({ title, language = 'bash', mb, ...props }: GuideCodeBlockProps) {
  return (
    <Box className="guide-code" sx={mb === undefined ? undefined : { mb }}>
      <Box className="guide-code-header"><span>{title ?? titles[language] ?? 'Код'}</span><span>{language}</span></Box>
      <CodeBlock {...props} language={language} mb={0} />
    </Box>
  );
}

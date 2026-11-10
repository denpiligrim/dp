import { Fragment } from 'react';
import { CSSProperties } from 'react';
import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GuideFlowNode } from './types';

export function GuideFlow({ nodes, label }: { nodes: GuideFlowNode[]; label: string; }) {
  const columns = nodes.map(() => '1fr').join(' auto ');
  return (
    <Box className="guide-flow" aria-label={label} style={{ '--guide-flow-columns': columns } as CSSProperties}>
      {nodes.map((node, index) => (
        <Fragment key={node.id}>
          {index > 0 && <ArrowForwardIcon className="guide-flow-arrow" />}
          <Box>
            <span className="guide-flow-label">{String(index + 1).padStart(2, '0')} / {node.label}</span>
            <Typography>{node.icon}{node.title}</Typography>
            <span>{node.detail}</span>
          </Box>
        </Fragment>
      ))}
    </Box>
  );
}

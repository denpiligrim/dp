import { Box, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import materialDark from 'react-syntax-highlighter/dist/esm/styles/prism/material-dark';
import apacheconf from 'react-syntax-highlighter/dist/esm/languages/prism/apacheconf';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import http from 'react-syntax-highlighter/dist/esm/languages/prism/http';
import ini from 'react-syntax-highlighter/dist/esm/languages/prism/ini';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import nginx from 'react-syntax-highlighter/dist/esm/languages/prism/nginx';
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell';
import properties from 'react-syntax-highlighter/dist/esm/languages/prism/properties';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useGuideErrors } from '../security/GuideValidation';

for (const [name, grammar] of Object.entries({ apacheconf, bash, http, ini, json, markup, nginx, powershell, properties, yaml })) {
  SyntaxHighlighter.registerLanguage(name, grammar);
}
SyntaxHighlighter.alias('apacheconf', 'apache');

const CodeBlock = ({ code, language = 'bash', copy = true, mb = 4, sudo = false, customStyle = {}, onCopied }: { code: string, language?: string, copy?: boolean, mb?: number, sudo?: boolean, customStyle?: React.CSSProperties, onCopied?: () => void }) => {
  const [copied, setCopied] = useState(false);
  const errors = useGuideErrors();

  const handleCopy = async () => {
    if (errors.length) return;
    try { await navigator.clipboard.writeText(code); } catch { return; }
    onCopied?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (errors.length) return null;
  if (code.includes('<sudo>')) {
    if (sudo) {
      code = code.replaceAll("<sudo>", "sudo ");
    } else {
      code = code.replaceAll("<sudo>", "");
    }
  }

  return (
    <Box onCopy={onCopied} sx={{ position: 'relative', mb: mb, borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
      {copy && (
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
          <Tooltip title={copied ? "Скопировано!" : "Копировать код"}>
            <IconButton
              onClick={handleCopy}
              sx={{
                color: copied ? '#4caf50' : 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      <SyntaxHighlighter
        language={language}
        style={materialDark}
        customStyle={{ margin: 0, padding: '24px 20px', fontSize: '14px', ...customStyle, maxHeight: 1000, overflow: 'auto' }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
}

export default CodeBlock;

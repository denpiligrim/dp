import { Box, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CodeBlock = ({ code, language = 'bash', copy = true, mb = 4, sudo = false }: { code: string, language?: string, copy?: boolean, mb?: number, sudo?: boolean }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (code.includes('<sudo>')) {
    if (sudo) {
      code = code.replaceAll("<sudo>", "sudo ");
    } else {
      code = code.replaceAll("<sudo>", "");
    }
  }

  return (
    <Box sx={{ position: 'relative', mb: mb, borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
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
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '24px 20px', fontSize: '14px', background: '#1e1e1e' }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
}

export default CodeBlock;
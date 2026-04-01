import { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, Typography, Box, IconButton, Tooltip, Stack, Divider 
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface SupportModalProps {
    open: boolean;
    onClose: () => void;
}

const CopyRow = ({ label, value }: { label: string, value: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
            <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', wordBreak: 'break-all' }}>
                    {value}
                </Typography>
            </Box>
            <Tooltip title={copied ? "Скопировано!" : "Копировать"}>
                <IconButton 
                    onClick={handleCopy} 
                    color={copied ? "success" : "default"}
                    sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.05)' }}
                >
                    {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
            </Tooltip>
        </Stack>
    );
};

export default function SupportModal({ open, onClose }: SupportModalProps) {
    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundImage: 'none',
                    bgcolor: '#121212'
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" fontWeight="bold">Поддержать автора</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <Typography component="p" variant="caption" textAlign="center" color="textSecondary" sx={{ my: 1 }}>
                    Рекомендуется делать перевод криптовалютой
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ my: 1 }}>
                    Банковским переводом <small style={{ color: 'red' }}>(В назначении платежа пишем "Подарок")</small>
                </Typography>
                <CopyRow label="💳 Карта МИР (RU)" value="2204320436318077" />
                <CopyRow label="💳 Карта MasterCard (KZ)" value="5395452209474530" />

                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                    На электронный кошелек
                </Typography>
                <CopyRow label="💰 ЮМоney" value="4100116897060652" />
                <CopyRow label="💰 PayPal" value="vasiljevdenisx@gmail.com" />

                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                    Криптовалютой
                </Typography>
                <CopyRow label="🪙 USDT | ETH (ERC20 | BEP20)" value="0x6fe140040f6Cdc1E1Ff2136cd1d60C0165809463" />
                <CopyRow label="🪙 USDT | TRX (TRC20)" value="TEWxXmJxvkAmhshp7E61XJGHB3VyM9hNAb" />
                <CopyRow label="🪙 Bitcoin" value="bc1qctntwncsv2yn02x2vgnkrqm00c4h04c0afkgpl" />
                <CopyRow label="🪙 TON" value="UQCZ3MiwyYHXftPItMMzJRYRiKHugr16jFMq2nfOQOOoemLy" />
                <CopyRow label="🪙 Bybit ID" value="165292278" />
            </DialogContent>
        </Dialog>
    );
}
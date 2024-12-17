import { ConnectButton, darkTheme } from 'thirdweb/react';
import { client } from '../web3/client';
import { soneiumMinato } from "thirdweb/chains";
import { createWallet } from "thirdweb/wallets";
import { Box } from '@mui/material';
import { CSSProperties, FC } from 'react';
import { useTranslation } from 'react-i18next';

const ConnectWallet: FC = (): JSX.Element => {

  const { t, i18n } = useTranslation();

  const buttonStyle: CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    zIndex: 1
  };

  const customTheme = darkTheme({
    colors: {
      accentText: '#3390ec',
      accentButtonBg: '#3390ec',
      accentButtonText: '#3390ec'
    },
  });

  return (
    <Box position="relative" width="100%">
      <ConnectButton
        client={client}
        chain={soneiumMinato}
        connectModal={{
          size: "compact",
          showThirdwebBranding: false
        }}
        connectButton={{
          label: t('connectWallet'),
          style: { ...buttonStyle, borderRadius: '25px' }
        }}
        detailsButton={{
          style: buttonStyle,
          connectedAccountAvatarUrl: 'https://denpiligrim.ru/storage/images/dogwifhat.webp'
        }}
        detailsModal={{
          connectedAccountAvatarUrl: 'https://denpiligrim.ru/storage/images/dogwifhat.webp'
        }}
        switchButton={{
          label: t('switchNetwork'),
          style: { ...buttonStyle, borderRadius: '25px' }
        }}
        supportedTokens={{
          1946: [
            {
              address: "0x00B2AAFBdF2CAff943f8eb702beEcBD899494948",
              name: "PEACE",
              symbol: "PEACE",
              icon: 'https://denpiligrim.ru/storage/images/peace.webp'
            }
          ]
        }}
        theme={customTheme}
        wallets={[
          createWallet("io.metamask"),
          createWallet("com.trustwallet.app"),
          createWallet("me.rainbow")
        ]}
      />
    </Box>
  )
}

export default ConnectWallet
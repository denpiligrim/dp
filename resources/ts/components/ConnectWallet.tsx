import { ClaimButton, ConnectButton, darkTheme } from 'thirdweb/react';
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
          connectedAccountAvatarUrl: 'https://denpiligrim.ru/storage/images/dogwifhat.webp',
          showTestnetFaucet: true,
          footer: () => (
            <ClaimButton
              contractAddress="0x0505ED47AF7aE33f47efA15bbC630F8A82525436"
              chain={soneiumMinato}
              client={client}
              claimParams={{
                type: "ERC20",
                quantity: '1000'
              }}
            >
              Claim $PEACE tokens
            </ClaimButton>
          )
        }}
        switchButton={{
          label: t('switchNetwork'),
          style: { ...buttonStyle, borderRadius: '25px' }
        }}
        supportedTokens={{
          1946: [
            {
              address: "0x0505ED47AF7aE33f47efA15bbC630F8A82525436",
              name: "PEACE",
              symbol: "PEACE",
              icon: 'https://denpiligrim.ru/storage/images/peace.webp'
            }
          ]
        }}
        theme={customTheme}
        wallets={[
          createWallet("io.metamask"),
          createWallet("me.rainbow"),
          createWallet("com.trustwallet.app")
        ]}
      />
    </Box>
  )
}

export default ConnectWallet
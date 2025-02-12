import { ClaimButton, ConnectButton, darkTheme } from 'thirdweb/react';
import { client } from '../web3/client';
import { soneiumMinato } from "thirdweb/chains";
import { createWallet } from "thirdweb/wallets";
import { Box, Link, Tooltip, Typography } from '@mui/material';
import { CSSProperties, FC } from 'react';
import { useTranslation } from 'react-i18next';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';

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
      accentButtonText: '#fff'
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
            <>
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
              <Tooltip slotProps={{ popper: { sx: { zIndex: 10001 } }, tooltip: { sx: { maxWidth: '340px' } } }} title={
                <>
                  <Typography variant='caption' component='p'><LooksOneIcon fontSize='small' sx={{ verticalAlign: 'middle' }} /> To get the tokens you need a MetaMask wallet and test ETH on the Soneium Minato network to pay fees (You can get them by clicking “Request Testnet Funds” above).</Typography>
                  <Typography variant='caption' component='p'><LooksTwoIcon fontSize='small' sx={{ verticalAlign: 'middle' }} /> Then, having connected with MM wallet, click “Claim $PEACE tokens” button above and sign the transaction.</Typography>
                  <Typography variant='caption' component='p'><Looks3Icon fontSize='small' sx={{ verticalAlign: 'middle' }} /> That's it, you can check your tokens on the wallet. You can add token manually, contract address: 0x0505ED47AF7aE33f47efA15bbC630F8A82525436</Typography>
                </>
              }>
                <Link variant='caption' href="" onClick={e => e.preventDefault()} sx={{ textDecoration: 'underline dotted white', textAlign: 'center', color: 'white' }}>How to get Airdrop?</Link>
              </Tooltip>
            </>
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
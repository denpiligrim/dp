import { Icon } from '@mui/material';
import myPngIcon from '../../images/logo_head_square_sm.png';

const GikIcon = ({ ...props }) => {
  return (
    <Icon
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& img': {
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        },
      }}
      {...props}
    >
      <img src={myPngIcon} alt="custom-icon" />
    </Icon>
  );
};

export default GikIcon;
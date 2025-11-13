import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import Logo from '.././../.././assets/images/logo-icon.svg';

const Header = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: 'primary.main', boxShadow: 1 }}>
            <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box display="flex" alignItems="center">
                    <img
                        src={Logo}
                        alt="LEPRA"
                        style={{ height: 45, marginRight: 12 }}
                    />
                </Box>
                <Box display="flex" alignItems="center">
                    <img
                        src={Logo}
                        alt="eyeSmart"
                        style={{ height: 35, marginRight: 8 }}
                    />
                    <Typography variant="subtitle2" color="white">
                        the Smarter EMR!
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;

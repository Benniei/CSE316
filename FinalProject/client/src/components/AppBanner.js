import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    const handleSplash = () => {
        handleMenuClose();
        auth.guestOut();
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>   
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>     

    let initials = "";
    let menu = loggedOutMenu;
    if(auth.guest){ 
        menu = <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
            <MenuItem onClick={handleSplash}><Link to='/'>Return to Home Screen</Link></MenuItem> 
        </Menu>
    }
    if (auth.loggedIn && auth.guest === false) {
        menu = loggedInMenu;
        initials = auth.user.firstName.charAt(0) + auth.user.lastName.charAt(0);
    }
    
    function getAccountMenu(loggedIn) {
        return <AccountCircle />;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar
                sx={{backgroundColor: "#e0e0e0"}}>
                    <Typography                        
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' }}}                
                    >
                        <Link style={{ textDecoration: 'none', color: '#d9aa13' }} to='/'>T<sup>5</sup>L</Link>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {
                            !auth.loggedIn || auth.guest?
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                { getAccountMenu(auth.loggedIn) }
                            </IconButton>
                            :
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                                sx={{border: "2px black solid", backgroundColor:"#757ce8"}}
                            >
                                <Typography                        
                                    variant="body1"
                                    noWrap
                                    component="div"
                                    sx={{ display: { xs: 'none', sm: 'block', color:"#000000"}}}                        
                                >
                                    {initials} 
                                </Typography>
                            </IconButton>
                        }
                    </Box>
                    
                </Toolbar>
            </AppBar>
            {
                menu
            }
             
        </Box>
    );
}
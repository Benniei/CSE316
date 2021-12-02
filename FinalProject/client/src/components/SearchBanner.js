import { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';
import SortIcon from '@mui/icons-material/Sort';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';

export default function SearchBanner(){
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleHome = () => {
        let payload = {
            loginName: auth.user.loginName,
            homeState: 1
        };
        store.loadIdNamePairs(payload);
    }

    const handleAllList = () => {
        let payload = {
            published: true,
            homeState: 2
        };
        store.loadIdNamePairs(payload);
    }
    
    const handleUserList = () => {
        let payload = {
            published: true,
            homeState: 3
        };
        store.loadIdNamePairs(payload);
    }

    const handleCommunityList = () => {
        let payload = {
            community: true,
            homeState: 4
        };
        store.loadIdNamePairs(payload);
    }

    const currentState = store.homeState;
    console.log(currentState);
    const sortMenu = (<Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id="sort"
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={handleMenuClose}>Publish Date (Oldest)</MenuItem>
            <MenuItem onClick={handleMenuClose}>Views</MenuItem>   
            <MenuItem onClick={handleMenuClose}>Likes</MenuItem>   
            <MenuItem onClick={handleMenuClose}>Dislikes</MenuItem>   
        </Menu>);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{
                backgroundColor: "#abcd12"
            }}>
                <Toolbar>
                        <IconButton
                                size="large"
                                edge="end"
                                aria-label="homeList"
                                aria-haspopup="true"
                                color="inherit"
                                onClick={handleHome}
                            >
                            {(currentState === 1)?
                            <HomeOutlinedIcon sx={{ fontSize: 35, color: '#000000', border: "2px solid green"}}/>
                            :
                            <HomeOutlinedIcon sx={{ fontSize: 35, color: '#000000' }}/>
                            }
                        </IconButton>
                        <IconButton
                                size="large"
                                edge="end"
                                aria-label="homeList"
                                aria-haspopup="true"
                                color="inherit"
                                onClick={handleAllList}
                            >
                            {(currentState === 2)?
                            <GroupsOutlinedIcon sx={{ fontSize: 35, color: '#000000', border: "2px solid green"}}/>  
                            :
                            <GroupsOutlinedIcon sx={{ fontSize: 35, color: '#000000'  }}/>
                            }
                        </IconButton>
                        <IconButton
                                size="large"
                                edge="end"
                                aria-label="homeList"
                                aria-haspopup="true"
                                color="inherit"
                                onClick={handleUserList}
                            >
                            {(currentState === 3)?
                            <PersonOutlineOutlinedIcon sx={{ fontSize: 35, color: '#000000', border: "2px solid green"}}/>  
                            :
                            <PersonOutlineOutlinedIcon sx={{ fontSize: 35, color: '#000000'}}/>
                            } 
                        </IconButton>
                        <IconButton
                                size="large"
                                edge="end"
                                aria-label="homeList"
                                aria-haspopup="true"
                                color="inherit"
                                onClick={handleCommunityList}
                            >
                            {(currentState === 4)?
                            <FunctionsOutlinedIcon sx={{ fontSize: 35, color: '#000000', border: "2px solid green"}}/>  
                            :
                            <FunctionsOutlinedIcon sx={{ fontSize: 35, color: '#000000'}}/>
                            }  
                        </IconButton>
                        <Grid item xs={12} sm={6} pl={3}>
                            <TextField   
                                id="search"
                                label="Search"
                                name="search"
                                autoComplete="Search"
                                size="large"
                                fullWidth
                            />
                        </Grid>
                    <Box sx={{ flexGrow: 1 }}></Box>
                        <Typography                        
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block', color: "#000000" } }}            
                        >
                            SORT BY
                        </Typography>
                        <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="homeList"
                                    aria-haspopup="true"
                                    color="inherit"
                                    onClick={handleProfileMenuOpen}
                                >
                                <SortIcon sx={{ fontSize: 35, color: "#000000" }}/>  
                        </IconButton>
                </Toolbar>
            </AppBar>
            {
                sortMenu
            }
        </Box>
    );
}

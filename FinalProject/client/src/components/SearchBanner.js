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
    const [text, setText] = useState("");
    const isMenuOpen = Boolean(anchorEl);
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleHome = () => {
        let payload = {
            loginName: auth.user.loginName,
            homeState: 1
        };
        store.loadIdNamePairs(payload);
        setText("");
    }

    const handleAllList = () => {
        let payload = {
            homeState: 2
        };
        store.loadIdNamePairs(payload);
        setText("");
    }
    
    const handleUserList = () => {
        let payload = {
            homeState: 3
        };
        store.loadIdNamePairs(payload);
        setText("");
    }

    const handleCommunityList = () => {
        let payload = {
            homeState: 4
        };
        store.loadIdNamePairs(payload);
        setText("");
    }

    const handleSearch = (event) => {
        event.preventDefault();
        let payload = {
            loginName: auth.user.loginName,
            homeState: currentState,
            search: text.trim()
        };
        store.loadIdNamePairs(payload);
    };

    const handleSort1 = () => {
        store.updateSort(1, store.idNamePairs);
        handleMenuClose();
    };

    const handleSort2 = () => {
        store.updateSort(2, store.idNamePairs);
        handleMenuClose();
    };

    const handleSort3 = () => {
        store.updateSort(3, store.idNamePairs);
        handleMenuClose();
    };

    const handleSort4 = () => {
        store.updateSort(4, store.idNamePairs);
        handleMenuClose();
    };

    const handleSort5 = () => {
        store.updateSort(5, store.idNamePairs);
        handleMenuClose();
    };

    const currentState = store.homeState;
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
            {store.sortState === 1?
                <MenuItem onClick={handleSort1} sx={{backgroundColor:"#D3D3D3"}}>Publish Date (Newest)</MenuItem>
                :
                <MenuItem onClick={handleSort1}>Publish Date (Newest)</MenuItem>
            }
            {store.sortState === 2?
                <MenuItem onClick={handleSort2} sx={{backgroundColor:"#D3D3D3"}}>Publish Date (Oldest)</MenuItem>
                :
                <MenuItem onClick={handleSort2}>Publish Date (Oldest)</MenuItem>
            }
            {store.sortState === 3?
                <MenuItem onClick={handleSort3} sx={{backgroundColor:"#D3D3D3"}}>Views (Newest)</MenuItem>
                :
                <MenuItem onClick={handleSort3}>Views</MenuItem>
            }
            {store.sortState === 4?
                <MenuItem onClick={handleSort4} sx={{backgroundColor:"#D3D3D3"}}>Likes (Newest)</MenuItem>
                :
                <MenuItem onClick={handleSort4}>Likes</MenuItem> 
            }
            {store.sortState === 5?
                <MenuItem onClick={handleSort5} sx={{backgroundColor:"#D3D3D3"}}>Dislikes (Newest)</MenuItem>
                :
                <MenuItem onClick={handleSort5}>Dislikes</MenuItem>
            }
        </Menu>);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{
                backgroundColor: "#c4c4c4",
                boxShadow: "none"
            }}>
                <Toolbar>
                        <IconButton
                                size="large"
                                edge="end"
                                aria-label="homeList"
                                aria-haspopup="true"
                                color="inherit"
                                onClick={handleHome}
                                disabled={auth.guest}
                            >
                            {
                            (!auth.guest)?
                                (currentState === 1)?
                                <HomeOutlinedIcon sx={{ fontSize: 35, color: '#000000', border: "2px solid green"}}/>
                                :
                                <HomeOutlinedIcon sx={{ fontSize: 35, color: '#000000' }}/>
                            :
                                <HomeOutlinedIcon sx={{ fontSize: 35, color: '#808080' }}/>
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
                                onChange={handleUpdateText}
                                value={text}
                                sx={{backgroundColor:"#FFFFFF"}}
                                onKeyPress={(event) => {
                                    if (event.key === 'Enter'){
                                        handleSearch(event);
                                    }
                                }}
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

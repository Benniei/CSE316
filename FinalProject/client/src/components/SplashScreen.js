import * as React from 'react';
import { useContext } from 'react';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';


export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    function loginGuest(){
        auth.loginGuest(store);
    }
    
    return (
        <div id="splash-screen">
            The Top 5<br />
            Lister
            <Typography
            variant = "h4"
            pt = {10}>
                Compare your tastes with others!
            </Typography>
            <Stack
                    direction = "row"
                    alignItems = "center"
                    justifyContent = "center"
                    spacing={3}
                    pt = {10}
                >
                    <Link to='/login/'>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{maxWidth: '300px', maxHeight: '100px', minWidth: '200px', minHeight: '30px'}}
                        >
                        
                            Login
                        </Button>
                    </Link>
                    <Link to='/register/'>
                    <Button
                        type="submit"
                        variant="contained"
                        style={{maxWidth: '300px', maxHeight: '100px', minWidth: '200px', minHeight: '30px'}}
                    >
                        Create New Account
                    </Button>
                    </Link>
            </Stack> 
            <Stack
                    direction = "row"
                    alignItems = "center"
                    justifyContent = "center"
                    pt = {2}
            >
            <Button
                        type="submit"
                        variant="contained"
                        style={{maxWidth: '300px', maxHeight: '100px', minWidth: '200px', minHeight: '30px'}}
                        onClick={loginGuest}
                    >
                        View as Guest
                    </Button>
            </Stack>
        </div>
    )
}

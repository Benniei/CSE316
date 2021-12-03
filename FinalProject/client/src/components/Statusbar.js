import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
/*
    Our Status bar React component goes at the bottom of our UI.
*/
function Statusbar() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    function handleCreateNewList() {
        store.createNewList();
    }

    return (
        auth.loggedIn?
            (store.homeState === 1)?
                <div id="top5-statusbar">
                    <IconButton 
                        aria-label="add"
                        id="add-list-button"
                        onClick={handleCreateNewList}
                    >
                        <AddIcon sx={{ fontSize: 60, color: '#000000',  }}/>
                    </IconButton>
                        <Typography variant="h2">Your Lists</Typography>
                </div>
            :
                <div id="top5-statusbar">
                    {(store.homeState !== 0)?
                        <Typography variant="h2">{store.search} Lists</Typography>
                    :
                        null
                    }
                </div>
        :
            null
    );
}

export default Statusbar;
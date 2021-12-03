import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
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
                    <Fab 
                        color="primary" 
                        aria-label="add"
                        id="add-list-button"
                        onClick={handleCreateNewList}
                    >
                        <AddIcon />
                    </Fab>
                        <Typography variant="h2">Your Lists</Typography>
                </div>
            :
                <div id="top5-statusbar">
                        <Typography variant="h2">{store.search} Lists</Typography>
                </div>
        :
            null
    );
}

export default Statusbar;
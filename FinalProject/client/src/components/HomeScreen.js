import React, { useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import ListCard from './ListCard.js';
import List from '@mui/material/List';
import DeleteModal from './DeleteModal.js';
import SearchBanner from './SearchBanner.js';
import AuthContext from '../auth';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        let payload = null;
        if(auth.guest){
            payload = {
                community: true,
                homeState: 4
            };
        }
        else{
            payload = {
                loginName: auth.user.loginName,
                homeState: 1
            };
        }
        store.loadIdNamePairs(payload);
    }, []);

    
    let listCard = "";
    let bool = 0;
    if(store.currentList)
        bool = store.currentList._id;
    if (store.idNamePairs) {
        listCard = 
            <List sx={{ width: '90%', left: '5%'}}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        expand={pair._id === bool}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    return (
        <div>
            <SearchBanner />
            <div id="top5-list-selector">
                <div id="list-selector-list">
                    {
                        listCard
                    }
                    <DeleteModal />
                </div>
            </div>
        </div>)
    
}

export default HomeScreen;
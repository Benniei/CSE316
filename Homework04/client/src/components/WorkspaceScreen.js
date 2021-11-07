import { useContext } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);

    let editItems = "";
    let hehFlag = false;
    console.log(hehFlag);
    if(store.heh){
        hehFlag = true;
    }
    if (store.currentList) {
        editItems = 
            <List id="edit-items" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item 
                            key={'top5-item-' + (index+1)}
                            text={item}
                            index={index} 
                        />
                    ))
                }
            </List>;
    }
    else if (hehFlag === false){
        let url = document.URL;
        let index = url.lastIndexOf("top5list");
        let listid;
        listid = url.substring(index+9);
        if(listid.lastIndexOf("/") !== -1){
            listid = listid.substring(0, listid.length-1);
        }
        store.setCurrentList(listid);
    }
    return (
        !hehFlag ?
        <div id="top5-workspace">
            <div id="workspace-edit">
                <div id="edit-numbering">
                    <div className="item-number"><Typography variant="h3">1.</Typography></div>
                    <div className="item-number"><Typography variant="h3">2.</Typography></div>
                    <div className="item-number"><Typography variant="h3">3.</Typography></div>
                    <div className="item-number"><Typography variant="h3">4.</Typography></div>
                    <div className="item-number"><Typography variant="h3">5.</Typography></div>
                </div>
                {editItems}
            </div>
        </div>
        :
        <div>
            <center>
                <h1>This list aint your list, it is my list NOW </h1>
                <img src="https://c.tenor.com/ZztVmkKG2TIAAAAM/pepe-sad-pepe-crying.gif" />
            </center>
            <center>
                <img src="https://c.tenor.com/aRyBninVp0IAAAAM/sad-pepe.gif" />
            </center>
        </div>
    )
}

export default WorkspaceScreen;
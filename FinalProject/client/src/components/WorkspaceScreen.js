import { useContext } from 'react';
import Top5Item from './Top5Item.js';
import NameItem from './NameItem'
import List from '@mui/material/List';
import { Typography } from '@mui/material';
import { GlobalStoreContext } from '../store/index.js';
import AuthContext from '../auth';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);

    let editItems = "";
    let hehFlag = false;
    let canPublish = false;

    function handleClose() {
        store.closeCurrentList();
    }

    function handlePublish() {
        store.publishCurrentList();
    }

    if(store.heh){
        hehFlag = true;
    }

    function checkIfDuplicateExists(arr) {
        return new Set(arr).size !== arr.length
    }

    if (store.currentList) {
        editItems = 
            <List id="edit-items" sx={{ width: '100%', bgcolor: 'background.paper', padding: 0 }}>
                {
                    <NameItem
                        key={'top5-item-name'}
                        text={store.currentList.name}
                    />
                }
                {
                    store.currentList.items.map((item, index) => (
                        (item !== "?")?
                        <Top5Item 
                            key={'top5-item-' + (index)}
                            text={item}
                            index={index} 
                        />
                        :
                        <Top5Item 
                            key={'top5-item-' + (index)}
                            text={""}
                            index={index} 
                        />
                    ))
                }
            </List>;
        let currList = store.currentList.items;
        // Checks for empty items in the list
        if(store.publish){
            if(!currList.includes("?")){
                // Checks if any of the Items are repeats
                if(!checkIfDuplicateExists(currList)){
                    // TODO Check for list name
                    canPublish = true;
                }
                else{
                    canPublish = false;
                }
            }
        }
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
                    <div className="item-number"><Typography variant="h3">Name:</Typography></div>
                    <div className="item-number"><Typography variant="h3">1.</Typography></div>
                    <div className="item-number"><Typography variant="h3">2.</Typography></div>
                    <div className="item-number"><Typography variant="h3">3.</Typography></div>
                    <div className="item-number"><Typography variant="h3">4.</Typography></div>
                    <div className="item-number"><Typography variant="h3">5.</Typography></div>
                </div>
                {editItems}
            </div>
            <div>
                <Stack
                    direction = "row"
                    alignItems = "right"
                    justifyContent = "right"
                    spacing={3}
                    pr={2}
                    >
                    <Button
                        type="submit"
                        variant="contained"
                        style={{maxWidth: '200px', maxHeight: '100px', minWidth: '150px', minHeight: '30px'}}
                        onClick={handleClose}
                    >
                        Save
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        style={{maxWidth: '200px', maxHeight: '100px', minWidth: '150px', minHeight: '30px'}}
                        disabled={!canPublish}
                        onClick={handlePublish}
                    >
                        Publish
                    </Button>
                </Stack>
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
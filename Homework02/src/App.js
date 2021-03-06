import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js'
import Sidebar from './components/Sidebar.js'
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js';

// Undo and Redo Operations
import jsTPS from "./common/jsTPS.js";
import ChangeItem_Transaction from "./transactions/ChangeItem_Transaction.js";
import MoveItem_Transaction from "./transactions/MoveItem_Transaction.js";

class App extends React.Component {
    constructor(props) {
        super(props);
        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // Transaction Manager
        this.tps = new jsTPS();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // Flags for Edit Buttons
        this.undoFlag = false;
        this.redoFlag = false;
        this.closeFlag = false;

        // undo/redo binding
        this.keyManager = this.keyManager.bind(this);

        // SETUP THE INITIAL STATE
        this.state = {
            currentList : null,
            sessionData : loadedSessionData
        }
    }

    componentDidMount(){
        document.addEventListener("keydown", this.keyManager, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.keyManager, false);
    }

    keyManager(e){
        let Y = 89, Z = 90;
            if (e.keyCode === Z && e.ctrlKey) {
                if (this.tps.hasTransactionToUndo()) {
                    this.tps.undoTransaction();
                    this.updateToolbarbuttons();
                }
                this.setState(prevState => ({
                    sessionData: prevState.sessionData
                }), () => {
                    // ANY AFTER EFFECTS?
                });
            }
            else if (e.keyCode === Y && e.ctrlKey) {
                if(this.tps.hasTransactionToRedo()){
                    this.tps.doTransaction();
                    this.updateToolbarbuttons();
                }
                this.setState(prevState => ({
                    sessionData: prevState.sessionData
                }), () => {
                    // ANY AFTER EFFECTS?
                });
            }
    }

    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }

    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            items: ["?", "?", "?", "?", "?"]
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.currentIndex = -1;
        this.setState(prevState => ({
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);
        });
        this.updateToolbarbuttons();
        this.activateClose();
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }
        this.currentIndex = -1;
        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
            this.tps.clearAllTransactions();
        });
        this.updateToolbarbuttons();
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        this.currentIndex = -1;
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
        });
        this.tps.clearAllTransactions();
        this.updateToolbarbuttons();
        this.activateClose();
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.currentIndex = -1;
        this.setState(prevState => ({
            currentList: null,
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
        });
        this.updateToolbarbuttons();
        this.deactivateClose();
        this.deactivateTransaction();
    }
    deleteList = (keyNamePair) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion: keyNamePair,
            sessionData: prevState.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
        });
        this.showDeleteListModal();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }
    deleteListFromModal = () => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        let key = this.state.listKeyPairMarkedForDeletion.key
        let index = -1;
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                index = i;
                break;
            }
        }
        newKeyNamePairs.splice(index, 1);
        this.sortKeyNamePairsByName(newKeyNamePairs);
        this.currentIndex = -1;
        // Deleting a different List
        if(this.state.currentList !== null && this.state.currentList.key !== key){
            this.setState(prevState => ({
                currentList: prevState.currentList,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey,
                    counter: prevState.sessionData.counter,
                    keyNamePairs: newKeyNamePairs
                }
            }), () => {
                // ANY AFTER EFFECTS?
                this.db.mutationUpdateSessionData(this.state.sessionData);
            });
        }
        // Deleting Current List
        else{
            this.setState(prevState => ({
                currentList: null,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey,
                    counter: prevState.sessionData.counter,
                    keyNamePairs: newKeyNamePairs
                }
            }), () => {
                // ANY AFTER EFFECTS?
                this.db.mutationUpdateSessionData(this.state.sessionData);
            });
            this.deactivateClose();
            this.deactivateTransaction();
        }
        this.hideDeleteListModal();
        this.updateToolbarbuttons();
    }
    /*
    ------------------RENAME ITEMS-----------------------
    */
    renameItem = (key, newText) => {
        this.addChangeItemTransaction(key, newText);
    }
    
    // Used to change the name of an Item 
    changeItem = (key, text) => {
        // Directly changing the previous list
        let currentList = this.state.currentList;
        currentList.items[key] = text;
        this.setState(prevState => ({
            currentList: currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: prevState.sessionData.keyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.db.mutationUpdateList(this.state.currentList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }

    addChangeItemTransaction = (key, newText) => {
        let oldText = this.state.currentList.items[key];
        if(oldText === newText){
            return;
        }
        else{
            let transaction = new ChangeItem_Transaction(this, key, oldText, newText);
            this.tps.addTransaction(transaction);
            this.updateToolbarbuttons();
        }
    }

    /*
    ------- MOVE ITEMS ------
    */
    moveItemCallback = (oldIndex, newIndex) => {
        this.currentIndex = -1;
        this.addMoveItemTransaction(Number(oldIndex), Number(newIndex));
    }

    moveItem = (oldIndex, newIndex) => {
        let currentList = this.db.queryGetList(this.state.currentList.key);
        oldIndex = Number(oldIndex);
        newIndex = Number(newIndex);
        if(oldIndex > newIndex) {
            let hold = currentList.items[oldIndex];
            for(let i = oldIndex-1; i >= newIndex; i--){
                currentList.items[i+1] = currentList.items[i];
            }
            currentList.items[newIndex] = hold;
        }
        else if(newIndex > oldIndex) {
            let hold = currentList.items[oldIndex];
            for(let i = oldIndex; i <= newIndex; i++){
                currentList.items[i] = currentList.items[i+1];
            }
            currentList.items[newIndex] = hold;
        }
        this.currentIndex = -1;
        this.oldIndex = undefined;
        this.setState(prevState => ({
            currentList: currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: prevState.sessionData.keyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.db.mutationUpdateList(this.state.currentList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }

    addMoveItemTransaction = (oldIndex, newIndex) => {
        if(oldIndex === newIndex){
            this.moveItem(oldIndex, newIndex);
            return;
        }
        let transaction = new MoveItem_Transaction(this, oldIndex, newIndex);
        this.tps.addTransaction(transaction);
        this.updateToolbarbuttons();
    }
    
    dragEnterHandler = (oldIndex, newIndex) => {
        let currentList = this.state.currentList;
        let hold = currentList.items[oldIndex];
        currentList.items[oldIndex] = currentList.items[newIndex];
        currentList.items[newIndex] = hold;
        this.currentIndex = oldIndex;

        this.setState(prevState => ({
            currentList: currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: prevState.sessionData.keyNamePairs
            }
        }), () => {
 
        });
    }

    oldIndexCallBack = (oldIndex, flag) => {
        this.oldIndex = oldIndex;

    }

    undo = () => {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
            this.updateToolbarbuttons();
        }
    }

    redo = () => {
        if(this.tps.hasTransactionToRedo()){
            this.tps.doTransaction();
            this.updateToolbarbuttons();
        }
    }

    /*
    -------- Button View -------
    */
    updateToolbarbuttons(){
        if (!this.tps.hasTransactionToUndo()) {
            this.undoFlag = false;
        }
        else {
            this.undoFlag = true;
        }
        if(!this.tps.hasTransactionToRedo()){
            this.redoFlag = false;
        }
        else{
            this.redoFlag = true;
        }
    }

    activateClose(){
        this.closeFlag = true;
    }

    deactivateClose(){
        this.closeFlag = false;
    }

    deactivateTransaction(){
        this.undoFlag = false;
        this.redoFlag = false;
    }

    render() {
        return (
            <div id="app-root">
                <Banner 
                    title='Top 5 Lister'
                    closeCallback={this.closeCurrentList} 
                    undoCallback={this.undo}
                    redoCallback={this.redo}
                    undo={this.undoFlag}
                    redo={this.redoFlag}
                    close={this.closeFlag}
                />
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <Workspace
                    currentList={this.state.currentList} 
                    renameItemCallBack={this.renameItem}
                    moveItemCallBack={this.moveItemCallback}
                    dragEnterHandler={this.dragEnterHandler}
                    currentIndex={this.currentIndex}
                    oldIndexCallBack={this.oldIndexCallBack}
                    oldIndex={this.oldIndex}
                />
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteModal
                    listKeyPair={this.state.listKeyPairMarkedForDeletion}
                    deleteListModalCallback={this.deleteListFromModal}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                />
            </div>
        );
    }
}

export default App;

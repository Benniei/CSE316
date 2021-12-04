import { getBottomNavigationUtilityClass } from '@mui/material';
import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../api'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    LIST_NOT_FOUND: "LIST_NOT_FOUND"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        heh: false,
        publish: false,
        homeState: 0,
        search: null,
        sortState: 0
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    heh: false,
                    publish: payload.publish,
                    homeState: store.homeState,
                    search: store.search,
                    sortState: store.sortState
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    heh: false,
                    publish: store.publish,
                    homeState: 1, // goes to home
                    search: null,
                    sortState: store.sortState
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    heh:false,
                    publish: store.publish,
                    homeState: 0,
                    search: null,
                    sortState: store.sortState
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload.arr,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    heh:false,
                    publish: store.publish,
                    homeState: payload.homeState,
                    search: payload.searchText,
                    sortState: payload.sortState
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload,
                    heh: false,
                    publish: store.publish,
                    homeState: store.homeState,
                    search: store.search,
                    sortState: store.sortState
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    heh: false,
                    publish: store.publish,
                    homeState: store.homeState,
                    search: store.search,
                    sortState: store.sortState
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.list,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    heh: false,
                    publish: payload.publish,
                    homeState: 0,
                    search: null,
                    sortState: store.sortState
                });
            }
            // START EDITING A LIST ITEM
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    heh: false,
                    publish: store.publish,
                    homeState: store.homeState,
                    search: null,
                    sortState: store.sortState
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    heh: false,
                    publish: store.publish,
                    homeState: store.homeState,
                    search: null,
                    sortState: store.sortState
                });
            }
            case GlobalStoreActionType.LIST_NOT_FOUND: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    heh: true,
                    publish: store.publish,
                    homeState: store.homeState,
                    search: store.search,
                    sortState: store.sortState
                })
            }
            case GlobalStoreActionType.FINISH_PUBLISH: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    heh: false,
                    publish: store.publish,
                    homeState: 1,
                    search: null,
                    sortState: store.sortState
                })
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            top5List.name = newName;
            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    async function checkUniqueName(top5List) {
                        if(top5List && auth.user){
                            let payload = {
                                listName: top5List.name,
                                user: auth.user.loginName
                            }
                            let response = await api.getTop5ListExist(payload);
                            if(response.data.success){
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        top5List: top5List,
                                        publish: false
                                    }
                                });
                            }
                            else{
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        top5List: top5List,
                                        publish: true
                                    }
                                });
                            }
                            history.push("/top5list/" + top5List._id);
                        }
                    }
                    checkUniqueName(top5List);
                }
            }
            updateList(top5List);
        }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        history.push("/");
    }

    store.publishCurrentList = async function() {
        // Updates the list with publish date + community list
        let payload = {
            id: store.currentList._id,
            list: store.currentList
        };
        const response = await api.publishList(payload);
        if (response.data.success) {
            // ! ??? what is happening here rerender much often
            history.push("/");
            storeReducer({
                type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
                payload: {}
            });
            
        }
    }

   

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;

        let payload = {
            name: newListName,
            items: ["", "", "", "", ""],
            loginName: auth.user.loginName,
            community: false
        };
        const response = await api.createTop5List(payload);

        if (response.data.success) {
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/top5list/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function (query) {
        const response = await api.getTop5ListPairs(query);
        let searchText = null;
        let sort = 0;
        if(query.search && query.searchText !== 1 && query.search !== ""){
            searchText = query.search;
            sort = store.sortState;
        }
        else if(query.homeState === 2){
            searchText = null;
        }
        else if(query.homeState === 3){
            searchText = null;
        }
        else if(query.homeState === 4){
            searchText = null;
        }

        if(query.sortBy){
            sort = store.sortState;
        }

        if (response.data.success) {
            let pairsArray = response.data.idNamePairs;
            if(sort > 0){
                store.updateSort(sort, pairsArray);
            }
            else{
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        arr: pairsArray,
                        homeState: query.homeState,
                        searchText: searchText,
                        sortState: sort
                    }
                });
            }
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    store.updateSort = async function(sortState, list) {
        if(sortState === 1){
            list.sort((a, b) => {
                if(b.publishedDate > a.publishedDate)
                    return 1;
                else if (b.publishedDate === a.publishedDate)
                    return 0;
                else
                    return -1;
            });
        }
        else if(sortState === 2){
            list.sort((a, b) => {
                if(b.publishedDate < a.publishedDate)
                    return 1;
                else if (b.publishedDate === a.publishedDate)
                    return 0;
                else
                    return -1;
            });
        }
        else if(sortState === 3){
            list.sort((a, b) => {
                return b.views - a.views
            });
        }
        else if(sortState === 4){
            list.sort((a, b) => {
                return b.likes.length - a.likes.length
            });
        }
        else if(sortState === 5){
            list.sort((a, b) => {
                return b.dislikes.length - a.dislikes.length
            });
        }
        storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: {
                arr: list,
                homeState: store.homeState,
                searchText: store.search,
                sortState: sortState
            }
        });
    }

    store.userResponse = async function(id, payload) {
        const response = await api.updateTop5ListById(id, payload);
        if(response.data.success){
            let payload2 = {
                homeState: store.homeState
            }
            if(store.homeState === 1){
                payload2.loginName = auth.user.loginName;
            }
            if(store.search){
                payload2.search = store.search;
            } 
            if(store.sortState > 0){
                payload2.sortBy = store.sortState;
            }
            store.loadIdNamePairs(payload2)
        }
    } 

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }
    }

    function arrayRemove(arr, value) { 
        return arr.filter(function(ele){ 
            return ele._id != value; 
        });
    }

    store.deleteList = async function (listToDelete) {
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.data.success) {
            let arr = arrayRemove(store.idNamePairs, listToDelete._id);
            console.log(arr);
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: {
                    arr: arr,
                    homeState: store.homeState,
                    searchText: store.searchText,
                    sortState: store.sortState
                }
            });
            history.push("/");
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            async function checkUniqueName(top5List) {
                if(top5List && auth.user){
                    let payload = {
                        listName: top5List.name,
                        user: auth.user.loginName
                    }
                    let response = await api.getTop5ListExist(payload);
                    history.push("/top5list/" + top5List._id);
                    if(response.data.success){
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_LIST,
                            payload: {
                                list: top5List,
                                publish: false
                            }
                        });
                    }
                    else{
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_LIST,
                            payload: {
                                list: top5List,
                                publish: true
                            }
                        });
                    }
                }
            }
            checkUniqueName(top5List);
        }
        else{
            storeReducer({
                type: GlobalStoreActionType.LIST_NOT_FOUND,
                payload: null
            })
        }
    }


    store.updateItem = function (index, newItem) {
        store.currentList.items[index] = newItem;
        store.updateCurrentList();
    }

    store.updateCurrentList = async function () {
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: {
                    list: store.currentList,
                    publish: store.publish
                }
            });
        }
    }
    
    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING AN ITEM
    store.setIsItemEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
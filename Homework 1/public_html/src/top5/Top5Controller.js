/**
 * Top5ListController.js
 * 
 * This file provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class Top5Controller {
    constructor() {

    }

    setModel(initModel) {
        // localStorage.clear();
        this.model = initModel;
        this.initHandlers();
        this.model.toolbarUpdate();
    }

    initHandlers() {
        // SETUP THE TOOLBAR BUTTON HANDLERS
        document.getElementById("add-list-button").onmousedown = (event) => {
            let newList = this.model.addNewList("Untitled", ["?","?","?","?","?"]);            
            this.model.loadList(newList.id);
            this.model.saveLists();
        }
        document.getElementById("undo-button").onmousedown = (event) => {
            this.model.undo();
        }
        document.getElementById("redo-button").onmousedown = (event) => {
            this.model.redo();
        }
        document.getElementById("close-button").onmousedown = (event) => {
            this.model.unhighlightAllList();
            this.model.closeList();
            //clear status bar
            let statusbar = document.getElementById("top5-statusbar");
            statusbar.innerHTML = "";
            this.model.endListEditing();
        }

        // SETUP THE ITEM HANDLERS
        for (let i = 1; i <= 5; i++) {
            let item = document.getElementById("item-" + i);

            // AND FOR TEXT EDITING
            item.ondblclick = (ev) => {
                if (this.model.hasCurrentList()) {
                    this.model.startEditing();
                    // CLEAR THE TEXT
                    item.setAttribute("draggable", false);
                    item.innerHTML = "";

                    // ADD A TEXT FIELD
                    let textInput = document.createElement("input");
                    textInput.setAttribute("type", "text");
                    textInput.setAttribute("id", "item-text-input-" + i);
                    // textInput.setAttribute("value", this.model.currentList.getItemAt(i-1));
                    item.appendChild(textInput);

                    textInput.focus();
                    textInput.value = this.model.currentList.getItemAt(i-1);

                    textInput.ondblclick = (event) => {
                        this.ignoreParentClick(event);
                    }
                    textInput.onkeydown = (event) => {
                        if (event.key === 'Enter') {
                            if(this.model.currentList.items[i-1] !== event.target.value)
                                this.model.addChangeItemTransaction(i-1, event.target.value);
                            this.model.restoreList();
                            item.setAttribute("draggable", true);
                            this.model.endEditing();
                        }
                    }
                    textInput.onblur = (event) => {
                        if(this.model.currentList.items[i-1] !== event.target.value)
                            this.model.addChangeItemTransaction(i-1, event.target.value);
                        this.model.restoreList();
                        item.setAttribute("draggable", true);
                        this.model.endEditing();
                    }
                }
            }

            //TODO: init dragging for each element
            item.ondragstart = (ev) => {
                ev.dataTransfer.setData("Text", ev.target.id);
            }
            item.ondragover = (ev) =>{
                ev.preventDefault();
            }
            item.ondrop = (ev) => {
                ev.preventDefault();
                let data = ev.dataTransfer.getData("text");
                let a = i-1;
                let b = parseInt(data.charAt(data.length - 1)) - 1;
                this.model.addMoveItemTransaction(a, b);
            }
        }
    }

    exchangeElement(a, b){
        let aHolder = a.innerHTML.slice();
        let bHolder = b.innerHTML.slice();

        a.innerHTML = "";
        a.appendChild(document.createTextNode(bHolder));
        
        b.innerHTML = "";
        b.appendChild(document.createTextNode(aHolder));
    }

    registerListSelectHandlers(id) {
        // Adds CSS for Highlighting
        let style_item = document.getElementById("style-list-" + id);
        if(style_item == null){
            let css = "#top5-list-" + id + ":hover{background:black; color:white;}";
            var style = document.createElement("style");
            style.setAttribute("id", "style-list-" + id);
            if(style.styleSheet){
                style.styleSheet.cssText = css;
            }
            else{
                style.appendChild(document.createTextNode(css));
            }
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        // FOR SELECTING THE LIST
        document.getElementById("top5-list-" + id).onmousedown = (event) => {
            this.model.unselectAll();
            this.model.startListEditing();
            // GET THE SELECTED LIST
            this.model.loadList(id);

            this.model.updateStatus(id);
        }
        // FOR DELETING THE LIST
        document.getElementById("delete-list-" + id).onmousedown = (event) => {
            this.ignoreParentClick(event);
            // VERIFY THAT THE USER REALLY WANTS TO DELETE THE LIST
            let modal = document.getElementById("delete-modal");
            this.listToDeleteIndex = id;
            let listName = this.model.getList(this.model.getListIndex(id)).getName();
            let deleteSpan = document.getElementById("delete-list-span");
            deleteSpan.innerHTML = "";
            deleteSpan.appendChild(document.createTextNode(listName));
            modal.classList.add("is-visible");
            let confirmButton = document.getElementById("dialog-confirm-button");
            let cancelButton = document.getElementById("dialog-cancel-button");
            cancelButton.onmousedown = (event) => {
                deleteSpan.innerHTML = "";
                modal.classList.remove("is-visible");
            }
            confirmButton.onmousedown = (event) => {
                let a = document.getElementById("top5-list-"+id);
                if(a !== null && a.classList.contains("selected-list-card")){
                    this.model.closeList();
                    this.model.endListEditing();
                }
                this.model.removeList(id);
                modal.classList.remove("is-visible");
            }
        }

        let list_item = document.getElementById("top5-list-" + id)
        list_item.ondblclick = (ev) => {
            this.model.startEditing();
            // CLEAR TEXT
            list_item.innerHTML = "";

            // ADD TEXT FIELD
            let textInput = document.createElement("input");
            textInput.setAttribute("type", "text");
            textInput.setAttribute("id", "list-text-input-" + id);
            textInput.setAttribute("size", "12.5");
            list_item.appendChild(textInput);

            textInput.focus();
            textInput.value = this.model.getList(this.model.getListIndex(id)).getName();

            textInput.ondblclick = (event) => {
                this.ignoreParentClick(event);
            }
            textInput.onkeydown = (event) => {
                if (event.key === 'Enter') {
                    this.model.changeList(id, event.target.value);
                    this.model.endEditing();
                    this.model.updateStatus(id);
                }
            }
            textInput.onblur = (event) => {
                this.model.changeList(id, event.target.value);
                this.model.endEditing();
                this.model.loadList(id);
                this.model.updateStatus(id);
            }
        }
    }

    ignoreParentClick(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
    }
}
import { jsTPS_Transaction } from "../common/jsTPS";

export default class ChangeItem_Transaction extends jsTPS_Transaction {
    constructor(initStore, initIndex, initOldText, initNewText) {
        super();
        this.store = initStore;
        this.id = initIndex;
        this.oldText = initOldText;
        this.newText = initNewText;
    }

    doTransaction() {
        this.store.changeItem(this.id, this.newText);
    }
    
    undoTransaction() {
        this.store.changeItem(this.id, this.oldText);
    }
}
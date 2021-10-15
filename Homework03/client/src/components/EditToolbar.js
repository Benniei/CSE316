import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "top5-button";
    let disabledButtonClass = "top5-button-disabled"
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }

    let undo = store.status? store.status[0]: false;
    let redo = store.status? store.status[1]: false;
    let close = store.status? store.status[2]: false;

    return (
        <div id="edit-toolbar">
            {undo?
                <div
                    disabled={false}
                    id='undo-button'
                    onClick={handleUndo}
                    className={enabledButtonClass}>
                    &#x21B6;
                </div>:
                <div
                    disabled={true}
                    id='undo-button'
                    className={disabledButtonClass}>
                    &#x21B6;
                </div>
            }
            {redo?
                <div
                    disabled={false}
                    id='redo-button'
                    onClick={handleRedo}
                    className={enabledButtonClass}>
                    &#x21B7;
                </div>:
                <div
                    disabled={true}
                    id='redo-button'
                    className={disabledButtonClass}>
                    &#x21B7;
                </div>
            }  
            {close?
                <div
                    disabled={false}
                    id='close-button'
                    onClick={handleClose}
                    className={enabledButtonClass}>
                    &#x24E7;
                </div>:
                <div
                    disabled={true}
                    id='close-button'
                    className={disabledButtonClass}>
                    &#x24E7;
                </div>
            }
        </div>
    )
}

export default EditToolbar;
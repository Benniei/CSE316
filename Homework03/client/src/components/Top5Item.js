import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [draggedTo, setDraggedTo] = useState(0);
    const [ editActive, setEditActive ] = useState(false);
    const [ text, setText ] = useState("");

    function handleDragStart(event) {
        event.dataTransfer.setData("item", event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveItemTransaction(sourceId, targetId);
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        setText(props.text);
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if(newActive) {
            store.setIsItemEditActive();
        }
        setEditActive(newActive);
    }

    function handleUpdateText(event) {
        setText(event.target.value );
    }

    function handleKeyPress(event) {
        if(event.code === "Enter") {
            handleBlur(event);
            toggleEdit();
        }
    }

    function handleBlur(event) {
        store.addChangeItemTransaction(index, text);
        toggleEdit();
    }

    let { index } = props;
    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }
    let itemElement = <div
            id={'item-' + (index + 1)}
            className={itemClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >
        <input
            type="button"
            id={"edit-item-" + index + 1}
            className="list-card-button"
            onClick={handleToggleEdit}
            value={"\u270E"}
        />
        {props.text}
        </div>;
    if(editActive){
        itemElement = 
            <input
                id={"item-input-text-" + (index + 1)}
                type='text'
                className={itemClass}
                onBlur={handleBlur}
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={props.text}
                autoFocus
            />;
    }
    return (
        itemElement
    )
}

export default Top5Item;
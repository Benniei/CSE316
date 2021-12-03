import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';

/*
    This React component represents a single name in our
    Top 5 List, which can be edited or moved around.
*/

function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = store.currentList._id;
            if(text)
                store.changeListName(id, text);;
            toggleEdit();
        }
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsItemEditActive();
        }
        setEditActive(newActive);
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleonBlur(){
        let id = store.currentList._id;
        if(text)
            store.changeListName(id, text);;
        toggleEdit();
    }

    let itemClass = "top5-item-name";

    let cardElement = <ListItem
                id={'listname'}
                key={props.key}
                className={itemClass}
                sx={{ display: 'flex', p: 1 }}
                style={{
                    fontSize: '20pt',
                    width: '50%'
                }}
                onClick={handleToggleEdit}
            >
                {props.text}
            </ListItem>;

    if (editActive) {
        cardElement =
            <TextField
                required
                id={"item-name"}
                label="Item Name"
                name="name"
                autoComplete="Item Name"
                className={itemClass}
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={props.text}
                inputProps={{style: {fontSize: 19.5, fontWeight: 700}}}
                InputLabelProps={{style: {fontSize: 20}}}
                autoFocus
                size="small"
                onBlur={handleonBlur}
            />
    }

    return (
         cardElement   
    )
}

export default Top5Item;
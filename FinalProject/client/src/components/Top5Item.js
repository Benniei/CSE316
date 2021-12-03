import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
/*
    This React component represents a single item in our
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
            if(text)
                store.updateItem(index, text.trim());
            toggleEdit();
        }
    }

    function handleonBlur(){
        if(text)
            store.updateItem(index, text.trim());
        toggleEdit();
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

    let { index } = props;

    let itemClass = "top5-item";

    let cardElement = <ListItem
                id={'item-' + (index+1)}
                key={props.key}
                className={itemClass}
                sx={{ display: 'flex', p: 1}}
                style={{
                    fontSize: '48pt',
                    width: '100%',
                    height: '20%'
                }}
                onClick={handleToggleEdit}
            >
                <Box sx={{ p: 1, flexGrow: 1 }}>{props.text}</Box>
            </ListItem>;

    if (editActive) {
        cardElement =
            <TextField
                required
                fullWidth
                id={"item-" + (index + 1)}
                label="Item Name"
                name="name"
                autoComplete="Item Name"
                className={itemClass}
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={props.text}
                inputProps={{style: {fontSize: 55}}}
                InputLabelProps={{style: {fontSize: 24}}}
                size="small"
                autoFocus
                onBlur={handleonBlur}
            />
    }

    return (
         cardElement   
    )
}

export default Top5Item;
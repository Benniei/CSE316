import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
*/
function CommentCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { index, comm, user} = props;
    const [text, setText] = useState(""); // comment text

    let commentStyle = "comment-style"
    let cardElement =
        <ListItem
            id={"comment" + index}
            key={"comment" + index}
            sx={{ marginTop: '5px', display: 'flex', p: 1 }}
            style={{
                width: '100%',
                backgroundColor: '#d8ac22'
            }}
            className={commentStyle}
        >
            <Stack
                >
                <Typography
                    sx={{ml: 1}}
                    style={{color:"#0c2bff", fontSize:"10pt", fontWeight:550}}>
                        {user}
                </Typography>
                <Typography
                    sx={{ml: 1, mt: -1}}
                    style={{color:"#000000", fontSize:"13pt"}}>
                        {comm}
                </Typography>
            </Stack>
        </ListItem>

    return (
        cardElement
    );
}

export default CommentCard;
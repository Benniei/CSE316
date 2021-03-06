import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { Typography } from '@mui/material';
import AuthContext from '../auth'
import List from '@mui/material/List';
import CommentCard from './CommentCard.js'
import TextField from '@mui/material/TextField';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const { idNamePair} = props;
    const [text, setText] = useState(""); // comment text
    let expand = false;
    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    function handleLike(){
        let payload = {
            likes: auth.user.loginName
        }
        if(store.currentList){
            payload.expand = idNamePair._id
        }
        store.userResponse(idNamePair._id, payload);
    }

    function handleDislike(){
        let payload = {
            dislikes: auth.user.loginName
        }
        if(store.currentList){
            payload.expand = idNamePair._id
        }
        store.userResponse(idNamePair._id, payload);
    }

    function handleUnlike() {
        let payload = {
            unlike: auth.user.loginName
        }
        if(store.currentList){
            payload.expand = idNamePair._id
        }
        store.userResponse(idNamePair._id, payload);
    }

    function handleUndislike(){
        let payload = {
            undislike: auth.user.loginName
        }
        if(store.currentList){
            payload.expand = idNamePair._id
        }
        store.userResponse(idNamePair._id, payload);
    }

    function handleDown(){
        expand = true;
        
        let payload = {
            views: 1,
            expand: idNamePair._id
        }
        store.userResponse(idNamePair._id, payload);
    }

    function handleUp(){
        expand = false
        store.collapseList();
    }

    function handleComment(){
        if(text === ""){
            return;
        }
        let payload ={
            comments: {
                user: auth.user.loginName,
                text: text
            },
            expand: idNamePair._id
        }
        setText("");
        store.userResponse(idNamePair._id, payload);
    }

    function capital(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

    let d = new Date(idNamePair.publishedDate);
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
    let date = months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    if(store.currentList){
        if(store.currentList._id === idNamePair._id)
            expand = true
    }

    let thumbsUp = false;
    let thumbsDown = false;
    if(!auth.guest){
        if(idNamePair.likes.indexOf(auth.user.loginName) !== -1)
            thumbsUp = true
        if(idNamePair.dislikes.indexOf(auth.user.loginName) !== -1)
            thumbsDown = true;
    }

    let cardElement = null;
    let publishedClass = "list-published"
    let unpublishedClass = "list-notpublished"

    let leftSide = "expanded-list-left";

    if(idNamePair.published || idNamePair.community){
        cardElement = <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{
                width: '100%'
            }}
        >
            <Grid container spacing={2} className={publishedClass}>
                {store.homeState === 1?
                    <Grid item xs={8.8}>
                        <Stack 
                            direction="column"
                            >
                                <Box sx={{ p: 1, flexGrow: 1, pt: 0, pb: 0 }} style={{fontSize: 23, fontWeight:650}}>{idNamePair.name}</Box>
                                    <Box sx={{ pl: 1, flexGrow: 1, pt:1}} >By: 
                                        <Typography display="inline" style={{color:"#0c2bff"}}> {idNamePair.loginName}</Typography>
                                    </Box>
                        </Stack>
                    </Grid>
                    :
                    <Grid item xs={9.3}>
                        <Stack 
                            direction="column"
                            >
                                <Box sx={{ p: 1, flexGrow: 1, pt: 0, pb: 0 }} style={{fontSize: 23, fontWeight:650}}>{capital(idNamePair.name)}</Box>
                                {(!idNamePair.community) ?
                                <Box sx={{ pl: 1, flexGrow: 1, pt:1}} >By: 
                                    <Typography display="inline" style={{color:"#0c2bff"}}> {idNamePair.loginName}</Typography>
                                </Box>
                                :null
                                }
                        </Stack>
                    </Grid>
                }
                <Grid item xs={2}>
                    <Stack direction="row">
                        {
                            thumbsUp?
                            <IconButton 
                                onClick={(event) => {
                                    handleUnlike();
                                }} 
                                disabled={auth.guest}
                                aria-label='like'
                                sx={{pt:0}}
                                style={{color:"#4da82f"}}>
                                <ThumbUpIcon style={{fontSize:'30pt'}} />
                            </IconButton>
                            :
                            <IconButton 
                                onClick={(event) => {
                                    handleLike();
                                }} 
                                disabled={auth.guest}
                                aria-label='like'
                                sx={{pt:0}}>
                                <ThumbUpOutlinedIcon style={{fontSize:'30pt'}} />
                            </IconButton>
                        }
                            <Typography sx={{pt:1}} style={{fontSize:'20pt'}}>{idNamePair.likes.length}</Typography>
                        {
                            thumbsDown?
                            <IconButton 
                                onClick={(event) => {
                                    handleUndislike();
                                }} 
                                disabled={auth.guest}
                                aria-label='dislike'
                                sx={{pt:0}}
                                style={{color:"#df2937"}}>
                                <ThumbDownIcon style={{fontSize:'30pt'}} />
                            </IconButton>
                            :
                            <IconButton 
                                onClick={(event) => {
                                    handleDislike();
                                }} 
                                disabled={auth.guest}
                                aria-label='dislike'
                                sx={{pt:0}}>
                                <ThumbDownOutlinedIcon style={{fontSize:'30pt'}} />
                            </IconButton>
                        }
                        <Typography sx={{pt:1}} style={{fontSize:'20pt'}}>{idNamePair.dislikes.length}</Typography>
                        {store.homeState === 1?
                            <IconButton onClick={(event) => {
                                handleDeleteList(event, idNamePair._id)
                            }} 
                            disabled={auth.guest}
                            aria-label='delete'
                            sx={{pt:0}}>
                                <DeleteIcon style={{fontSize:'35pt'}} />
                            </IconButton>
                            :
                            null
                        }
                    </Stack>
                </Grid>
                {
                    expand?
                    <Grid item xs={5.5} sx={{height: 325, ml:2}} className={leftSide}
                        style={{backgroundColor: "#2b3172"}}>
                        <Stack 
                            direction="column"
                            spacing={1}
                            sx={{pl: 1}}
                            >
                            {
                                store.currentList.items.map((pair, index) => (
                                    <Stack direction="column" spacing={0}>
                                        {
                                            !store.currentList.community?
                                            <Typography 
                                                style={{fontSize:"23pt", color:"#daad22"}}
                                                sx={{m: 0, p: 0}}
                                                >
                                                {index + 1}. {pair}
                                            </Typography>
                                            :
                                            <Typography 
                                                style={{fontSize:"23pt", color:"#daad22"}}
                                                sx={{m: 0, p: 0}}
                                                >
                                                {index + 1}. {capital(pair)}
                                            </Typography>
                                        }
                                        {store.currentList.community?
                                            <Typography
                                                sx={{mt: -2, ml: 4}}
                                                style={{color:"#daad22", fontSize:"10pt", fontStyle: 'italic'}}>
                                                ({store.currentList.itemSort[index].score} votes)
                                            </Typography>
                                            :
                                            null
                                        }
                                    </Stack>
                                ))
                            }
                        </Stack>
                    </Grid>
                    :
                    null
                }

                {
                    expand?
                    <Grid item xs={6} sx={{height: 300, ml:1, pt:0, pl:0}} style={{padding: 0}}>
                        <List sx={{pl:0, pt:0, height: '95%', overflow:'auto'}}>
                            {
                                store.currentList.comments.map((pair,index) => (
                                    <CommentCard
                                        key={index}
                                        index={index}
                                        comm={pair.text}
                                        user={pair.user}
                                    />
                                ))
                            }
                        </List>
                    {(!auth.guest)?
                        <TextField   
                                id="comment"
                                label="Comment"
                                name="comment"
                                autoComplete="Comment"
                                size="small"
                                fullWidth
                                onChange={handleUpdateText}
                                value={text}
                                sx={{backgroundColor:"#FFFFFF"}}
                                onKeyPress={(event) => {
                                    if (event.key === 'Enter'){
                                        handleComment(event);
                                    }
                                }}
                            />
                        :
                        <TextField   
                                id="comment"
                                label="Please Log In to Comment"
                                name="comment"
                                autoComplete="Comment"
                                size="small"
                                fullWidth
                                onChange={handleUpdateText}
                                value={text}
                                sx={{backgroundColor:"#BEBEBE"}}
                                disabled
                            />
                    }
                    </Grid>
                    :
                    null
                }
                <Grid item xs={8.8} sx={{pt:0}}>
                    <Box sx={{ pl: 1, pt: 0, flexGrow: 1}} >
                        {!idNamePair.community?
                            <Typography display="inline" style={{fontSize:14, fontWeight:550}}>Published:</Typography>
                            :
                            <Typography display="inline" style={{fontSize:14, fontWeight:550}}>Updated:</Typography>
                        }
                        <Typography display="inline" style={{color:"#5eb65c", fontSize:14}}> {date.toString()}</Typography>
                    </Box>
                    
                </Grid>
                <Grid item xs={2.2}>
                <Box sx={{ pl: 1, pt: 0, flexGrow: 1}} >
                        <Typography display="inline" style={{fontSize:14, fontWeight:550}}>Views:</Typography>
                        <Typography display="inline" style={{color:"#be263b", fontSize:14}}> {idNamePair.views}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={1} style={{padding: 0, paddingTop: 0}}>
                    {expand?
                        <IconButton 
                            onClick={(event) => {
                                handleUp();
                            }} 
                            aria-label='down'
                            sx={{pt:0}}
                            >
                                <ArrowDropUpOutlinedIcon style={{fontSize:'30pt'}} />
                        </IconButton>
                        :
                        <IconButton 
                            onClick={(event) => {   
                                handleDown();
                            }} 
                            aria-label='up'
                            sx={{pt:0}}
                            >
                                <ArrowDropDownOutlinedIcon style={{fontSize:'30pt'}} />
                        </IconButton>
                    }
                </Grid>
            </Grid>
        </ListItem>
    }
    else{
        cardElement = <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{
                width: '100%'
            }}
        >
            <Grid container spacing={2} className={unpublishedClass}>
                <Grid item xs={10.7}>
                    <Stack 
                        direction="column"
                        >
                            <Box sx={{ p: 1, flexGrow: 1, pt: 0, pb: 0 }} style={{fontSize: 23, fontWeight:650}}>{idNamePair.name}</Box>
                            <Box sx={{ pl: 1, flexGrow: 1, pt:1}} >By: 
                                <Typography display="inline" style={{color:"#0c2bff"}}> {idNamePair.loginName}</Typography>
                            </Box>
                    </Stack>
                </Grid>
                <Grid item xs={1.3}>
                    <Stack direction="row">
                        <IconButton onClick={(event) => {
                            handleDeleteList(event, idNamePair._id)
                        }} 
                        disabled={auth.guest}
                        aria-label='delete'
                        sx={{pt:0}}>
                            <DeleteIcon style={{fontSize:'35pt'}} />
                        </IconButton>
                    </Stack>
                </Grid>
                {expand?
                        <Grid item xs={11.5} sx={{height: 325, ml:2}} className={leftSide}
                        style={{backgroundColor: "#2b3172"}}>
                            <Stack 
                                direction="column"
                                spacing={1}
                                sx={{pl: 1}}
                                >
                                {
                                    store.currentList.items.map((pair, index) => (
                                        <Stack direction="column" spacing={0}>
                                            <Typography 
                                                style={{fontSize:"23pt", color:"#daad22"}}
                                                sx={{m: 0, p: 0}}
                                                >
                                                {index + 1}. {pair}
                                            </Typography>
                                            {store.currentList.community?
                                                <Typography
                                                    sx={{mt: -2, ml: 4}}
                                                    style={{color:"#daad22", fontSize:"10pt", fontStyle: 'italic'}}>
                                                    ({store.currentList.itemSort[index].score} votes)
                                                </Typography>
                                                :
                                                null
                                            }
                                        </Stack>
                                    ))
                                }
                            </Stack>
                        </Grid>
                        :
                        null
                    }
                <Grid item xs={11} sx={{pt:0}}>
                    <Box 
                        sx={{ pl: 1, pt: 0, flexGrow: 1}} 
                        disabled={auth.guest}
                        onClick={(event) => {
                            handleLoadList(event, idNamePair._id);
                        }} >
                        <Typography 
                            
                            style={{color:"#ff1939", fontSize:14, fontWeight:550}}> 
                            Edit
                        </Typography>
                    </Box> 
                </Grid>
                <Grid item xs={1} style={{padding: 0, paddingTop: 0}}>
                    {expand?
                        <IconButton 
                            onClick={(event) => {
                                handleUp();
                            }} 
                            aria-label='down'
                            sx={{pt:0}}
                            >
                                <ArrowDropUpOutlinedIcon style={{fontSize:'30pt'}} />
                        </IconButton>
                        :
                        <IconButton 
                            onClick={(event) => {
                                store.expandCurrentList(idNamePair._id);
                            }}
                            aria-label='up'
                            sx={{pt:0}}
                            >
                                <ArrowDropDownOutlinedIcon style={{fontSize:'30pt'}} />
                        </IconButton>
                    }
                </Grid>
            </Grid>
        </ListItem>
    }
    return (
        cardElement
    );
}

export default ListCard;
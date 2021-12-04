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
    const [expand, setExpand] = useState(false);

    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    function handleLike(){
        let payload = {
            likes: auth.user.loginName
        }
        store.userResponse(idNamePair._id, payload);
    }

    function handleDislike(){
        let payload = {
            dislikes: auth.user.loginName
        }
        store.userResponse(idNamePair._id, payload);
    }

    function handleUnlike() {
        let payload = {
            unlike: auth.user.loginName
        }
        store.userResponse(idNamePair._id, payload);
    }

    function handleUndislike(){
        let payload = {
            undislike: auth.user.loginName
        }
        store.userResponse(idNamePair._id, payload);
    }

    function handleDown(){
        setExpand(true);
        let payload = {
            views: 1
        }
        store.userResponse(idNamePair._id, payload);
    }

    function handleUp(){
        setExpand(false);
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
            setExpand(true);
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
    let rightSide = "expanded-list-right";

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
                                <Box sx={{ p: 1, flexGrow: 1, pt: 0, pb: 0 }} style={{fontSize: 23, fontWeight:650}}>{idNamePair.name}</Box>
                                <Box sx={{ pl: 1, flexGrow: 1, pt:1}} >By: 
                                    <Typography display="inline" style={{color:"#0c2bff"}}> {idNamePair.loginName}</Typography>
                                </Box>
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
                    <Grid item xs={5} sx={{height: 300, ml:2}} className={leftSide}>
                        <Stack 
                            direction="column"
                            spacing={2}
                            sx={{pt: 2, pl: 3}}
                            >
                            <Typography>1. {idNamePair.items[0]}</Typography>
                            <Typography>2. {idNamePair.items[1]}</Typography>
                            <Typography>3. {idNamePair.items[2]}</Typography>
                            <Typography>4. {idNamePair.items[3]}</Typography>
                            <Typography>5. {idNamePair.items[4]}</Typography>
                        </Stack>
                        
                    </Grid>
                    :
                    null
                }
                {
                    expand?
                    <Grid item xs={5.5} sx={{height: 300, ml:1}} className={rightSide}>
                        <Typography>Exapandeders</Typography>
                    </Grid>
                    :
                    null
                }
                <Grid item xs={8.8} sx={{pt:0}}>
                    <Box sx={{ pl: 1, pt: 0, flexGrow: 1}} >
                        <Typography display="inline" style={{fontSize:14, fontWeight:550}}>Published:</Typography>
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
            </Grid>
        </ListItem>
    }
    return (
        cardElement
    );
}

export default ListCard;

/*
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
                setExpand(true);
            }} 
            aria-label='up'
            sx={{pt:0}}
            >
                <ArrowDropDownOutlinedIcon style={{fontSize:'30pt'}} />
        </IconButton>
    }
</Grid>
*/
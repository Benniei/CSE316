import * as React from 'react';
import { useContext } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import { GlobalStoreContext } from '../store'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function DeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    let flag = false;
    if(store.listMarkedForDeletion){
        flag = true;
    }
    let name = "";
    if(store.listMarkedForDeletion){
        name = store.listMarkedForDeletion.name;
    }

    function closeModal(){
        store.unmarkListForDeletion();
        flag = false;
    }


    return(
        <Modal
            open={flag}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Stack 
                    direction = "row"
                    alignItems = "center"
                    justifyContent = "center"
                >
                <Typography 
                    variant="h5"
                >Delete the {name} Top 5 List?</Typography>
                </Stack>
                <Stack direction = "row" spacing={2}>
                    <Button
                    type="submit"
                    fullWidth
                    onClick={closeModal}
                    variant="contained"
                    >
                    Cancel
                    </Button>
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    >
                    Confirm
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {ChangeEvent, useState} from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { gql,useMutation } from '@apollo/client';
import { useSession } from 'next-auth/react';

const EDIT_NAMETAG = gql`mutation Mutation($title: String,$id: ID!) {
    updateNameTag(title: $title, _id: $id)
  }`
const GET_TAGS = gql`query Query($username: String!) {
    getNameTags(username: $username) {
      access
      email
      nameTag {
        title
        banner
        _id
      }
    }
  }`
  
const theme = createTheme({
  palette: {
    secondary: {
      main: '#212121',
    },
  },
});

function CreateNameTag({handleClose,name,tagID}:{ handleClose: () => void , name:string,tagID:string}){
    const { data: session } = useSession()
    const [updateNameTag] = useMutation(EDIT_NAMETAG, {
        refetchQueries: [{ query: GET_TAGS, variables: { username: session?.user?.email } }],
      });
    const [tagName, setTagName] = useState<String | undefined>(name);
    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTagName(e.target.value);
    };

    return(<>
      <p style={{ fontFamily: "Sans-serif", fontSize: "20px" }}>Edit Name Tag</p>
      <Stack flexWrap="wrap" direction="row-reverse" row-reverse>
      <TextField onChange={handleFormChange} value={tagName} fullWidth id="outlined-basic" margin="normal" label="Name" variant="outlined"/>
      <ThemeProvider theme={theme}>
      <Button variant="contained" size='medium' color='secondary' sx={{marginTop:"10px"}} onClick={()=>{
        updateNameTag({ variables: {title: tagName ,id: tagID} })
        handleClose()
        }}>Save</Button>
      <Button variant="outlined" size='medium' color='secondary' sx={{marginTop:"10px",marginRight:"10px"}} onClick={()=>{handleClose()}}>Back</Button>
        </ThemeProvider>
      </Stack>
    </>)

}
export default CreateNameTag;
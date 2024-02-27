import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {ChangeEvent, useState} from 'react'
import { gql, useMutation } from '@apollo/client';
import { useSession } from "next-auth/react"
import { createTheme, ThemeProvider } from '@mui/material/styles';

const CREATENAMETAG = gql`mutation Mutation($email: String!, $title: String!) {
  createNameTag(email: $email, title: $title)
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

function CreateNameTag({handleClose}:{ handleClose: () => void }){
    const { data: session } = useSession()
    const [createNameTag] = useMutation(CREATENAMETAG, {
        refetchQueries: [{ query: GET_TAGS, variables: { username: session?.user?.email } }],
      });
    const [tagName, setTagName] = useState<String | undefined>();
      const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTagName(e.target.value);
      };

    return(<>
      <p style={{ fontFamily: "Sans-serif", fontSize: "20px" }}>Create Name Tag</p>
      <Stack flexWrap="wrap" direction="row-reverse" row-reverse>
      <TextField onChange={handleFormChange} fullWidth id="outlined-basic" margin="normal" label="Name" variant="outlined"/>

      <ThemeProvider theme={theme}>
      <Button variant="contained" size='medium' color='secondary' sx={{marginTop:"10px"}} onClick={()=>{
        createNameTag({ variables: {title: tagName ,email: session?.user?.email} })
        handleClose()
        }}>Create</Button>
      <Button variant="outlined" size='medium' color='secondary' sx={{marginTop:"10px",marginRight:"10px"}} onClick={()=>{handleClose()}}>Back</Button>
        </ThemeProvider>
      </Stack>
    </>)

}
export default CreateNameTag;
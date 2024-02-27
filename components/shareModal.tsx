import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LinkIcon from '@mui/icons-material/Link';
import Collaborator from './Collaborator';
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { debounce } from 'lodash';
import { Autocomplete } from '@mui/material';
import { useRouter,usePathname } from 'next/navigation'
import ShareSkeleton from './shareSkeleton'

const getNameTag = gql`query Query($getNameTagId: String!) {
    getNameTag(id: $getNameTagId) {
      title
      collaborators {
        _id
        access
        user {
          email
          name
          profile_image
        }
      }
    }
  }`
const SEARCH_PEOPLE = gql`query Query($username: String!) {
    getUsers(username: $username) {
      _id
      email
      name
      profile_image
    }
  }`
const SHARE_TAG = gql`mutation Mutation($email: ID!, $nameTagId: ID!, $access: String!) {
    createCollaborator(email: $email, nameTagId: $nameTagId, access: $access)
  }` 
  
export default function ShareModal({ groupName, handleClose }: { groupName: any, handleClose: () => void }) {
    const [userInput, setUserInput] = useState('');
    const pid = usePathname()
    const [getUsersQuery, { data: getUsers }] = useLazyQuery(SEARCH_PEOPLE);
    const [createCollaborator] = useMutation(SHARE_TAG,{refetchQueries: [{ query: getNameTag, variables: { getNameTagId: groupName } }] })
    const { loading,data } = useQuery<any>(getNameTag, {variables: { getNameTagId: groupName } })
    const handleSearch = debounce((searchQuery: any) => {getUsersQuery({ variables: { username: searchQuery } })}, 1500);
    const [value, setValue] = useState<string>("");

    const handleChange = (event: string) => {
        setUserInput(event);
        handleSearch(event)
    };
    function isEmail(email: string) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
      }
      async function shareTag(){
        createCollaborator({variables:{email:userInput,nameTagId:pid,access:"editor"}})
        const res = await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: userInput,name:data.getNameTag.title,id:pid})
        });
        setUserInput("")
    } 
     const CloseOrShare = () =>{
        if(!isEmail(userInput)){
            return <Button onClick={handleClose} variant="contained" size="medium" sx={{ borderRadius: "20px" }}>Done</Button>
        }
        return <Button onClick={shareTag} variant="contained" size="medium" sx={{ borderRadius: "20px" }}>Add</Button>
    }
    if(loading) return <ShareSkeleton/>
    return(
        <>
            <p style={{ fontFamily: "Sans-serif", fontSize: "25px", marginBottom: "20px", fontWeight: "lighter" }}>Share &apos;{data.getNameTag.title}&apos;</p>
            <Stack spacing={{ xs: 1 }} direction="column" useFlexGap flexWrap="wrap">
                <Autocomplete
                fullWidth
                value={value}
                inputValue={userInput}
                disablePortal
                id="combo-box-demo"
                onChange={(event: any, newValue: string) => {
                    setValue(newValue)
                }}
                onInputChange={(event, newInputValue) => {
                    handleChange(newInputValue)
                  }}
                options={getUsers?.getUsers || []}
                getOptionLabel={(option:any) => option.email||""}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} label="User" />}
                />
                <p style={{ fontFamily: "Sans-serif", fontSize: "18px", marginTop: "10px" }}>People with access</p>
                <Stack direction="column">
                    {data?.getNameTag.collaborators.map((collaborator: any) => (
                        <Collaborator key={collaborator._id} name={collaborator.user.name} email={collaborator.user.email} access={collaborator.access} />
                    ))}
                </Stack>
            </Stack>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <Button variant="outlined" startIcon={<LinkIcon />} sx={{ borderRadius: "20px" }}>Copy Link</Button>
                <CloseOrShare/>
            </div>
        </>
    )
}
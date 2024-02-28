import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LinkIcon from '@mui/icons-material/Link';
import Collaborator from './Collaborator';
import { gql, useMutation } from '@apollo/client';
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { useState } from 'react';
import ShareSkeleton from './shareSkeleton'

const getNameTag = gql`query Query($getNameTagId: String!) {
    getNameTag(id: $getNameTagId) {
      title
      collaborators {
        _id
        email
        access
      }
    }
  }`

const SHARE_TAG = gql`mutation Mutation($email: ID!, $nameTagId: ID!, $access: String!) {
    createCollaborator(email: $email, nameTagId: $nameTagId, access: $access)
  }`

export default function ShareModal({ groupName, handleClose }) {
  const [userInput, setUserInput] = useState('');
  const { loading, data, error } = useQuery(getNameTag, { variables: { getNameTagId: groupName } })
  const [createCollaborator] = useMutation(SHARE_TAG, { refetchQueries: [{ query: getNameTag, variables: { getNameTagId: groupName } }] })

  const isEmail = () => {
    const re = /\S+@\S+\.\S+/;
    return re.test(userInput);
  }
  const shareTag = async () => {
    createCollaborator({ variables: { email: userInput, nameTagId: groupName, access: "editor" } })
    setUserInput("")
  }


const CloseOrShare = () => {
    if (isEmail()) {
      return <Button onClick={() =>shareTag()} variant="contained" size="medium" sx={{ borderRadius: "20px" }}>Add</Button>
    }
    return <Button onClick={() => handleClose(false)} variant="contained" size="medium" sx={{ borderRadius: "20px" }}>Done</Button>
  }
  if (loading) return <ShareSkeleton />
  return (
    <>
      <p style={{ fontFamily: "Sans-serif", fontSize: "25px", marginBottom: "20px", fontWeight: "lighter" }}>Share {data?.getNameTag.title}</p>
      <Stack spacing={{ xs: 1 }} direction="column" useFlexGap flexWrap="wrap">
        <TextField value={userInput} onChange={(e) => setUserInput(e.target.value)} id="outlined-basic" label="Enter Email" variant="outlined" />
        <p style={{ fontFamily: "Sans-serif", fontSize: "18px", marginTop: "10px" }}>People with access</p>
        <Stack direction="column">
          {data?.getNameTag?.collaborators.map((collaborator) => (
            <Collaborator key={collaborator._id} id={collaborator._id} email={collaborator.email} access={collaborator.access} />
          ))}
        </Stack>
      </Stack>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <Button variant="outlined" startIcon={<LinkIcon />} sx={{ borderRadius: "20px" }}>Copy Link</Button>
        <CloseOrShare />
      </div>
    </>
  )
}
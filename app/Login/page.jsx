'use client'
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { signIn } from "next-auth/react"

export default function Login(){
  return (
    <div className='loginPage'>
          <Button onClick={()=>signIn('google')} startIcon={<GoogleIcon/>} size="large" sx={{marginBottom:"10px", marginTop: '10px', width: '100%', borderRadius: "20px",borderColor:"black",
          color:"black",'&:hover': {color: 'gray', borderColor:"gray"} }} variant="outlined">Continue with Google</Button>
    </div>
  )
}

import { Stack } from "@mui/material"
import Skeleton from '@mui/material/Skeleton';

function LoadingTag(){
return(    
    <Stack 
    direction="row" 
    gap={5}
    justifyContent="center"
    alignItems="center"
    flexWrap={"wrap"}
    >
    <Skeleton
      sx={{borderRadius:"20px"}}
      animation="wave"
      variant="rounded"
      width={350}
      height={150}
    />
    <Skeleton
      sx={{borderRadius:"20px"}}
      animation="wave"
      variant="rounded"
      width={350}
      height={150}
    />
    <Skeleton
      sx={{borderRadius:"20px"}}
      animation="wave"
      variant="rounded"
      width={350}
      height={150}
    />
    <Skeleton
      sx={{borderRadius:"20px"}}
      animation="wave"
      variant="rounded"
      width={350}
      height={150}
    />
    <Skeleton
      sx={{borderRadius:"20px"}}
      animation="wave"
      variant="rounded"
      width={350}
      height={150}
    />
    </Stack>)
}
export default LoadingTag
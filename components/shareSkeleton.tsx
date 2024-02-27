import { Box, Skeleton, Stack } from "@mui/material";

export default function ShareSkeleton(){
    return(    
        <Box>
          <Skeleton width={200}/>
          <Skeleton height={80} />
          <Skeleton width={170}/>
          <Stack direction={"row"} justifyContent="space-between" spacing={2} sx={{ paddingTop: 2}}>
            <Stack direction={"row"} spacing={2}>
            <Skeleton width={40} height={40} variant="circular"/>
            <Stack>
            <Skeleton width={80}/>
            <Skeleton width={180}/>
            </Stack>
            </Stack>
            <Skeleton width={80} height={20}/>
          </Stack>
          <Stack direction={"row"} justifyContent="space-between" spacing={2} sx={{ paddingTop: 2}}>
            <Stack direction={"row"} spacing={2}>
            <Skeleton width={40} height={40} variant="circular"/>
            <Stack>
            <Skeleton width={80}/>
            <Skeleton width={180}/>
            </Stack>
            </Stack>
            <Skeleton width={80} height={20}/>
          </Stack>
          <Stack direction={"row"} sx={{ paddingTop: 2}} justifyContent="space-between">
          <Skeleton width={100} height={40} sx={{borderRadius:4}}/>
          <Skeleton width={80} height={40} sx={{borderRadius:4}}/>
          </Stack>
        </Box>)
}
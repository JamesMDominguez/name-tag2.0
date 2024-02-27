import { Skeleton, Stack } from "@mui/material";

export default function NameTagSkeleton(){
    return(<Stack direction="column" justifyContent="center" alignItems="center">
    <Skeleton variant="rounded" width={1000} height={300} />
    <Stack direction="row" flexWrap="wrap" gap={4} sx={{paddingTop:"20px"}}>
    <Stack direction="column">
    <Skeleton variant="circular" width={150} height={150} />
    <Skeleton width={150} height={30} />
    </Stack>
    <Stack direction="column">
    <Skeleton variant="circular" width={150} height={150} />
    <Skeleton width={150} height={30} />
    </Stack>
    <Stack direction="column">
    <Skeleton variant="circular" width={150} height={150} />
    <Skeleton width={150} height={30} />
    </Stack>
    <Stack direction="column">
    <Skeleton variant="circular" width={150} height={150} />
    <Skeleton width={150} height={30} />
    </Stack>
    <Stack direction="column">
    <Skeleton variant="circular" width={150} height={150} />
    <Skeleton width={150} height={30} />
    </Stack>
    </Stack>
    </Stack>)
}
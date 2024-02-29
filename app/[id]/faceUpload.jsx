import IconButton from '@mui/material/IconButton';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { Modal, Stack, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import DownloadIcon from '@mui/icons-material/Download';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Button from '@mui/material/Button';
import ReactCrop from 'react-image-crop'
import { canvasPreview } from '../../components/canvasPreview'
import { useDebounceEffect } from '../../components/useDebounceEffect'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CropIcon from '@mui/icons-material/Crop';
import 'react-image-crop/dist/ReactCrop.css'
import { gql, useMutation } from '@apollo/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FilesetResolver, ImageSegmenter } from '@mediapipe/tasks-vision';
import { styled } from '@mui/material/styles';
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { useSession } from "next-auth/react"

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: "5px",
  padding: "25px",
  paddingTop: "35px"
};
const CREATEFACE = gql`mutation Mutation($nameTagId: ID!, $image: String!) {
  createFace(nameTagId: $nameTagId, image: $image)
}`
const getNameTag = gql`query Query($getNameTagId: String!) {
  getNameTag(id: $getNameTagId) {
    title
    banner
    faces {
      image
      name
    }
  }
}`

const GET_NAMETAG_FACES = gql`query Query($getNameTagId: String!) {
  getNameTag(id: $getNameTagId) {
    faces {
      image
      name
    }
  }
}`

const GETNAMETAGS = gql`query Query($username: String!) {
  getNameTags(username: $username) {
    nameTag {
      _id
      title
    }
  }
}`

const theme = createTheme({
  palette: {
    primary: {
      main: '#191919',
      contrastText: '#fff',
    },
  },
});

export default function Plus({ pid }) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(undefined);
  const [cropActive, setCropActive] = useState(false)
  const [selectingFace, setSelectingFace] = useState('')
  const [image, setImage] = useState(false);
  const [currentTab, setCurrentTab] = useState('');
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const { data: session } = useSession()

  const { data } = useQuery(GETNAMETAGS, {
    variables: { username: session?.user?.email }
  });
  const { data: queryData,refetch } = useQuery(GET_NAMETAG_FACES,{variables: { getNameTagId: "" }});

  const [createFace] = useMutation(CREATEFACE, {
    refetchQueries: [{ query: getNameTag, variables: { getNameTagId: pid } }],
  });
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const handleClose = () => {
    setOpen(false);
    setImagePreview(undefined);
    setCropActive(false);
    setImage(false);
  }

  const handleImage = (e) => {
    setCurrentTab("imageUpload")
    const file = e.target.files?.[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(true)
      setImagePreview(reader.result);
      setOpen(true)
    };
  }

  const setNewCrop = (src) => {
    setImagePreview(src)
    setCropActive(false)
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
        )
      }
    },
    100,
    [completedCrop],
  )

  function convertCanvasToBase64(canvas) {
    return canvas?.toDataURL();
  }

  useEffect(() => {
    if (image) {
      const processImage = async () => {
        const model = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm");
        const imageSegmenter = await ImageSegmenter.createFromOptions(model, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
            delegate: "GPU"
          },
          runningMode: "IMAGE",
          outputCategoryMask: true,
          outputConfidenceMasks: false
        });

        imageSegmenter.segment(imageRef.current, (mask) => {
          const maskNum = mask.categoryMask.getAsUint8Array();
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d', { willReadFrequently: true });
          canvas.width = mask.categoryMask.width;
          canvas.height = mask.categoryMask.height;
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(imageRef.current, 0, 0);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            if (maskNum[i / 4] === 255) {
              data[i + 3] = 0;
            }
          }
          context.putImageData(imageData, 0, 0);
          setImagePreview(convertCanvasToBase64(canvas));
        });
      };
      processImage();
    }
  }, [image]);

  function cropImage() {
    const canvas = previewCanvasRef.current;
    const base64 = canvas?.toDataURL();
    setNewCrop(base64);
  }

  async function uploadImage() {
    const parts = imagePreview.split(',');
    const base64Data = parts[1];
    createFace({ variables: { nameTagId: pid, image: base64Data } })
  }
  return (
    <>
      <IconButton color="default" aria-label="upload picture" onClick={() => setOpen(true)} component="label" sx={{ position: "fixed", bottom: 20, right: 20, backgroundColor: "#bdbdbd", padding: "20px", borderColor: "black" }}>
        <GroupAddIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {currentTab == "imageUpload" &&!cropActive && imagePreview && <img src={imagePreview} ref={imageRef} style={{ maxHeight: "450px", maxWidth: "650px", display: "block", margin: "0 auto", marginBottom: "20px" }} alt="Uploaded Image" />}
          {currentTab == "imageUpload" && cropActive &&
            <div style={{ textAlign: 'center' }}>
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imagePreview}
                  style={{ maxHeight: "450px", maxWidth: "650px", display: "block", margin: "0 auto", marginBottom: "20px" }}
                />
              </ReactCrop>
            </div>}

          {currentTab == "imageUpload" && cropActive &&
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <ThemeProvider theme={theme}>
                <Button variant="outlined" startIcon={<CancelIcon />} href="#contained-buttons" onClick={() => setCropActive(false)} sx={{ float: "right", borderRadius: "25px" }}>
                  Cancel Crop
                </Button>
                <Button variant="outlined" startIcon={<DoneIcon />} href="#contained-buttons" onClick={() => cropImage()} sx={{ float: "right", borderRadius: "25px" }}>
                  Set Crop
                </Button>
              </ThemeProvider>
            </Stack>
          }

          {currentTab == "imageUpload" && !cropActive && imagePreview &&
            <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Button variant="outlined" startIcon={<CancelIcon />} href="#contained-buttons" onClick={() => {setCurrentTab(""); setImagePreview(undefined); setImage(false);}} sx={{ borderRadius: "25px" }}>
                  Cancel
                </Button>
                <Button variant="outlined" onClick={() => setCropActive(true)} startIcon={<CropIcon />} color="primary" sx={{ width: "6rem", borderRadius: "25px" }}>
                  Crop
                </Button>
                <Button variant="outlined" startIcon={<DownloadIcon />} href="#contained-buttons" onClick={() => { uploadImage(); handleClose() }} sx={{ width: "7rem", borderRadius: "25px" }}>
                  Upload
                </Button>
            </Stack>}

          <Stack direction="column" justifyContent="space-between" spacing={2}>
            {currentTab == "" && <>
              <Button variant="outlined" startIcon={<PersonSearchIcon />} onClick={() => { setCurrentTab("selectTag") }} color="primary" sx={{ padding: "15px", borderRadius: "25px" }}>
                search existing face
              </Button>
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                onChange={handleImage}
                sx={{ padding: "15px", borderRadius: "25px" }}
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput type="file" />
              </Button>
            </>}

            {currentTab == "selectTag" && <>
              {data?.getNameTags.map((tag, index) => {
                return (
                  <Button key={index} variant="outlined" onClick={() => { setCurrentTab("selectFace"); refetch({ getNameTagId: tag.nameTag._id }); }} color="primary" sx={{ padding: "15px", borderRadius: "25px" }}>
                    {tag.nameTag.title}
                  </Button>
                )
              })}
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Button variant="outlined" startIcon={<CancelIcon />} href="#contained-buttons" onClick={() => { setCurrentTab("") }} sx={{ borderRadius: "25px" }}>
                  Cancel
                </Button>
                <Button variant="outlined" startIcon={<DoneIcon />} href="#contained-buttons" onClick={() => { setCurrentTab("") }} sx={{ borderRadius: "25px" }}>
                  Done
                </Button>
              </Stack>
            </>}


            {currentTab == "selectFace" && (
              <>
                <TextField id="outlined-basic" label="Name" variant="outlined" value={selectingFace} onChange={(e) => setSelectingFace(e.target.value)} />
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  {queryData?.getNameTag.faces.filter((face) => face.name.toLowerCase().includes(selectingFace.toLowerCase())).slice(0, 5).map((face, index) => {
                    return (<Button key={index} color={"inherit"} variant="outlined" onClick={() => { setCurrentTab("") }} sx={{ padding: "15px", borderRadius: "25px" }}>
                      {face.name}
                    </Button>)
                  }
                  )}
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Button variant="outlined" startIcon={<CancelIcon />} href="#contained-buttons" onClick={() => { setCurrentTab("selectTag") }} sx={{ borderRadius: "25px" }}>
                    Cancel
                  </Button>
                  <Button variant="outlined" startIcon={<DoneIcon />} href="#contained-buttons" onClick={() => { setCurrentTab("selectTag") }} sx={{ borderRadius: "25px" }}>
                    Done
                  </Button>
                </Stack>
              </>
            )}

          </Stack>
        </Box>
      </Modal>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <canvas ref={previewCanvasRef} style={{ display: "none" }} />
    </>
  );
}
import React, { useState, useEffect } from "react";
import { Button, Form, Modal, InputGroup, ProgressBar } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilesAPI from '../../../api/FilesApi';
import FileHeader from './AssignmentFileHeader';
import { useParams } from "react-router";

export default function CreateVideos({moduleId, getVideoInfo, openCreateVideoModal, setCreateVideoModal, setOpenCreateVideoModal}){

  const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
  const [fileName, setFileName] = useState('')
	const [sequenceNo, setSequenceNo] = useState('')
  const [title, setTitle] = useState('')
  const [base64String, setBase64String] = useState([]);
  const [extFilename, setExtFilename] = useState('');
  const [uploadStarted, setUploadStarted] = useState(false);
  const [uploading, setUploading] = useState(5);
  const [doneUpload, setDoneUpload] = useState(false);
  const {id} = useParams()
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    e.preventDefault()
    // setCreateVideoModal(false)
  }

	const saveVideo = async(e) => {
    e.preventDefault()
    setLoading(true)
    setUploadStarted(true);
    let counter = 10;
   if(!doneUpload){
    setInterval(() => {
      if (counter > 95) {
        counter = 95;
      }
      else {
        setUploading(doneUpload ? 100 : counter++);
      }
    }, 1000);
  }
    let response = await new CoursesAPI().createVideo(
      id, moduleId,
      {title, sequenceNo, fileName: fileName+extFilename, base64String}
    )
    if(response.ok){
      setDoneUpload(true)
      setTimeout(() => {
        setOpenCreateVideoModal(false)
        getVideoInfo(sessionCourse, sessionModule)
        notifySaveVideo()
        setUploadStarted(false);
      }, 1000);
    }else{
      toast.error(response.data.errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
    setLoading(false)
  }

  const getCourseUnitPages = async(e, data, data1) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnitPages(sessionCourse, sessionModule)
    setLoading(false)
    if(response.ok){
      setModulePages(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all pages")
    }
  }

  const notifySaveVideo = () => 
  toast.success('Video Saved!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const handleSelectedVideo = (video) => {
    console.log(video);
    if(video != ''){
      getBase64(video).then(
        data => {
          // let toAdd = {
          //   fileName: itm.name,
          //   base64String: data,
          //   size: itm.size,
          //   progress: 0,
          //   status: ''
          // };
          console.log(video.name);
          let extName = video.name.split('.').pop();
          setExtFilename(`.${extName}`);
          setBase64String(data);
        }
      );
    }
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

	useEffect(() => {
  }, [])

	return (
		<div>
			<Modal size="lg" className="modal-all" show={openCreateVideoModal} onHide={()=> setOpenCreateVideoModal(!openCreateVideoModal)} >
				<Modal.Header className="modal-header" closeButton>
				Create Video
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveVideo}>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Video Name
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter video name"
                      onChange={(e) => setTitle(e.target.value)}
                    />
								</Form.Group>

								<Form.Group className="m-b-20">
										<Form.Label for="description">
												File Name
										</Form.Label>
                    <InputGroup className="mb-4">
                      <Form.Control 
                        className="custom-input" 
                        size="lg" 
                        type="text" 
                        placeholder="Enter filename"
                        onChange={(e) => setFileName(e.target.value)}
                      />
                      <InputGroup.Text style={{width: 70}}>{extFilename}</InputGroup.Text>
                    </InputGroup>
								</Form.Group>
                <Form.Group className="m-b-20">
										<Form.Label for="description">
												Upload Video
										</Form.Label>
                    <Form.Control className='' accept="video/mp4,video/x-m4v,video/*" type='file' style={{ backgroundColor: 'inherit' }} onChange={(e) => handleSelectedVideo(e.target.files[0])} />
										{/* <Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter filename"
                      onChange={(e) => setFileName(e.target.value)}
                    /> */}
								</Form.Group>

								<Form.Group className="m-b-20">
										<Form.Label for="description">
												Sequence No
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter sequence number"
                      onChange={(e) => setSequenceNo(e.target.value)}
                    />
								</Form.Group>
                {
                  uploadStarted &&
                  <>
                    {
                      doneUpload ?
                      <ProgressBar variant="" now={'100'} label={`100% uploaded`}/>
                      :
                      <ProgressBar variant="" now={uploading} label={`Uploading ...`}/>
                    }
                  </>
                }
								<span style={{float:"right", marginTop: 15}}>
                  <Button disabled={uploadStarted} className="tficolorbg-button" type="submit">
                    Upload
                  </Button>
								</span>
						</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}
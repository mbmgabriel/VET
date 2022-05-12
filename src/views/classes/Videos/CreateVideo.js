import React, { useState, useEffect } from "react";
import { Button, Form, Modal, InputGroup } from 'react-bootstrap';
import ClassesAPI from "../../../api/ClassesAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router";

export default function CreateVideos({openCreateVideoModal, setCreateVideoModal, setVideoInfo, setOpenCreateVideoModal}){

  const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
  const [fileName, setFileName] = useState('')
	const [sequenceNo, setSequenceNo] = useState('')
  const [title, setTitle] = useState('')
  const [base64String, setBase64String] = useState([]);
  const [extFilename, setExtFilename] = useState('');

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
    let response = await new ClassesAPI().createVideo(
      sessionCourse, sessionModule,
      {title, sequenceNo, fileName: fileName+extFilename, base64String}
    )
    if(response.ok){
			handleCloseModal(e)
    //   getVideoInfo(sessionModule)
      notifySaveVideo()
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

  const getVideoInfo = async(e, data) => {
    setLoading(true)
    let response = await new ClassesAPI().getVideoInformation(sessionModule)
    setLoading(false)
    if(response.ok){
      setVideoInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all task")
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

								<span style={{float:"right"}}>
										<Button className="tficolorbg-button" type="submit">
												Save
										</Button>
								</span>
						</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}
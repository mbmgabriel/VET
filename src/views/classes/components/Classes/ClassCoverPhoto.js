import React, { useState, useEffect } from 'react'
import { Card, Dropdown, Row, Col, Tooltip, OverlayTrigger, Modal, Button } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import { toast } from 'react-toastify';

function ClassCoverPhoto({openCoverPhotoModal, setOpenCoverPhotoModal, classIdCoverPhoto, setClassIdCoverPhoto, getClasses}) {
  const [fileToUpload, setFileToUpload] = useState({});

  const handleSetFiles = (file) => {
    console.log(file);
    if(file != ''){
      getBase64(file).then(
        data => {
          let toAdd = {
            fileName: file.name,
            base64String: data,
          };
          setFileToUpload(toAdd);
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

  console.log('classIdCoverPhoto:', classIdCoverPhoto)

  const handleUploadCover = async() => {
    console.log('fileToUpload:', fileToUpload)
    // setUploadModal(false)
    let response = await new ClassesAPI().uploadCoverPhotoClass(classIdCoverPhoto, fileToUpload)
    if(response.ok){
      toast.success('Cover image uploaded successfully.');
      setOpenCoverPhotoModal(false)
      setClassIdCoverPhoto(null)
      getClasses()
      // getCourses()
    }else{
      // toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
      toast.error(response.data?.errorMessage)
      alert('123')
    }
  }

  return (
    <>
      <Modal size="lg" className="modal-all" show={openCoverPhotoModal} onHide={()=> setOpenCoverPhotoModal(false)} >
				<Modal.Header className="modal-header" closeButton>
          Upload Cover
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
            <Col>
              <input className='' accept="image/png, image/gif, image/jpeg" type='file' style={{ backgroundColor: 'inherit' }} onChange={(e) => handleSetFiles(e.target.files[0])} />
            </Col>
            <Col className='font-color' >
              File Extension .jpg, .jpeg, .tiff, .bmp, .png
            </Col>
            <Col className='font-color' >
              Image must 275x183
            </Col>
            <Button onClick={() => handleUploadCover()} className="m-r-5 color-white tficolorbg-button float-right" size="sm">UPLOAD</Button>
					</Modal.Body>
			</Modal>
    </>
  )
}

export default ClassCoverPhoto
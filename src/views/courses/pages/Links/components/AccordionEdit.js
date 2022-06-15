import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import CoursesAPI from '../../../../../api/CoursesAPI'
import { useParams } from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';


function AccordionEdit({openEditModal, setOpenEditModal, editLinks, getConfe, getVideos, getLinks}) {
  const [description, setEditDescription] = useState('')
  const [editNotufy, setEditNotify] = useState(false)
  const [url, setEditUrl] = useState('')
  const {id} = useParams();

  const handleCloseModal = (e) =>{
    e.preventDefault()
    setOpenEditModal(false)
  }

  const toggle =() =>{
    setOpenEditModal(false)
    setEditDescription(editLinks?.description)
    setEditUrl(editLinks?.url)
  }

  const closeNotify = () =>{
    setEditNotify(false)
  }
  
  const saveEditClassLinks = async (e) =>{
    e.preventDefault()
    if(description === '' || url === ''){
      toast.error('Please fill out all fields !', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }else{
      let linkId = editLinks?.id
      let courseId = sessionStorage.getItem('courseid')
      let response = await new CoursesAPI().editClassLinks(id, linkId, {description, url})
      if(response.ok){
        // alert('Link Updated')
        successSave()
        handleCloseModal(e)
        getConfe()
        getVideos()
        getLinks()
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

    }
  }

  useEffect(() => {
    if(editLinks !== null) {
      setEditDescription(editLinks?.description)
      setEditUrl(editLinks?.url)
		}
  }, [editLinks])

  const successSave = () => {
    toast.success('Successfully Updated link!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  console.log('editLinks:', editLinks)
  
  return (
    <div>		
      <Modal size="lg" show={openEditModal} onHide={()=> toggle()} aria-labelledby="example-modal-sizes-title-lg">
    <Modal.Header className='class-modal-header' closeButton>
      <Modal.Title id="example-modal-sizes-title-lg" >
        Edit Links
      </Modal.Title>
    </Modal.Header>
      <Modal.Body>
          <Form onSubmit={saveEditClassLinks} >
            {/* <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
                <Form.Select disabled>
                  <option>-- Select Unit Here --</option>
                 </Form.Select>
              </Form.Group> */}
            <Form.Group className="mb-4">
              <Form.Label>Description</Form.Label>
            <Form.Control onChange={(e) => setEditDescription(e.target.value)} defaultValue={editLinks?.description} type="text" placeholder='Enter Description name here'/>
            </Form.Group>
             <Form.Group className="mb-4">
              <Form.Label >Url</Form.Label>
              <Form.Control onChange={(e) => setEditUrl(e.target.value)} defaultValue={editLinks?.url}  type="text" placeholder='Enter Url here'/>
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Control value={editLinks?.type}  type="text" disabled/>
            </Form.Group>
            <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Update Links</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      <SweetAlert 
          success
          show={editNotufy} 
          title="Done!" 
          onConfirm={closeNotify}>
        </SweetAlert>
    </div>
  )
}

export default AccordionEdit

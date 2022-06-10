import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
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
      let linkId = editLinks?.classLink?.id
      let response = await new ClassesAPI().editClassLinks(id, linkId, {description, url})
      if(response.ok){
        // alert('Link Updated')
        setEditNotify(true)
        handleCloseModal(e)
        getConfe()
        getVideos()
        getLinks()
        successSave()
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
      setEditDescription(editLinks?.classLink?.description)
      setEditUrl(editLinks?.classLink?.url)
		}
  }, [editLinks])

  console.log('editLinks:', editLinks)

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
  
  return (
    <div>		
      <Modal size="lg" show={openEditModal} onHide={()=> setOpenEditModal(!setOpenEditModal)} aria-labelledby="example-modal-sizes-title-lg">
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
            <Form.Control value={editLinks?.classLink?.type}  type="text" disabled/>
            </Form.Group>
            <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Update Links</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AccordionEdit

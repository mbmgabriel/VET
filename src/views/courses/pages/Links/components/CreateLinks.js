import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import SweetAlert from 'react-bootstrap-sweetalert';
import CoursesAPI from '../../../../../api/CoursesAPI'
import { Form, Button, } from 'react-bootstrap'
import { useParams } from 'react-router'
import { toast } from 'react-toastify';


function CreateLinks({modal, toggle, getConfe, getVideos, getLinks}) {
  const {id} = useParams();
  const [typeId, setTypeId] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [createNotify, setCreateNotify] = useState(false)

  const closeNotify = () => {
    setCreateNotify(false)
  }
  
  const addLinks = async (e) => {
    e.preventDefault()
    let cid = sessionStorage.getItem('courseid')
    let courseId = JSON.parse(cid);
    let type =  typeId
    let response = await new CoursesAPI().createLinks(courseId, typeId, {courseId, type, description, url})
      if(response.ok){
        // alert('Add')
        setCreateNotify(true)
        toggle(e)
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

  return (
    <div>
    	<Modal size="lg" show={modal} onHide={toggle} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Create Links
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addLinks}>
            <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
                <Form.Select disabled>
                  <option>-- Select Unit Here --</option>
                </Form.Select>
              </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Description</Form.Label>
				    <Form.Control onChange={(e) => setDescription(e.target.value)} type="text" placeholder='Enter Description name here'/>
            </Form.Group>
            <Form.Group className="mb-4">
          		<Form.Label >Url</Form.Label>
              <Form.Control onChange={(e) => setUrl(e.target.value)}  type="text" placeholder='Enter Url here'/>
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
              <Form.Select onChange={(e) => setTypeId(e.target.value)}>
                <option>-- Select Unit Here --</option>
                <option value='1'>Conferences</option>
                <option value='2'>Videos</option>
                <option value='3'>Links</option>
              </Form.Select>
            </Form.Group>
			      <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Save</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
        <SweetAlert 
          success
          show={createNotify} 
          title="Link Created!" 
          onConfirm={closeNotify}>
        </SweetAlert>
    </div>
    )
}
export default CreateLinks


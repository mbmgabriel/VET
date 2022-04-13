import React, { useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import ContentField from '../../../../components/content_field/ContentField';
import { toast } from 'react-toastify';

function EditTask({moduleName, setTaskName, taskName, setInstructions, instructions, taskId, modal, toggle, module, editTask, getTaskModule, moduleId, setModal}){
  const isShared = null
  const [editNotufy, setEditNotify] = useState(false)

  const closeNotify = () =>{
    setEditNotify(false)
  }

  const updateTask = async (e) =>{
    e.preventDefault()
    if(instructions === '' || instructions === '{{type=equation}}'){
      toast.error('Please input all the required fields.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }else{
      let id = taskId
      let response = await new ClassesAPI().updateTask(id, {taskName, instructions, isShared})
        if(response.ok){
          // alert('Task Updated')
          setEditNotify(true)
          getTaskModule(null, moduleId)
          setModal(false)
        }else{
          // alert(response.data.errorMessage)
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


  return (
    <div>
        <Modal  size="lg" show={modal} onHide={() => setModal(false)} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
             Edit Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={updateTask}>  
          <Form.Group className="mb-3">
          <Form.Label>Unit</Form.Label>
            <Form.Select disabled>
              <option>{moduleName} </option>
              {module.map(item => {
                  return(<option value={moduleName}>{moduleName} {item.id}</option>)
                })} 
            </Form.Select>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Task Name</Form.Label>
              <Form.Control placeholder='Enter Task name here' onChange={(e) => setTaskName(e.target.value)}  type="text" defaultValue={taskName}/>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label >Instruction</Form.Label>
                  <ContentField value={instructions} placeholder='Enter instruction here' onChange={value => setInstructions(value)} />
                  </Form.Group>
              <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Save</Button>
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

export default EditTask

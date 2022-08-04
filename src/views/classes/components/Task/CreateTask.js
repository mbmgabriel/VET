import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, Table, Tooltip, OverlayTrigger} from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import FilesAPI from '../../../../api/FilesApi';
import FileHeader from './TaskFileHeader';
import { useParams } from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';
import ContentField from '../../../../components/content_field/ContentField';
import { toast } from 'react-toastify';
import ClassCourseFileLibrary from '../ClassCourseFileLibrary';

function CreateTask({setModal, modal, toggle, module, getTaskModule, classId}) {
  const [moduleId, setModuleId] = useState('')
  const [taskName, setTaskName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [rate, setRate] = useState(100)
  const [addNotify, setAddNotity] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  const [breedCrumbsItemClass, setBreedCrumbsItemClass] = useState([])
  const subFolderDirectory = breedCrumbsItemClass?.map(item => { return `/${item.value}`}) //to get sub directory based on breedcrumbs
  const [displayType, setDisplayType] = useState('');
  const [showFilesFolders, setShowFilesFolders] = useState(false);
  const [courseId, setCourseId] = useState(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [sequenceNo, setSequenceNo] =  useState(null)
  const allowLate = true
  const {id} = useParams();

  const closeNotify = () =>{
    setAddNotity(false)
  }

  const handleCloseModal = () => {
    setModal(false)
    setModuleId('')
    setTaskName('') 
    setInstructions('')
    setRate(100)
  }

  const success = () => {
    toast.success('Successfully saved task!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  const saveTask = async (e) =>{
    e.preventDefault()
    setIsButtonDisabled(true)
    setTimeout(()=> setIsButtonDisabled(false), 1000)
    if(instructions === '' || instructions === '{{type=equation}}' || moduleId === '' || rate === '' || taskName === '' || sequenceNo === null ){
      toast.error('Please input all the required fields.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }else if(rate <= 0){
      toast.error('Rate must be greater than to 0.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else{
      let response = await new ClassesAPI().creatTask(moduleId, id, {task:{taskName, instructions, rate, sequenceNo}, taskAssignment:{allowLate}} )
      if(response.ok){
        setModuleId("")
        setTaskName("")
        setRate('')
        setInstructions("")
        getTaskModule(null, moduleId)
        toggle(e)
        success()
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
    	<Modal size="lg" show={modal} onHide={handleCloseModal} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Create Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={saveTask} >  
          <div className={showFiles ? 'mb-3' : 'd-none'}>
            <ClassCourseFileLibrary />
          </div>
          <div className='text-align-right'>
            <Button className='tficolorbg-button' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
          </div>
          <Form.Group className="mb-3">
          <Form.Label>Unit</Form.Label>
            <Form.Select onChange={(e) => setModuleId(e.target.value)}>
              <option value=''>-- Select Unit Here -- </option>
                {module.map(item => {
                  return(<option value={item.id}>{item.moduleName}</option>)
                })}
            </Form.Select>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Task Name</Form.Label>
              <Form.Control onChange={(e) => setTaskName(e.target.value)} type="text" placeholder='Enter Task name here'/>
                </Form.Group>
                <Form.Group className="mb-4">
                <Form.Label>Rate</Form.Label>
                  <Form.Control defaultValue={rate}  onChange={(e) => setRate(e.target.value)} type='number' placeholder='Enter Rate here'/>
                </Form.Group>
                <Form.Group className="m-b-20">
                  <Form.Label for="courseName">
                      Sequence no.
                  </Form.Label>
                  <Form.Control 
                    className="custom-input" 
                    size="lg" 
                    type="number" 
                    placeholder="Enter Sequence no."
                    // min="0"
                    // step="1" 
                    onChange={(e) => setSequenceNo(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label >Instruction</Form.Label>
                    <ContentField value={instructions}  placeholder='Enter instruction here'  onChange={value => setInstructions(value)} />
                  </Form.Group>
              <Form.Group className='right-btn'>
              <Button disabled={isButtonDisabled} className='tficolorbg-button' type='submit' >Save Task</Button>
            </Form.Group>
        </Form> 
        </Modal.Body>
      </Modal>
      <SweetAlert 
          success
          show={addNotify} 
          title="Done!" 
          onConfirm={closeNotify}>
        </SweetAlert>
    </div>
    )
}
export default CreateTask
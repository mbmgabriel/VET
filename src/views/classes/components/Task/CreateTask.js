import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import FilesAPI from '../../../../api/FilesApi';
import FileHeader from './TaskFileHeader';
import { useParams } from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';
import ContentField from '../../../../components/content_field/ContentField';
import { toast } from 'react-toastify';

function CreateTask({setModal, modal, toggle, module, getTaskModule, classId}) {
  const [moduleId, setModuleId] = useState('')
  const [taskName, setTaskName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [addNotify, setAddNotity] = useState(false);
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
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
  }

  useEffect(() => {
    handleGetClassFiles()
    console.log(module, '-----------')
  }, [])
  const handleGetClassFiles = async() => {
    // setLoading(true)
    let response = await new FilesAPI().getClassFiles(classId)
    // setLoading(false)
    if(response.ok){
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      alert("Something went wrong while fetching class files ;;.")
    }
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
    if(instructions === '' || instructions === '{{type=equation}}' || moduleId === ''){
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
      let response = await new ClassesAPI().creatTask(moduleId, id, {task:{taskName, instructions,}, taskAssignment:{allowLate}} )
      if(response.ok){
        setModuleId("")
        setTaskName("")
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
            <FileHeader type='Class' id={classId}  subFolder={''}  doneUpload={()=> handleGetClassFiles()} />
            {/* {
             (displayFiles || []).map( (item,ind) => {
                return(
                  <img src={item.pathBase.replace('http:', 'https:')} className='p-1' alt={item.fileName} height={30} width={30}/>
                )
              })
            } */}
             {
               (displayFiles || []).map( (item,ind) => {
                  return(
                    item.pathBase?.match(/.(jpg|jpeg|png|gif|pdf)$/i) ? 
                    <img key={ind+item.name} src={item.pathBase.replace('http:', 'https:')} className='p-1' alt={item.name} height={30} width={30}/>
                    :
                    <i className="fas fa-sticky-note" style={{paddingRight: 5}}/>
                  )
                })
              }
              {
                (displayFolder || []).map((itm) => {
                  return(
                    <i className='fas fa-folder-open' style={{height: 30, width: 30}}/>
                  )
                })
              }
          </div>
          <Form.Group className="mb-3">
          <Form.Label>Unit</Form.Label>
            <Form.Select onChange={(e) => setModuleId(e.target.value)}>
              <option value=''>-- Select Unit Here -- </option>
                {module.map(item => {
                  return(<option value={item.id}>{item.moduleName}</option>)
                })}
            </Form.Select>
            <div>
              <Button className='float-right my-2 tficolorbg-button' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
            </div>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Task Name</Form.Label>
              <Form.Control onChange={(e) => setTaskName(e.target.value)} type="text" placeholder='Enter Task name here'/>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label >Instruction</Form.Label>
                    <ContentField value={instructions}  placeholder='Enter instruction here'  onChange={value => setInstructions(value)} />
                  </Form.Group>
              <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Save Task</Button>
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
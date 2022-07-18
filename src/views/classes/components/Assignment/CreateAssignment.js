import React, {useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button,  Tooltip, OverlayTrigger, Table} from 'react-bootstrap'
import { useParams } from 'react-router'
import ClassesAPI from '../../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import FilesAPI from '../../../../api/FilesApi';
import FileHeader from '../Task/TaskFileHeader';
import ContentField from '../../../../components/content_field/ContentField'
import { toast } from 'react-toastify';
import ClassCourseFileLibrary from '../ClassCourseFileLibrary';

function CreateAssignment({modal, toggle, module, getAssignmentList, question, setQuestion}) {
  const [moduleId, setModuleId] = useState('')
  const [assignmentName, setAssignmentName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [rate, setRate] = useState('')
  const [addNotify, setAddNotity] = useState(false)
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([])
  const [breedCrumbsItemClass, setBreedCrumbsItemClass] = useState([])
  const subFolderDirectory = breedCrumbsItemClass?.map(item => { return `/${item.value}`}) //to get sub directory based on breedcrumbs
  const [displayType, setDisplayType] = useState('');
  const [showFilesFolders, setShowFilesFolders] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [courseId, setCourseId] = useState(null)
  const {id} = useParams();

  const closeNotify = () =>{
    setAddNotity(false)
  }
  const createAssignment = async (e) =>{
    e.preventDefault()
    setIsButtonDisabled(true)
    setTimeout(()=> setIsButtonDisabled(false), 1000)
    if(moduleId == '' || assignmentName === '' || instructions === '' || instructions === '{{type=equation}}' || rate === '' ){
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
      let response = await new ClassesAPI().createAssignment(moduleId, id, {assignment:{assignmentName, instructions, rate}, classAssignment:{}} )
      if(response.ok){
        success()
        setModuleId('')
        setAssignmentName('')
        setInstructions('')
        setRate('')
        // alert('Save Assingment')
        // setAddNotity(true)
        getAssignmentList(null, moduleId)
        toggle(e)
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

  const success = () => {
    toast.success('Successfully saved assignment!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  const renderTooltipSave = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Save
    </Tooltip>
  )

  const renderTooltipUpload = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Upload
    </Tooltip>
  )


	return (
    <div>
    	<Modal size="lg" show={modal} onHide={toggle} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Create Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={showFiles ? 'mb-3' : 'd-none'}>
            <ClassCourseFileLibrary />
          </div>
          <div className='text-align-right'>
            <Button className='tficolorbg-button' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
          </div>
          <Form onSubmit={createAssignment} > 
            <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
                <Form.Select onChange={(e) => setModuleId(e.target.value)}>
                  <option>-- Select Unit Here --</option>
                    {module.map(item => {
                      return (<option value={item?.id}>{item?.moduleName}</option>)
                    })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Assignment Name</Form.Label>
                  <Form.Control onChange={(e) => setAssignmentName(e.target.value)} type="text" placeholder='Enter Assignment Name here'/>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Rate</Form.Label>
                  <Form.Control  onChange={(e) => setRate(e.target.value)} type='number' placeholder='Enter Rate here'/>
                </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label >Instruction</Form.Label>
                  <ContentField  value={instructions} placeholder='Enter instruction here' onChange={value => setInstructions(value)} />
              </Form.Group>  
              <Form.Group className='right-btn'>
                  <Button disabled={isButtonDisabled} className='tficolorbg-button' type='submit' >Save Assignment</Button>
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
export default CreateAssignment


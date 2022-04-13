import React, {useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import { useParams } from 'react-router'
import ClassesAPI from '../../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import FilesAPI from '../../../../api/FilesApi';
import FileHeader from '../Task/TaskFileHeader';
import ContentField from '../../../../components/content_field/ContentField'

function CreateAssignment({modal, toggle, module, getAssignmentList, question, setQuestion}) {
  const [moduleId, setModuleId] = useState('')
  const [assignmentName, setAssignmentName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [addNotify, setAddNotity] = useState(false)
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([])
  const {id} = useParams();

  const closeNotify = () =>{
    setAddNotity(false)
  }
  const createAssignment = async (e) =>{
    e.preventDefault()
    let response = await new ClassesAPI().createAssignment(moduleId, id, {assignment:{assignmentName, instructions,}, classAssignment:{}} )
    if(response.ok){
      setModuleId('')
      setAssignmentName('')
      setInstructions('')
      // alert('Save Assingment')
      setAddNotity(true)
      getAssignmentList(null, moduleId)
      toggle(e)
    }else{
      alert(response.data.errorMessage)
    }
  }


  useEffect(() => {
    handleGetClassFiles()
  }, [])



  const handleGetClassFiles = async() => {
    // setLoading(true)
    let data = {
      "subFolderLocation": ''
    }
    let response = await new FilesAPI().getClassFiles(id, data)
    // setLoading(false)
    if(response.ok){
      console.log(response, 'heeeeeeeere')
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      alert("Something went wrong while fetching class files.")
    }
  } 

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
              <FileHeader type={'Class'}  title='Files' id={id} subFolder={''} doneUpload={()=> handleGetClassFiles()}/>
              {
                displayFiles.map( (item,ind) => {
                  return(
                    item.pathBase?.match(/.(jpg|jpeg|png|gif|pdf)$/i) ? 
                    <img key={ind+item.filename} src={item.pathBase.replace('http:', 'https:')} className='p-1' alt={item.name} height={30} width={30}/>
                    :
                    <i className="fas fa-sticky-note" style={{paddingRight: 5}}/>
                  )
                })
              }
              {
                displayFolder.map((itm) => {
                  return(
                    <i className='fas fa-folder-open' style={{height: 30, width: 30}}/>
                  )
                })
              }
            </div>
            <div className='text-align-right'>
              <Button className='my-2' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
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
                <Form.Label >Instruction</Form.Label>
                  <ContentField  value={instructions} onChange={value => setInstructions(value)} />
              </Form.Group>  
              <Form.Group className='right-btn'>
                <Button className='tficolorbg-button' type='submit' >Save</Button>
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


import React, { useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, Tooltip, OverlayTrigger} from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import ContentField from '../../../../components/content_field/ContentField';
import ContentViewer from '../../../../components/content_field/ContentViewer';
import FilesAPI from '../../../../api/FilesApi';
import FileHeader from '../Task/TaskFileHeader';
import { useParams } from 'react-router'
import { toast } from 'react-toastify';

function EditAssignment({setModal, modal, editAssignment, getAssignmentList, moduleId, instructions, setInstructions, setAssignmentName, assignmentName, unit, assignmentId}) {
  const [editNotufy, setEditNotify] = useState(false)
  const isShared = null
  const [qwert, setQwert] = useState(editAssignment?.assignment?.instructions)
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([])
  const {id} = useParams();
  let mId = moduleId


  const closeNotify = () =>{
    setEditNotify(false)
  }

  const updateTask = async (e) =>{
    e.preventDefault()
    let id = assignmentId
    let mId = moduleId
    let response = await new ClassesAPI().updateAssignment(id, {assignmentName, instructions, isShared})
      if(response.ok){
        // alert('Assingment Updated')
        // setEditNotify(true)
        getAssignmentList(null, mId)
        setModal(false)
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

  useEffect(() => {
    if(assignmentName !== '') {
      setAssignmentName(editAssignment?.assignment?.assignmentName)
      setInstructions(editAssignment?.assignment?.instructions)
		}
  }, [assignmentName])


  useEffect(() => {
    if(instructions !== '') {
      setAssignmentName(assignmentName)
      setInstructions(instructions)
		}
  }, [assignmentName])

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

  const renderTooltipUpload = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Upload
    </Tooltip>
  )

  const renderTooltipSave = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Save
    </Tooltip>
  )

  const success = () => {
    toast.success('Successfully updated assignment!', {
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
        <Modal  size="lg" show={modal} onHide={() => setModal(false)} aria-labelledby="example-modal-sizes-title-lg">
          <Modal.Header className='class-modal-header' closeButton>
            <Modal.Title id="example-modal-sizes-title-lg" >
              Edit Assignment
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className={showFiles ? 'mb-3' : 'd-none'}>
              <FileHeader type={'Class'}  title='Files' id={id} subFolder={''} doneUpload={()=> handleGetClassFiles()}/>
              {
                (displayFiles || []).map( (item,ind) => {
                  return(
                    item.pathBase?.match(/.(jpg|jpeg|png|gif|pdf)$/i) ? 
                    <img key={ind+item.filename} src={item.pathBase.replace('http:', 'https:')} className='p-1' alt={item.name} height={30} width={30}/>
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
            <div className='text-align-right'>
                   <Button className='tficolorbg-button' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
            </div>
          <Form onSubmit={updateTask} >  
            <Form.Group className="mb-3">
            <Form.Label>Unit</Form.Label>
              <Form.Select disabled>
                <option>{unit}</option>
              </Form.Select>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Assignment Name</Form.Label>
                <Form.Control defaultValue={assignmentName} placeholder='Enter Assignment Name here' type="text" onChange={(e) => setAssignmentName(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label >Instruction</Form.Label>
                      <ContentField value={instructions} placeholder='Enter instruction here'  onChange={value => setInstructions(value)} />
                    </Form.Group>
                <Form.Group className='right-btn'>
                    <Button className='tficolorbg-button' type='submit' >Update Assignment</Button>
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

export default EditAssignment

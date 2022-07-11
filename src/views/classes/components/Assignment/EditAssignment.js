import React, { useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, Tooltip, OverlayTrigger, Table} from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import ContentField from '../../../../components/content_field/ContentField';
import ContentViewer from '../../../../components/content_field/ContentViewer';
import FilesAPI from '../../../../api/FilesApi';
import FileHeader from '../Task/TaskFileHeader';
import { useParams } from 'react-router'
import { toast } from 'react-toastify';
import ClassCourseFileLibrary from '../ClassCourseFileLibrary';

function EditAssignment({setModal, modal, editAssignment, getAssignmentList, moduleId, instructions, setInstructions, setAssignmentName, assignmentName, unit, assignmentId}) {
  const [editNotufy, setEditNotify] = useState(false)
  const isShared = null
  const [qwert, setQwert] = useState(editAssignment?.assignment?.instructions)
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([])
  const [breedCrumbsItemClass, setBreedCrumbsItemClass] = useState([])
  const subFolderDirectory = breedCrumbsItemClass.map(item => { return `/${item.value}`}) //to get sub directory based on breedcrumbs
  const [displayType, setDisplayType] = useState('');
  const [showFilesFolders, setShowFilesFolders] = useState(false);
  const [courseId, setCourseId] = useState(null)
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

  // useEffect(() => {
  //   if(assignmentName !== '') {
  //     setAssignmentName(editAssignment?.assignment?.assignmentName)
  //     setInstructions(editAssignment?.assignment?.instructions)
	// 	}
  // }, [assignmentName])


  // useEffect(() => {
  //   if(instructions !== '') {
  //     setAssignmentName(assignmentName)
  //     setInstructions(instructions)
	// 	}
  // }, [assignmentName])

  const handleGetClassFiles = async(name) => {
    // setLoading(true)
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().getClassFiles(id, data)
    // setLoading(false)
    if(response.ok){
      console.log(response, 'heeeeeeeere')
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      toast.error("Something went wrong while fetching class files.")
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


  useEffect(() => {
    getClassInfo()
  }, [])

  const getClassInfo = async() => {
    let response = await new ClassesAPI().getClassInformation(id)
    if(response.ok){
      setCourseId(response?.data?.courseId)
    }
  }

  const handleClickedFolder = (name, type) =>{
    if(type == 'Class'){
      let temp = {
        naame: name,
        value: name
      }
      breedCrumbsItemClass.push(temp)
      setBreedCrumbsItemClass(breedCrumbsItemClass);
      handleGetClassFiles(`${subFolderDirectory.join('')}/${name}`);
    }else{
      let temp = {
        naame: name,
        value: name
      }
      breedCrumbsItemClass.push(temp)
      setBreedCrumbsItemClass(breedCrumbsItemClass);
      handleGetCourseFiles(`${subFolderDirectory.join('')}/${name}`);
    }
  }

  const handleGetCourseFiles = async(name) => {
    // setLoading(true)
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().getCourseFiles(courseId, data)
    // setLoading(false)
    if(response.ok){
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      toast.error("Something went wrong while fetching Course files.")
    }
  }

  const handleClickType = (type) => {
    setDisplayType(type);
    setShowFilesFolders(!showFilesFolders)
    setBreedCrumbsItemClass([]);
    if(type == 'Class'){
      handleGetClassFiles('')
    }
    if(type == 'Course'){
      handleGetCourseFiles('')
    }
  }

  const clickFile = (link) => {
    navigator.clipboard.writeText(link)
    toast.success('File link copied to clipboard.')
  }

  const handleFileBreed = () => {
    setBreedCrumbsItemClass([]);
    if(displayType == 'Class'){
      handleGetClassFiles('')
    }
    if(displayType == 'Course'){
      handleGetCourseFiles('')
    }
  }

  const handleClickedBreadcrumbsItem = (value, index, type) => {
    if(type == 'Class'){
      subFolderDirectory.length = index+1;
      breedCrumbsItemClass.length = index+1;
      handleGetClassFiles(subFolderDirectory.join(''));
    }
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
              <ClassCourseFileLibrary />
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

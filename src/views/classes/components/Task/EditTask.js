import React, { useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, Table, Tooltip, OverlayTrigger} from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import ContentField from '../../../../components/content_field/ContentField';
import { toast } from 'react-toastify';
import FileHeader from './TaskFileHeader';
import FilesAPI from '../../../../api/FilesApi';
import { useParams } from 'react-router'
import ClassCourseFileLibrary from '../ClassCourseFileLibrary';

function EditTask({sequenceNo, setSequenceNo, setRate, rate, moduleName, setTaskName, taskName, setInstructions, instructions, taskId, modal, toggle, module, editTask, getTaskModule, moduleId, setModal}){
  const isShared = null
  const [editNotufy, setEditNotify] = useState(false)
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  const [displayFiles, setDisplayFiles] = useState([]);
  const [breedCrumbsItemClass, setBreedCrumbsItemClass] = useState([])
  const subFolderDirectory = breedCrumbsItemClass?.map(item => { return `/${item.value}`}) //to get sub directory based on breedcrumbs
  const [displayType, setDisplayType] = useState('');
  const [showFilesFolders, setShowFilesFolders] = useState(false);
  const [courseId, setCourseId] = useState(null)
  const {id} = useParams();

  const closeNotify = () =>{
    setEditNotify(false)
  }

  console.log('rate:', rate)

  const updateTask = async (e) =>{
    e.preventDefault()
    if(instructions === '' || instructions === '{{type=equation}}' || rate === '' || taskName === '' || sequenceNo === null){
      toast.error('Please input all the required fields.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else if(rate <= 0){
      toast.error('Rate must be greater than to 0.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }  else{
      let id = taskId
      let response = await new ClassesAPI().updateTask(id, {taskName, instructions, rate, sequenceNo, isShared})
        if(response.ok){
          // alert('Task Updated')
          // setEditNotify(true)
          success()
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
      alert("Something went wrong while fetching class files.")
    }
  }

  const success = () => {
    toast.success('Successfully updated task!', {
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
      alert("Something went wrong while fetching Course files.")
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
             Edit Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={updateTask}> 
          <div className={showFiles ? 'mb-3' : 'd-none'}>
            <ClassCourseFileLibrary />
          </div>
          <div className='text-align-right'>
            <Button className='tficolorbg-button' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
          </div>
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
                <Form.Label>Rate</Form.Label>
                  <Form.Control  onChange={(e) => setRate(e.target.value)} type='number' placeholder='Enter Rate here' defaultValue={rate}/>
                </Form.Group>
                <Form.Group className="m-b-20">
                  <Form.Label for="courseName">
                      Sequence no.
                  </Form.Label>
                  <Form.Control
                    defaultValue={sequenceNo} 
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
                  <ContentField value={instructions} placeholder='Enter instruction here' onChange={value => setInstructions(value)} />
                  </Form.Group>
              <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Update Task</Button>
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

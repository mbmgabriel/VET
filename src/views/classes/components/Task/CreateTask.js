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

function CreateTask({setModal, modal, toggle, module, getTaskModule, classId}) {
  const [moduleId, setModuleId] = useState('')
  const [taskName, setTaskName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [addNotify, setAddNotity] = useState(false);
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  const [breedCrumbsItemClass, setBreedCrumbsItemClass] = useState([])
  const subFolderDirectory = breedCrumbsItemClass.map(item => { return `/${item.value}`}) //to get sub directory based on breedcrumbs
  const [displayType, setDisplayType] = useState('');
  const [showFilesFolders, setShowFilesFolders] = useState(false);
  const [courseId, setCourseId] = useState(null)
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
    getClassInfo()
    console.log(module, '-----------')
  }, [])

  const getClassInfo = async() => {
    // setLoading(true)
    let response = await new ClassesAPI().getClassInformation(id)
    if(response.ok){
      setCourseId(response?.data?.courseId)
      console.log({response})
    }
    // setLoading(false)
  }

  const handleGetClassFiles = async(name) => {
    // setLoading(true)
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().getClassFiles(classId, data)
    // setLoading(false)
    if(response.ok){
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      alert("Something went wrong while fetching class files ;;.")
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

  const handleClickedClassBread = () => {
    handleGetClassFiles('')
    setBreedCrumbsItemClass([])
  }

  const handleClickedBreadcrumbsItem = (value, index, type) => {
    if(type == 'Class'){
      subFolderDirectory.length = index+1;
      breedCrumbsItemClass.length = index+1;
      handleGetClassFiles(subFolderDirectory.join(''));
    }
  }

  const handleClickedItem = (data) => {
    setDisplayType(data);
    // setDisplayClassCourse(true);
    if(data == 'Class'){
      handleGetClassFiles('');
    }else{
      handleGetCourseFiles('');
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
            {displayType == 'Class' ?
              <FileHeader type='Class' id={classId}  subFolder={''}  doneUpload={()=> handleGetClassFiles()} />
              :
              <div>
                <p className='title-header'>Files</p>
              </div>
            }
            <div>
              <span onClick={()=> handleClickType('')} className={displayType ? 'colored-class-task' : 'fix-color-bread'}>Files</span>
              {displayType && <span onClick={()=> handleFileBreed()} className={breedCrumbsItemClass.length == 0 ? 'fix-color-bread' : 'colored-class-task'}> <i class="fas fa-chevron-right m-l-10 m-r-10"></i> {displayType} Files</span>}
              {
                breedCrumbsItemClass.map((item, index) => {
                  return <span onClick={() => handleClickedBreadcrumbsItem(item.value, index, 'Class')} className={breedCrumbsItemClass.length == (index+1) ? 'fix-color-bread' : 'colored-class-task'}>  <i class="fas fa-chevron-right m-l-10 m-r-10"></i> {item.naame}</span>
                })
              }
            </div>
            { showFilesFolders ?
              <>
              {
                displayFiles.map( (item,ind) => {
                  console.log(item)
                    return(
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 1, hide: 0 }}
                        overlay={(props) => 
                          <Tooltip id="button-tooltip" {...props}>
                            {item.name}
                          </Tooltip>}
                      >
                     {item.pathBase?.match(/.(jpg|jpeg|png|gif|pdf)$/i) ? 
                        <img key={ind+item.name} src={item.pathBase.replace('http:', 'https:')} onClick={() => clickFile(item.pathBase)} className='p-1' alt={item.name} height={30} width={30}/>
                        :
                        <i className="fas fa-sticky-note" onClick={() => clickFile(item.pathBase)} style={{paddingRight: 5}}/>
                      }
                      </OverlayTrigger>
                    )
                  })
                }
                {
                  displayFolder.map((itm) => {
                    return(
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 1, hide: 0 }}
                        overlay={(props) => 
                          <Tooltip id="button-tooltip" {...props}>
                            {itm.name}
                          </Tooltip>}
                      >
                        <i className='fas fa-folder-open' onClick={()=> handleClickedFolder(itm.name, displayType)} title='' style={{height: 30, width: 30}}/>
                      </OverlayTrigger>
                    )
                  })
                }
              </>
              :
              <Table responsive="sm">
                <thead>
                  <tr>
                    <th>Name</th>  {/* icon for sorting <i class="fas fa-sort-alpha-down td-file-page"></i> */}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3} onClick={() => handleClickType('Class')} className='ellipsis w-25 task-folder'><i className="fas fa-folder" /><span> Class Files</span></td>
                  </tr>
                  <tr>
                    <td colSpan={3} onClick={() => handleClickType('Course')} className='ellipsis w-25 task-folder'><i className="fas fa-folder" /><span> Course Files</span></td>
                  </tr>
                </tbody>
              </Table>
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
import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, Tooltip, OverlayTrigger, Table} from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import { useParams } from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';
import FilesAPI from '../../../../api/FilesApi';
import FileHeader from './../Task/TaskFileHeader';
import ContentField from '../../../../components/content_field/ContentField'

function CreateDiscussion({setModal, modal, toggle, classInfo, module, getDiscussionUnit}) {
  const [moduleId, setModuleId] = useState('')
  const [discussionName, setDiscussionName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [addNotify, setAddNotity] = useState(false)
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFilesFolders, setShowFilesFolders] = useState(false);
  const [breedCrumbsItemClass, setBreedCrumbsItemClass] = useState([])
  const [showFiles, setShowFiles] = useState(false);
  const [displayType, setDisplayType] = useState('');
  const subFolderDirectory = breedCrumbsItemClass.map(item => { return `/${item.value}`}) //to get sub directory based on breedcrumbs
  const [displayFolder, setDisplayFolder] = useState([]);
  const [courseId, setCourseId] = useState(null)
  const allowLate = true
  const {id} = useParams();
  const classId = id

  const closeNotify = () =>{
    setAddNotity(false)
  }

  const handleCloseModal = () => {
    setDiscussionName('')
    setInstructions('')
    setModuleId('')
    setModal(false)
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

  const saveDiscussion = async (e) =>{
    e.preventDefault()
    if(moduleId === ''){
      toast.error('Please input all the required fields.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }); 
    }
    let response = await new ClassesAPI().createDiscussionModule(moduleId, id, {discussion:{discussionName, instructions,}, discussionAssignment:{allowLate}} )
    if(response.ok){
      // alert('Save Discussion')
      success()
      setDiscussionName('')
      setInstructions('')
      setModuleId('')
      getDiscussionUnit(null, moduleId)
      toggle(e)
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

  const success = () => {
    toast.success('Successfully created discussion!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const clickFile = (link) => {
    navigator.clipboard.writeText(link)
    toast.success('File link copied to clipboard.')
  }

  const handleClickedBreadcrumbsItem = (value, index, type) => {
    if(type == 'Class'){
      subFolderDirectory.length = index+1;
      breedCrumbsItemClass.length = index+1;
      handleGetClassFiles(subFolderDirectory.join(''));
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
      alert(courseId)
      alert("Something went wrong while fetching Course files.111111111111111")
    }
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

	return (
    <div>
    	<Modal size="lg" show={modal} onHide={handleCloseModal} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Create Discussion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={saveDiscussion} >
        <div className={showFiles ? 'mb-3' : 'd-none'}>
            {displayType == 'Class' ?
              <FileHeader type='Class' id={classId}  subFolder={`${subFolderDirectory.join('')}`}  doneUpload={()=> handleGetClassFiles(subFolderDirectory.join(''))} />
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
              <option>Select Unit Here </option>
                {module.map(item => {
                  return(<option value={item.id}>{item.moduleName}</option>)
                })}
            </Form.Select>
            <div>
              <Button className='float-right my-2 tficolorbg-button' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
            </div>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Discussion Name</Form.Label>
              <Form.Control onChange={(e) => setDiscussionName(e.target.value)} type="text" placeholder='Enter discussion name here'/>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label >Instruction</Form.Label>
                    <ContentField value={instructions}  placeholder='Enter instruction here'  onChange={value => setInstructions(value)} />
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
export default CreateDiscussion
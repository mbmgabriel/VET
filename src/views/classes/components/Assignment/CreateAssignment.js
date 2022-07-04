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

function CreateAssignment({modal, toggle, module, getAssignmentList, question, setQuestion}) {
  const [moduleId, setModuleId] = useState('')
  const [assignmentName, setAssignmentName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [addNotify, setAddNotity] = useState(false)
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([])
  const [breedCrumbsItemClass, setBreedCrumbsItemClass] = useState([])
  const subFolderDirectory = breedCrumbsItemClass.map(item => { return `/${item.value}`}) //to get sub directory based on breedcrumbs
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
    if(moduleId == ''){
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
      let response = await new ClassesAPI().createAssignment(moduleId, id, {assignment:{assignmentName, instructions,}, classAssignment:{}} )
      if(response.ok){
        success()
        setModuleId('')
        setAssignmentName('')
        setInstructions('')
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

  const getClassInfo = async() => {
    // setLoading(true)
    let response = await new ClassesAPI().getClassInformation(id)
    if(response.ok){
      setCourseId(response?.data?.courseId)
      console.log({response})
    }
    // setLoading(false)
  }

  useEffect(() => {
    getClassInfo()
    // handleGetClassFiles()
  }, [])

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

  const handleGetClassFiles = async(name) => {
    // setLoading(true)
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().getClassFiles(id, data)
    // setLoading(false)
    if(response.ok){
      console.log(response, 'heeeeeeeere----------------')
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      alert("Something went wrong while fetching class files.")
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

  const clickFile = (link) => {
    navigator.clipboard.writeText(link)
    toast.success('File link copied to clipboard.')
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
    }
    if(type == 'Course'){
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
    	<Modal size="lg" show={modal} onHide={toggle} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Create Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {/* <div className={showFiles ? 'mb-3' : 'd-none'}>
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
            </div> */}

          <div className={showFiles ? 'mb-3' : 'd-none'}>
            {displayType == 'Class' ?
              <FileHeader type='Class' id={id}  subFolder={`${subFolderDirectory.join('')}`}  doneUpload={()=> handleGetClassFiles(subFolderDirectory.join(''))} />
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


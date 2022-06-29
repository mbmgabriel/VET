import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilesAPI from '../../../api/FilesApi';
import FileHeader from './AssignmentFileHeader';
import { useParams } from "react-router";
import ContentField from "../../../components/content_field/ContentField";

export default function CreateTask({openCreateTaskModal, setCreateTaskModal, setTaskInfo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [taskName, setTaskName] = useState('')
	const [instructions, setInstructions] = useState('')
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  const {id} = useParams();
  const [breedCrumbsItemClass, setBreedCrumbsItemClass] = useState([])
  const subFolderDirectory = breedCrumbsItemClass.map(item => { return `/${item.value}`}) //to get sub directory based on breedcrumbs
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = () => {
    setCreateTaskModal(false)
    setTaskName('')
    setInstructions('')
  }

	const saveTask = async(e) => {
    e.preventDefault()
    setLoading(true)
    let isShared = false
    let response = await new CoursesAPI().createTask(
      sessionModule,
      {taskName, instructions, isShared:false}
    )
    if(response.ok){
			handleCloseModal()
      getTaskInfo(sessionModule)
      notifySaveTask()
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
    setLoading(false)
  }

  const getCourseUnitPages = async(e, data, data1) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnitPages(sessionCourse, sessionModule)
    setLoading(false)
    if(response.ok){
      setModulePages(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all pages")
    }
  }

  const getTaskInfo = async(e, data) => {
    setLoading(true)
    let response = await new CoursesAPI().getTaskInformation(sessionModule)
    setLoading(false)
    if(response.ok){
      setTaskInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all task")
    }
  }

  const notifySaveTask = () => 
  toast.success('Successfully saved task!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  useEffect(() => {
    handleGetCourseFiles()
  }, [])

  const handleGetCourseFiles = async(name) => {
    // setLoading(true)
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().getCourseFiles(id, data)
    // setLoading(false)
    if(response.ok){
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      alert("Something went wrong while fetching Course files.")
    }
  }

  const clickFile = (link) => {
    navigator.clipboard.writeText(link)
    toast.success('File link copied to clipboard.')
  }

  const handleClickedFolder = (name) =>{
    let temp = {
      naame: name,
      value: name
    }
    breedCrumbsItemClass.push(temp)
    setBreedCrumbsItemClass(breedCrumbsItemClass);
    handleGetCourseFiles(`${subFolderDirectory.join('')}/${name}`);
  }

  const handleClickedBreadcrumbsItem = (value, index) => {
    subFolderDirectory.length = index+1;
    breedCrumbsItemClass.length = index+1;
    handleGetCourseFiles(subFolderDirectory.join(''));
  }

	return (
		<div>
			<Modal size="lg" className="modal-all" show={openCreateTaskModal} onHide={()=> handleCloseModal()} >
				<Modal.Header className="modal-header" closeButton>
				Create Task
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveTask}>
              <div className={showFiles ? 'mb-3' : 'd-none'}>
                <FileHeader type='Course' id={id}  subFolder={subFolderDirectory.join('')} doneUpload={()=> handleGetCourseFiles()} />
                <div>
                  <span onClick={()=> {handleGetCourseFiles(''); setBreedCrumbsItemClass([]);}} className={breedCrumbsItemClass.length != 0 ? 'colored-class-task' : 'fix-color-bread'}>Files</span>
                  {
                    breedCrumbsItemClass.map((item, index) => {
                      return <span onClick={() => handleClickedBreadcrumbsItem(item.value, index)} className={breedCrumbsItemClass.length == (index+1) ? 'fix-color-bread' : 'colored-class-task'}>  <i class="fas fa-chevron-right m-l-10 m-r-10"></i> {item.naame}</span>
                    })
                  }
                </div>
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
                        <i className='fas fa-folder-open' onClick={()=> handleClickedFolder(itm.name)} title='' style={{height: 30, width: 30}}/>
                      </OverlayTrigger>
                    )
                  })
                }
                {/* {
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
                } */}
              </div>
              <Form.Group className="m-b-20">
                  <Form.Label for="courseName">
                      Task Name
                  </Form.Label>
                  <Form.Control 
                    className="custom-input" 
                    size="lg" 
                    type="text" 
                    placeholder="Enter Task Name"
                    onChange={(e) => setTaskName(e.target.value)}
                  />
              </Form.Group>
              <div>
                <Button className='float-right my-2' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
              </div>
              <Form.Group className="m-b-20">
                  <Form.Label for="description">
                      Instructions
                  </Form.Label>
                    <ContentField value={instructions}  placeholder='Enter instruction here'  onChange={value => setInstructions(value)} />
              </Form.Group>

              <span style={{float:"right"}}>
                  <Button className="tficolorbg-button" type="submit">
                      Save Task
                  </Button>
              </span>
          </Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}
import React, {useState, useEffect, useContext} from 'react'
import {Table, Button, OverlayTrigger, Tooltip, Form, InputGroup } from 'react-bootstrap'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';
import FilesAPI from '../../api/FilesApi';
import Modal from 'react-bootstrap/Modal'
import { UserContext } from '../../context/UserContext';
import moment from 'moment';
import CoursesAPI from '../../api/CoursesAPI';
import { useParams } from "react-router-dom";

function FilesContent(props) {

  const [deleteNotify, setDeleteNotify] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({});
  const [modal, showModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({});
  const [newFileName, setNewFilename] = useState('');
  const [extFilename, setExtFilename] = useState('');
  const [courseInfo, setCourseInfo] = useState("")
  const [currentFolderName, setCurrentFolderName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [folderToDelete, setToFolderDelete] = useState('')
  const [deleteFolderNotify, setDeleteFolderNotify] = useState(false)
  const [editFolderModal, setEditFolderModal] = useState(false);
  const [displayButtons, setDisplayButtons] = useState(true);
  const {id} = useParams()
  const userContext = useContext(UserContext)
  const {user} = userContext.data;
  const subsType = user.subsType;
  const displayHeader = window.location.pathname.includes(props.type.toLowerCase()) ||  window.location.pathname.includes('files'); //if file header is called from files
  const courseid = sessionStorage.getItem('courseid')

  const getCourseInformation = async() => {
    let response = await new CoursesAPI().getCourseInformation(props.id)
    if(response.ok){
      setCourseInfo(response.data)
      let temp = response.data.isTechfactors
      if(temp){
      //  setDisplayButtons(user?.teacher.positionID == 7 ? true : false)
      }
    }else{
      toast.error("Something went wrong while fetching course information.")
    }
  }

  const getContributor = async() => {
    let response = await new CoursesAPI().getContributor(props.id)
    if(response.ok){
      let temp = response.data;
      let ifContri = temp.find(i => i.userInformation?.userId == user.userId);
      console.log(ifContri, user.userId)
      setDisplayButtons(ifContri ? true : false);
    }
  }

  useEffect(() => {
    if(window.location.pathname.includes('course')){
      getCourseInformation();
      getContributor();
    }
  }, [])

  console.log('courseInfo:', courseInfo)

  const handleClickFolder = (data) => {
    setCurrentFolderName(data.name);
    setNewFolderName(data.name)
    setEditFolderModal(true);
  }

  const saveNewFolderName = async() => {
    setEditFolderModal(false);
    let data = {
      "folderName": currentFolderName,
      "newFolderName": newFolderName,
      "subFolderLocation": `${props.subFolder}`
    }
    let response = await new FilesAPI().updateFolderName(props.id, props.type, data)
    console.log({response})
    if(response.ok){
      props.deleted();
      toast.success('Successfully renamed folder.')
    }else{
      toast.error(response.data?.errorMessage)
    }
  }

  const deleteFolder = async() => {
    let data = {
      "subFolderLocation": `${props.subFolder}/${folderToDelete}`
    }
    let response = await new FilesAPI().deleteFolder(props.id, props.type, data)
    if(response.ok){
      props.deleted();
      toast.success('Successfully deleted folder.')
    }else{
      toast.error(response.data?.errorMessage)
    }
    setDeleteFolderNotify(false);
  }

  const  downloadImage = (url) => {
    fetch(url, {
      mode : 'no-cors',
    })
      .then(response => response.blob())
      .then(blob => {
      let blobUrl = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.download = url.replace(/^.*[\\\/]/, '');
      a.href = blobUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
  }

  const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete
    </Tooltip>
  )

  const renderTooltipView = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      View
    </Tooltip>
  )

  const renderTooltipDownload = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Download
    </Tooltip>
  )

  const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit 
    </Tooltip>
  )
  
  const handledeleteItem = async() => {
    if(props.type == 'Class'){
      handleDeleteClassFile(); 
    }
    if(props.type == 'Course'){
      handleDeleteCourseFile();
    }
  }

  const handleDeleteClassFile = async() => {
    let data = {
      "fileName": itemToDelete.name,
      "subFolderLocation":  props.subFolder,
    }
    let response = await new FilesAPI().deleteClassFile(props.id, data)
    if(response.ok){
      setDeleteNotify(false)
      props.deleted();
      toast.success("File deleted successfully");
    }else{
      setDeleteNotify(false)
      toast.error(response.data?.errorMessage.replace('distributor', 'contributor')) 
    }
  }

  const handleDeleteCourseFile = async() => {
    let data = {
      "fileName": itemToDelete.name,
      "subFolderLocation": props.subFolder,
    }
    let response = await new FilesAPI().deleteCourseFile(props.id, data)
    if(response.ok){
      setDeleteNotify(false)
      props.deleted();
      toast.success("File deleted successfully");
    }else{
      setDeleteNotify(false)
      toast.error(response.data?.errorMessage.replace('distributor', 'contributor')) 
    }
  }

  const handleOnClick = (data) => {
    setDeleteNotify(true)
    setItemToDelete(data)
  }

  const handleOnClickFolder = data => {
    setToFolderDelete(`${data.name}`);
    setDeleteFolderNotify(true)
  }

  const handleEdit = (item) => {
    let extName = item.name.split('.').pop(),
    tempName = item.name.replace(`.${extName}`, '');
    setExtFilename(`.${extName}`);
    showModal(true);
    setItemToEdit(item);
    setNewFilename(tempName);
  }

  const handleSaveNewCourseFileName = async() => {
    if(newFileName != ''){
      let tempFilename = newFileName.includes(extFilename) ? newFileName : newFileName+extFilename;
      let data = {
        "newFileName": tempFilename,
        "oldFileName": itemToEdit.name,
        "subFolderLocation": props.subFolder
      }
      let response = await new FilesAPI().editCourseFile(props.id, data)
      if(response.ok){
        showModal(false)
        props.deleted(); //to refetch data
        toast.success("Filename updated successfully");
        setNewFilename('');
      }else{
        showModal(false);
        toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
      }
    }else{
      toast.error("Please enter filename.");
    }
  }

  const handleSaveNewClassFileName = async() => {
    if(newFileName != ''){
      let tempFilename = newFileName.includes(extFilename) ? newFileName : newFileName+extFilename;
      let data = {
        "newFileName": tempFilename,
        "oldFileName": itemToEdit.name,
        "subFolderLocation": props.subFolder

        // fileData: {...itemToEdit, fileName: tempFilename, classFiles: {...itemToEdit.classFiles, fileName: tempFilename}},
        // classId: itemToEdit.classFiles.classId,
        // fileId: itemToEdit.classFiles.id
      }
      let response = await new FilesAPI().editClassFile(props.id, data);
      if(response.ok){
        showModal(false)
        props.deleted(); //to refetch data
        toast.success("Filename updated successfully");
        setNewFilename('');
      }else{
        showModal(false);
        toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
      }
    }else{
      toast.error("Please enter filename.");
    }
  }

  const handleSaveNewFilename = () => {
    if(props.type == 'Class'){
      handleSaveNewClassFileName(); 
    }
    if(props.type == 'Course'){
      handleSaveNewCourseFileName();
    }
  }

  const handleEditFilenameModal = () => {
    return(
      <Modal  size="lg" show={modal} onHide={ () => showModal(false)} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Edit Filename
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <p>Current filename: <span>{itemToEdit.name}</span></p>
            <Form.Label>New Filename</Form.Label>
          <InputGroup className="mb-4">
            <Form.Control defaultValue={newFileName} value={newFileName} type="text" onChange={(e) => setNewFilename(e.target.value.replace('.', ''))} />
            <InputGroup.Text>{extFilename}</InputGroup.Text>
          </InputGroup>
          <Form.Group className='right-btn'>
            <Button className='tficolorbg-button' onClick={()=> handleSaveNewFilename()} >Update Filename</Button>
          </Form.Group>
        </Form> 
        </Modal.Body>
      </Modal>
    )
  }

  const handleEditFolderName = () => {
    return(
      <Modal  size="lg" show={editFolderModal} onHide={ () => setEditFolderModal(false)} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Edit Folder name
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <p>Current folder name: <span>{currentFolderName}</span></p>
            <Form.Label>New folder name</Form.Label>
          <InputGroup className="mb-4">
            <Form.Control defaultValue={newFileName} value={newFolderName} type="text" onChange={(e) => setNewFolderName(e.target.value.replace('.', ''))} />
          </InputGroup>
          <Form.Group className='right-btn'>
            <Button className='tficolorbg-button' onClick={()=> saveNewFolderName()}>Update Folder</Button>
          </Form.Group>
        </Form>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <Table responsive="sm">
      <thead>
        <tr>
          <th>Name</th>  {/* icon for sorting <i class="fas fa-sort-alpha-down td-file-page"></i> */}
          {/* <th >Date Modified</th>  icon for sorting <i class="fas fa-sort-numeric-down td-file-page"></i> */}
          {displayButtons && user.isTeacher  & displayHeader ? <>
            <th >Actions</th>
          </>
          :
          null
          }
        </tr>
      </thead>
      <tbody>
        {/* <tr colSpan={3} className={props.data?.length == 0 ? 'text-center p-3' : 'd-none'}>
          <td colSpan={3}>
            No items to display
          </td>
        </tr> */}
        {
          props.data?.filter(item =>
              item.name.toLowerCase().includes(props.filter?.toLowerCase())).map((item, index) => {
            return(
              <tr key={index+item.name}>
                <td className='ellipsis w-75 file-name font-size-22'>{item.name}</td>
                {/* {
                  props.type == 'Class' ? <td className='ellipsis w-50' style={{fontSize:'20px'}}>{item.classFiles ? moment(item.classFiles?.createdDate).format('LL') : moment(item.courseFiles?.createdDate).format('LL')}</td> 
                    :
                  <td className='ellipsis w-25' style={{fontSize:'20px'}} >{moment(item.createdDate).format('LL')}</td>
                } */}
                {displayButtons && user.isTeacher && displayHeader && subsType !== 'Ebooks' ? <>
                  <td style={{paddingRight:'15px'}} >
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 1, hide: 0 }}
                      overlay={item.pathBase?.match(/.(jpg|jpeg|png|gif|pdf)$/i) ? renderTooltipView : renderTooltipDownload }
                    >
                      <a href={item.pathBase} download={true} target='_blank'>                     
                        <i class={`${item.pathBase?.match(/.(jpg|jpeg|png|gif|pdf)$/i) ? 'fa-eye' : 'fa-arrow-down'} fas td-file-page`}></i>
                      </a> 
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 1, hide: 0 }}
                      overlay={renderTooltipEdit}
                    >
                      <i className={user.isSchoolAdmin ? 'd-none' : "fas fas fa-edit td-file-page"} onClick={() => handleEdit(item) } />
                    </OverlayTrigger>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 1, hide: 0 }}
                    overlay={renderTooltipDelete}>
                    <a>
                      <i className={user.isSchoolAdmin ? 'd-none' : "fas fa-trash-alt td-file-page"} onClick={() => handleOnClick(item) }></i>
                    </a>
                  </OverlayTrigger>
                  </td>
                </>
                :
                <td>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 1, hide: 0 }}
                    overlay={item.pathBase?.match(/.(jpg|jpeg|png|gif|pdf)$/i) ? renderTooltipView : renderTooltipDownload }
                  >
                    <a href={item.pathBase} download={true} target='_blank'>                     
                      <i class={`${item.pathBase?.match(/.(jpg|jpeg|png|gif|pdf)$/i) ? 'fa-eye' : 'fa-arrow-down'} fas td-file-page`}></i>
                    </a> 
                  </OverlayTrigger>
                </td>
                }
              </tr>
            )
          })
        }
        {
          props.folders?.filter(item =>
            item.name.toLowerCase().includes(props.filter?.toLowerCase())).map((item, index) => {
            return(
              <tr key={index+item.name}>
                <td className='ellipsis w-75 colored-class font-size-22' onClick={()=> props.clickedFolder(item)}><i className="fas fa-folder" /><span className='font-size-22'> {item.name}</span></td>
               {
                displayButtons && user.isTeacher && displayHeader && subsType !== 'Ebooks' ? <td>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 1, hide: 0 }}
                      overlay={renderTooltipEdit}
                    >
                      <i class="fas fas fa-edit td-file-page" onClick={() => handleClickFolder(item) } />
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 1, hide: 0 }}
                      overlay={renderTooltipDelete}>
                      <a>
                        <i class="fas fa-trash-alt td-file-page" onClick={() => handleOnClickFolder(item) }></i>
                      </a>
                    </OverlayTrigger>
                  </td>
                  :
                  <td></td>
                }
              </tr>
            )
          })

        }
      </tbody>
      {handleEditFilenameModal()}
      {handleEditFolderName()}
      <SweetAlert
        warning
        showCancel
        show={deleteNotify}
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title="Are you sure?"
        onConfirm={() => handledeleteItem()}
        onCancel={() => setDeleteNotify(false)}
        focusCancelBtn
          >
           You will not be able to recover this file!
      </SweetAlert>
      <SweetAlert
        warning
        showCancel
        show={deleteFolderNotify}
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title="Are you sure?"
        onConfirm={() => deleteFolder()}
        onCancel={() => setDeleteFolderNotify(false)}
        focusCancelBtn
          >
           You will not be able to recover this folder!
      </SweetAlert>
    </Table>
  )
}
export default FilesContent

import React, {useState, useContext} from 'react'
import {Table, Button, OverlayTrigger, Tooltip, Form, InputGroup } from 'react-bootstrap'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';
import FilesAPI from '../../api/FilesApi';
import Modal from 'react-bootstrap/Modal'
import moment from 'moment';
import { UserContext } from '../../context/UserContext'

function FilesContent(props) {

  const [deleteNotify, setDeleteNotify] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({});
  const [modal, showModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({});
  const [newFileName, setNewFilename] = useState('');
  const [extFilename, setExtFilename] = useState('');
  const userContext = useContext(UserContext)
  const {user} = userContext.data

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
    let response = await new FilesAPI().deleteCourseTeacherResourceFile(props.id, data)
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
      let response = await new FilesAPI().editTeacherResourceFile(props.id, data)
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
          <p>Current filename: <span>{itemToEdit.fileName}</span></p>
            <Form.Label>New Filename</Form.Label>
          <InputGroup className="mb-4">
            <Form.Control defaultValue={newFileName} value={newFileName} type="text" onChange={(e) => setNewFilename(e.target.value.replace('.', ''))} />
            <InputGroup.Text>{extFilename}</InputGroup.Text>
          </InputGroup>
          <Form.Group className='right-btn'>
            <Button className='tficolorbg-button' onClick={()=> handleSaveNewFilename()} >Save</Button>
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
          <th >Actions</th>
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
                <td className='ellipsis w-75 colored-class font-size-22'>{item.name}</td>
                {/* {
                  props.type == 'Class' ? <td className='ellipsis w-50' style={{fontSize:'20px'}}>{item.classFiles ? moment(item.classFiles?.createdDate).format('LL') : moment(item.courseFiles?.createdDate).format('LL')}</td> 
                    :
                  <td className='ellipsis w-25' style={{fontSize:'20px'}} >{moment(item.createdDate).format('LL')}</td>
                } */}
               {user?.teacher.positionID == 7 ? 
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
                      <i class="fas fas fa-edit td-file-page" onClick={() => handleEdit(item) } />
                    </OverlayTrigger>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 1, hide: 0 }}
                    overlay={renderTooltipDelete}>
                    <a>
                      <i class="fas fa-trash-alt td-file-page" onClick={() => handleOnClick(item) }></i>
                    </a>
                  </OverlayTrigger>
                  </td>
                  :
                  <td />
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
                <td colSpan={3} className='ellipsis w-25 colored-class' onClick={()=> props.clickedFolder(item)}><i className="fas fa-folder" /><span className='font-size-22'> {item.name}</span></td>
              </tr>
            )
          })

        }
      </tbody>
      {handleEditFilenameModal()}
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
    </Table>
  )
}
export default FilesContent

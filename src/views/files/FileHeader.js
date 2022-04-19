import userEvent from '@testing-library/user-event';
import React, {useState, useEffect, useContext} from 'react'
import {Button, Modal,Table, ProgressBar, Col, Row,  InputGroup, FormControl, Tooltip, OverlayTrigger} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilesAPI from '../../api/FilesApi';
import { UserContext } from '../../context/UserContext';

function FileHeader(props) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [doneUpload, setDoneUpload] = useState(false)
  const [uploadStarted, setUploadStarted] = useState(false)
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [folderName, setFolderName] = useState('')
  const [folderCreatedCourse, setFolderCreatedCourse] = useState(false); 
  const allUploaded = files.filter(itm => { //check if all items is already 100% uploaded
    return itm.progress != 100
  })
  const userContext = useContext(UserContext)
  const {user} = userContext.data

  const handlefilesUpload = (file) => {
    if(file != ''){
      
      Object.values(file).map((itm, index) => {
        // console.log(itm, index)
        let temp = []
        getBase64(itm).then(
          data => {
            let toAdd = {
              fileName: itm.name,
              base64String: data,
              size: itm.size,
              progress: 0,
              status: ''
            };
            files.push(toAdd)
            setFiles([...files]);
          }
        );
      })
    }
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const handleUploadFile = async() => {
    setUploadStarted(true)
    //course uploading
    if(props.type == 'Course'){
      files.map( async(item, index) => {
        if(item.progress == 0){
          let tempData = {
            fileName: item.fileName,
            base64String: item.base64String,
            subFolderLocation: props.subFolder
          },
          toSave = {
            data: tempData,
            id: props.id
          }
          files[index].progress = 30;
          setFiles([...files])
          let response = await new FilesAPI().newCourseFile(toSave)
          if(response.ok){
            files[index].progress = 100;
            setFiles([...files])
            let allUploaded = files.filter(itm => { //check if all items is already 100% uploaded
              return itm.progress != 100
            })
            setDoneUpload(allUploaded.length == 0 ? true : false)
            setUploadStarted(allUploaded.length == 0 ? false : true)
          }else{
            setFiles([])
            setDoneUpload(false)
            setUploadStarted(false)
            if(response.data?.errorMessage.includes('exist')){
              files[index].progress = 100;
              files[index].status = 'failed';
              setFiles([...files])
            }else{
              setShowUploadModal(false)
              toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
            }
          }
        }
      })
    }
    // class uploading
    if(props.type == 'Class'){
      files.map( async(item, index) => {
        if(item.progress == 0){
          let tempData = {
            fileName: item.fileName,
            base64String: item.base64String,
            subFolderLocation: props.subFolder
          },
          toSave = {
            data: tempData,
            id: props.id
          }
          files[index].progress = 30;
          setFiles([...files])
          let response = await new FilesAPI().newClassFile(toSave)
          if(response.ok){
            files[index].progress = 100;
            setFiles([...files])
            let allUploaded = files.filter(itm => { //check if all items is already 100% uploaded
              return itm.progress != 100
            })
            setDoneUpload(allUploaded.length == 0 ? true : false)
            setUploadStarted(allUploaded.length == 0 ? false : true)
          }else{
            setFiles([])
            setDoneUpload(false)
            setUploadStarted(false)
            if(response.data?.errorMessage.includes('exist')){
              files[index].progress = 100;
              files[index].status = 'failed';
              setFiles([...files])
            }else{
              setShowUploadModal(false)
              toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
            }
            // toast.error(response.data?.errorMessage.replace('distributor', 'contributor'));
          }
        }
      })
    }
  }

  const handelRemoveSelectedFiles = (index) => {
    let temp = files
    temp.splice(index, 1)
    setFiles([...temp])
  }

  const handleDoneUpload = () => {
    setShowUploadModal(false)
    setFiles([])
    props.doneUpload()
    setDoneUpload(false)
    setUploadStarted(false)
    setUploadStarted(false)
  }

  const renderTooltipUploadFiles = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Create Folder
    </Tooltip>
  )

  const handleSaveFolder = async() => {
    if(props.type == 'Course'){
      let data = {
          "folderName": folderName,
          "subFolderLocation": props.subFolder
      }
      let response = await new FilesAPI().createCourseFolder(props.id, data)
      if(response.ok){
        props.doneUpload()
        setShowAddFolderModal(false)
      }else{
        setShowAddFolderModal(false)
        toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
      }
    }
    if(props.type == 'Class'){
      let data = {
          "folderName": folderName,
          "subFolderLocation": props.subFolder
      }
      let response = await new FilesAPI().createCLassFolder(props.id, data)
      if(response.ok){
        props.doneUpload()
        setShowAddFolderModal(false)
      }else{
        setShowAddFolderModal(false)
        toast.error(response.data?.errorMessage.replace('distributor', 'contributor'));
      }
    }
  }

  return (
    <div>
      <div style={{flexDirection: 'row', paddingLeft: 0}} className="pages-header file-content">
        <div>
          <p className='title-header'>{props.title}</p>
        </div>
        {!user.isSchoolAdmin && <>
          <div>
            <OverlayTrigger
              placement="right"
              delay={{ show: 1, hide: 0 }}
              overlay={renderTooltipUploadFiles}
            >
              <i style={{marginTop: 10}} className="fas fa-folder-plus file-upload-content font-size-35 cursor-pointer" onClick={() => setShowAddFolderModal(true)}/>
            </OverlayTrigger>
          </div>
          <div>
            <Button style={{paddingTop:14}} className='btn-create-discussion' variant="link" onClick={() => setShowAddFolderModal(true)}> New Folder  </Button>
          </div>
          <div>
            <h5 style={{paddingTop: 15}} className="fileupload"> OR </h5>
          </div>
          <div>
            <p><Button style={{paddingTop:14}} className='btn-create-discussion' variant="link" onClick={() => setShowUploadModal(true)}> + Upload Files  </Button></p>
          </div>
        </>}
      </div>
      <Modal size="lg" show={showUploadModal} onHide={() => setShowUploadModal(false)} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Upload File
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row style={{paddingTop:'25px', paddingBottom: '20px'}}>
            <Col lg={3} className='mt-3'>
              <Button size='lg' variant="outline-warning" className="file-library" onClick={() => { document.getElementById('inputFile').click() }}>
                <i className="fas fa-paperclip"></i>
                Choose Files
              </Button>
            </Col>
              <Col lg={4} className='bg-gray d-flex justify-content-center br-5px'>
                <div className='row position-absolute d-flex p-2'>
                  <p className='mb-0 text-center'>Drag files here</p>
                  <i className='text-center fa fa-download font-size-30'/>
                </div>
                <input className='opacity-0 w-100 height-80px' id='inputFile' multiple type='file' placeholder='Choose color' style={{ backgroundColor: 'inherit' }} onChange={(e) => handlefilesUpload(e.target.files)} />
              </Col>
          </Row>
          <Table responsive="sm">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Progress</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
             {files?.map((item, index) => {
              return(
                <tr key={item.fileName}>
                  <td>{item.fileName}</td>
                  {item.status == 'failed' ? <td style={{fontSize: 14, color: 'red'}}>Failed to upload.File already exist.</td> : <td><ProgressBar variant="warning" now={item.progress} /></td>}
                  {/* <td><ProgressBar variant="warning" now={item.progress} /></td> */}
                  <td>{item.size} KB <i class="fas fa-times td-file-page" onClick={()=> handelRemoveSelectedFiles(index)}></i></td>
                </tr>
              );
             })}
            </tbody>
          </Table>
          <Button size="lg" variant="outline-warning" disabled={allUploaded.length == 0 ? true : false} className={"file-library file-button-upload mx-3" } onClick={()=> handleUploadFile()}>{uploadStarted ? 'Uploading...' : 'Upload'}</Button>
          <Button size="lg" variant="outline-warning" className={ doneUpload ? "file-library file-button-upload" : 'd-none'} onClick={()=> handleDoneUpload()}>Done</Button>
        </Modal.Body>
      </Modal>

      <Modal size="lg" show={showAddFolderModal} onHide={() => setShowAddFolderModal(false)} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Create Folder
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup size="lg">
              <FormControl onChange={(e) => setFolderName(e.target.value)} className='mb-2' aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Enter folder name"/>
            </InputGroup>
          {folderCreatedCourse ?
          <>
            <Row style={{paddingTop:'25px', paddingBottom: '20px'}}>
              <Col lg={3} className='mt-3'>
                <Button size='lg' variant="outline-warning" className="file-library" onClick={() => { document.getElementById('inputFile').click() }}>
                  <i className="fas fa-paperclip"></i>
                  Choose Files
                </Button>
              </Col>
                <Col lg={4} className='bg-gray d-flex justify-content-center br-5px'>
                  <div className='row position-absolute d-flex p-2'>
                    <p className='mb-0 text-center'>Drag files here</p>
                    <i className='text-center fa fa-download font-size-30'/>
                  </div>
                  <input className='opacity-0 w-100 height-80px' id='inputFile' multiple type='file' placeholder='Choose color' style={{ backgroundColor: 'inherit' }} onChange={(e) => handlefilesUpload(e.target.files)} />
                </Col>
            </Row>
            <Table responsive="sm">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Progress</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
              {files?.map((item, index) => {
                return(
                  <tr key={item.fileName}>
                    <td>{item.fileName}</td>
                   {item.status == 'failed' ? <td style={{fontSize: 14, color: 'red'}}>Failed to upload.File already exist.</td> : <td><ProgressBar variant="warning" now={item.progress} /></td>}
                    <td>{item.size} KB <i class="fas fa-times td-file-page" onClick={()=> handelRemoveSelectedFiles(index)}></i></td>
                  </tr>
                );
              })
            }
            </tbody>
          </Table>
            </>
            :
            <></>
          }
          <Button size="lg" variant="outline-warning" className={ folderCreatedCourse ? 'd-none' : "file-library file-button-upload"} onClick={()=> handleSaveFolder()}>Save</Button>
          {/* <Button size="lg" variant="outline-warning" disabled={allUploaded.length == 0 ? true : false} className={"file-library file-button-upload mx-3" } onClick={()=> handleUploadFile()}>{uploadStarted ? 'Uploading...' : 'Upload'}</Button> */}
          <Button size="lg" variant="outline-warning" className={ doneUpload ? "file-library file-button-upload" : 'd-none'} onClick={()=> handleDoneUpload()}>Done</Button>
        </Modal.Body>
      </Modal>
    </div>
	)
}
export default FileHeader


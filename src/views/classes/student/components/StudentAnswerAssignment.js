import React, { useState, useEffect, useContext} from 'react'
import { Form, Button, Table, ProgressBar} from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { useParams } from 'react-router'
import ClassesAPI from '../../../../api/ClassesAPI'
import { UserContext } from '../../../../context/UserContext'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

function StudentAnswerAssignment({answerAnswerToggle, answerModal, assignmentId}) {
  const {id} = useParams();
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [assignmentAnswer, setAssignmentAnswer] = useState('')
  // const [files, setFiles] = useState('')
  const [assignNotify, setAssignNotify] = useState(false)
  const [files, setFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState('pending');

  const closeNotify = () => {
    setAssignNotify(false)
  }

  // console.log("user:", user?.userId)

  const submitStudentAssignmentAnswer = async (e) => {
    e.preventDefault()
    if(assignmentAnswer === ''){
      toast.error('Please fill out the field!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }else{
      setUploadingFiles('uploading');
      let studentId = user?.student?.id
      let response = await new ClassesAPI().submitStudentAssignmentAnswer(studentId, id, assignmentId, {assignmentAnswer, fileDetails: files})
        if(response.data){
          setAssignNotify(true)
          setAssignmentAnswer('');
          setUploadingFiles('done');
          setFiles([]);
          answerAnswerToggle()
        }else{
          alert(response.data.errorMessage)
        }
    }
  }

  const handlefilesUpload = (file) => {
    if(file != ''){
      Object.values(file).map((itm, index) => {
        let maxSize = 25000000;
        if(itm.size <= maxSize){
          console.log(itm, index)
          getBase64(itm).then(
            data => {
              let toAdd = {
                fileName: itm.name,
                base64String: data,
                size: itm.size,
                progress: 0
              };
              files.push(toAdd)
              setFiles([...files]);
            }
          );
        }else{
          toast.error('Please select a file below 25mb.');
        }
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

  const handelRemoveSelectedFiles = (index) => {
    let temp = files
    temp.splice(index, 1)
    setFiles([...temp])
  }

  const uploadStatus = () => {
    switch (uploadingFiles) {
      case 'pending':
        return 0
      case 'uploading':
        return 30
      case 'done':
        return 100
      
    default:
      break;
    }
  }

  return (
    <div>
       <Modal  size="lg" show={answerModal} onHide={answerAnswerToggle} aria-labelledby="example-modal-sizes-title-lg">
          <Modal.Header className='class-modal-header' closeButton>
            <Modal.Title id="example-modal-sizes-title-lg" >
              Answer Assignment
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form onSubmit={submitStudentAssignmentAnswer} >  
            <Form.Group className="mb-3">
              <Form.Label>Answer</Form.Label>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control onChange={(e) => setAssignmentAnswer(e.target.value)}  as="textarea" rows={3}  />
            </Form.Group>
            <Form.Group className="mb-1">
              <Button className='tficolorbg-button' onClick={() => { document.getElementById('attachedFile').click() }}>Attache File</Button>
              <input id='attachedFile' className='d-none' multiple type='file' placeholder='Choose color' style={{ backgroundColor: 'inherit' }} onChange={(e) => handlefilesUpload(e.target.files)} />
            </Form.Group>
            <Table responsive="sm" className={files.length == 0 ? 'd-none' : ''}>
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
                    <td><ProgressBar variant="warning" now={uploadStatus()} /></td>
                    <td>{item.size} B <i class="fas fa-times td-file-page" onClick={()=> handelRemoveSelectedFiles(index)}></i></td>
                  </tr>
                );
              })}
              </tbody>
            </Table>
            <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Save</Button>
            </Form.Group>
          </Form> 
          </Modal.Body>
        </Modal>
        <SweetAlert 
          success
          show={assignNotify} 
          title="Done!" 
           onConfirm={closeNotify}>
        </SweetAlert>
    </div>
  )
}

export default StudentAnswerAssignment

import React, { useEffect, useState } from 'react'
import { Col, Row, Modal, Form, Button, InputGroup } from 'react-bootstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import SchoolAPI from '../../../api/SchoolAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from "react-toastify";
import moment from "moment"

export default function TeachersList() {

  const [schoolAdmin, setSchoolAdmin] = useState([]);
  const [deleteNotify, setDeleteNotify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toDeleteId, setToDeleteId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [toChangePassId, setToChangePassId] = useState('');
  const [filesToUpload, setFilesToUpload] = useState({});

  const [prefix, setPrefix] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('')
  const [mname, setMname] = useState('')
  const [gender, setGender] = useState('')
  const [birthdate, setBirthdate] = useState('');
  const [citizenship, setCitizenship] = useState('');
  const [status, setStatus] = useState('');
  const [employeeNo, setEmployeeNo] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyNo, setEmergencyNo] = useState('');
  const [toEditId, setToEditId] = useState('');
  const [positionID, setPositionID] = useState('');
  const [userAccountID, setUserAccountID] = useState('')
  const [formType, setFormType] = useState('Edit');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    handleSchoolAdmin()
  }, [])

  const handleSchoolAdmin = async () => {
    let response = await new SchoolAPI().getSchoolAdmin();
    if (response.ok) {
      setSchoolAdmin(response.data)
      console.log(response.data, '=======!')
    } else {
      toast.error("Something went wrong while fetching exam information")
    }
    console.log(response)
  }


  const handleGetUploadedFile = (file) => {
    getBase64(file).then(
      data => {
        console.log(file.name)
        let toUpload = {
          "base64String": data,
          "fileName": file.name
        }
        setFilesToUpload(toUpload)
      }
    );
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const handleUploadFile = async (e) => {
    e.preventDefault();
    setShowUploadModal(false);
    let response = await new SchoolAPI().uploadTeacherList(filesToUpload)
    if (response.ok) {
      handleSchoolAdmin()
      toast.success("Successfully uploaded the teacher list.")
    } else {
      toast.error("Something went wrong while uploading teacher list.")
    }
  }

  const handleRegisterSchoolAdmin = async () => {
    let data = {
      username,
      password
    }
    if(username != '' && password != '') {
      let response = await new SchoolAPI().createSchoolAdmin(data)
      if (response?.ok) {
        handleSchoolAdmin();
        clearState();
        toast.success("Successfully registered the school admin");
        setShowEditModal(false);
      } else {
        toast.error(response?.data?.errorMessage);
      }
    }else{
      toast.error('Please input all required fileds.')
    }
  }

  const handleDeleteSchoolAdmin = async () => {
    let response = await new SchoolAPI().deleteAccount(toDeleteId);
    if (response.ok) {
      toast.success("School Admin deleted successfully");
      handleSchoolAdmin();
    } else {
      toast.error("Something went wrong while deleting Student.")
    }
    setDeleteNotify(false);
  }

  const form = () => {
    return (
      <Modal size="lg" show={showEditModal} onHide={() => { setShowEditModal(false); clearState(); }} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>{formType == 'Edit' ? 'Edit Account' : 'Register School Admin'}</Modal.Header>
        <Modal.Body>
          <div className="row row-space-10">
            <div className="col-md-6 m-b-15">
              <label className="control-label">Username <span className='text-danger'>*</span></label>
              <InputGroup className="mb-4">
                <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
              </InputGroup>
            </div>
            <div className="col-md-6 m-b-15">
              <label className="control-label">Password <span className='text-danger'>*</span></label>
              <InputGroup className="mb-4">
                <Form.Control type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              </InputGroup>
            </div>
          </div>
          {
            formType == 'Edit'
            ?
            <button className="btn float-right tficolorbg-button mb-4" onClick={() => handleSaveEdit()}>Save Edit</button>
            :
            <button className="btn float-right tficolorbg-button mb-4" onClick={() => handleRegisterSchoolAdmin()}>Register</button>
          }
          <button className="btn float-right btn-danger mb-4 m-r-10" onClick={() => setShowEditModal(false)}>Cancel</button>
        </Modal.Body>
      </Modal>
    )
  }

  const handleSaveEdit = async () => {
    let data = {
      username,
      password
    }
    if(username != '' && password != '') {
      let response = await new SchoolAPI().updateAccount(toEditId, data)
      if (response.ok) {
        setShowEditModal(false);
        handleSchoolAdmin()
        toast.success("Successfully updated the teacher information.");
        setToEditId('')
        setPositionID('');
        setUserAccountID('');
      } else {
        toast.error(response?.data?.errorMessage);
      }
    }else{
      toast.error('Please input all required fileds.');
    }
  }

  const handleClickEdit = (data) => {
    setUsername(data.username);
    setPassword(data.password);
    setShowEditModal(true);
    setToEditId(data.id)
  }

  const clearState = () => {
    setUsername('');
    setPassword('');
  };

  const handleClickDelete = (id) => {
    setToDeleteId(id);
    setDeleteNotify(true)
  }

  return (
    <>
      <span className='m-t-5'>School Admin List</span>|{' '}
      <button onClick={() => { setShowEditModal('Register'); setFormType('Register') }} className="tficolorbg-button btn btn-info btn-sm m-r-5">Add School Admin{' '}<i class="fas fa-plus"></i></button>
      <ReactTable pageCount={100}
        list={schoolAdmin}
        filterable
        defaultFilterMethod={(filter, row) => {
          let f = filter.value.toLowerCase();
          const id = filter.pivotId || filter.id
          return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(f) : true
        }}
        data={schoolAdmin}
        columns={[{
          Header: '',
          columns:
            [
              {
                Header: 'Username',
                id: 'fname',
                accessor: d => d.username,
              },
              {
                Header: 'Password',
                id: 'lname',
                accessor: d => d.password,
              },
              // {
              //   Header: 'Position',
              //   id: 'password',
              //   accessor: d => d.positionID,
              //   Cell: row => (
              //     <div className="d-flex justify-content-center align-items-center">
              //       {row.original.positionID}
              //     </div>
              //   )
              // },
              {
                Header: 'Actions',
                id: 'edit',
                accessor: d => d.id,
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    <button
                      onClick={() => {
                        handleClickEdit(row.original);
                        setFormType('Edit');
                      }
                      }
                      className="btn btn-info btn-sm m-r-5" >
                      <i class="fas fa-edit" />
                    </button>
                    <button onClick={() => handleClickDelete(row.original.id)} className="btn btn-danger btn-sm m-r-5">
                      <i class="fas fa-trash" />
                    </button>
                  </div>
                )
              }
            ]
        }]}
        csv edited={schoolAdmin} defaultPageSize={10} className="-highlight"
      />
      <SweetAlert
        showCancel
        show={deleteNotify}
        onConfirm={() => handleDeleteSchoolAdmin()}
        confirmBtnText="Delete"
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="error"
        title="Are you sure?"
        onCancel={() => setDeleteNotify(false)}
      >
        You will not be able to recover this data!
      </SweetAlert>
      <Modal size="lg" show={showUploadModal} onHide={() => setShowUploadModal(false)} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Upload Teachers
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleUploadFile(e)} >
            <Form.Group className="mb-3">
              <Form.Control type="file" accept=".xls,.xlsx," onChange={(e) => handleGetUploadedFile(e.target.files[0])} />
            </Form.Group>
            <p>.xslx</p>
            <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit'>Upload</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      {form()}
    </>
  )
}

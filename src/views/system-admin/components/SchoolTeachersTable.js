import React, { useEffect, useState } from 'react'
import { Col, Row, Modal, Form, Button, InputGroup } from 'react-bootstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import SchoolAPI from '../../../api/SchoolAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from "react-toastify";
import moment from "moment"

export default function TeachersList() {

  const [teachers, setTeachers] = useState([]);
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
  const [teacherId, setTeacherId] = useState('');
  const [positionID, setPositionID] = useState('');
  const [userAccountID, setUserAccountID] = useState('')
  const [formType, setFormType] = useState('Edit');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    handleGetAllTeachers()
  }, [])

  const handleDeleteTeacher = async () => {
    let response = await new SchoolAPI().deleteTeacher(toDeleteId);
    if (response.ok) {
      toast.success("Teacher deleted successfully")
      handleGetAllTeachers();
    } else {
      toast.error("Something went wrong while deleting teacher.")
    }
    setDeleteNotify(false);
  }

  const handleGetAllTeachers = async () => {
    let response = await new SchoolAPI().getTeachersList();
    if (response.ok) {
      setTeachers(response.data)
      console.log(response.data, '=======')
    } else {
      toast.error("Something went wrong while fetching exam information")
    }
    console.log(response)
  }

  const handleChangePassword = async () => {
    let data = {
      currentPassword: currentPass,
      newPassword: newPass
    }
    let response = await new SchoolAPI().changePassword(toChangePassId, data);
    if (response.ok) {
      console.log(response.data);
      setShowEditModal(false);
      toast.success("Password updated!")
      handleGetAllTeachers();
      setCurrentPass('');
      setNewPass('');
    } else {
      setCurrentPass('');
      setNewPass('');
      toast.error(response.data?.errorMessage ? response.data?.errorMessage : 'Something went wrong while changing password.')
    }
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
    // setLoading(true);
    let response = await new SchoolAPI().uploadTeacherList(filesToUpload)
    if (response.ok) {
      // setLoading(false);
      // getStudentEnrolled();
      handleGetAllTeachers()
      toast.success("Successfully uploaded the teacher list.")
    } else {
      // setLoading(false);
      toast.error("Something went wrong while uploading teacher list.")
    }
  }

  const handleRegisterTeacher = async () => {
    let data = {
      username,
      password,
      teacher: {
        employeeNo,
        prefix,
        fname,
        lname,
        middleInitial: mname,
        sex: gender,
        citizenship,
        status,
        permanentAddress,
        presentAddress,
        bday: birthdate === 'Invalid date' ? '' : birthdate,
        contactNo,
        emailAdd: email,
        emergencyContactNo: emergencyNo,
        positionID: 3,
      }
    }
    let response = await new SchoolAPI().registerTeacher(data)
    if (response?.ok) {
      handleGetAllTeachers();
      clearState();
      toast.success("Successfully registered the teacher");
      setShowEditModal(false);
    } else {
      toast.error(response?.data?.errorMessage);
    }
  }

  const handleClickDelete = (id) => {
    setToDeleteId(id);
    setDeleteNotify(true)
  }

  const form = () => {
    return (
      formType == 'Edit' ? <Modal size="lg" show={showEditModal} onHide={() => { setShowEditModal(false); clearState(); }} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>Edit Profile</Modal.Header>
        <Modal.Body>
          <h3><label className="control-label">Personal Information </label></h3>
          <label className="control-label">Name</label>
          <div className="row row-space-10">
            <div className="col-md-2 m-b-15">
              <InputGroup className="mb-4">
                <Form.Control type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="Prefix" />
              </InputGroup>
            </div>
            <div className="col-md-4 m-b-15">
              <InputGroup className="mb-4">
                <Form.Control type="text" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="First name" />
              </InputGroup>
            </div>
            <div className="col-md-4 m-b-15">
              <InputGroup className="mb-4">
                <Form.Control type="text" value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Last name" />
              </InputGroup>
            </div>
            <div className="col-md-2 m-b-15">
              <InputGroup className="mb-4">
                <Form.Control type="text" value={mname} onChange={(e) => setMname(e.target.value)} placeholder="Middle initial" />
              </InputGroup>
            </div>
          </div>
          <div className="row row-space-10">
            <div className="col-md-4 m-b-15">
              <Form.Group className="m-b-20">
                <Form.Label for="status">
                  Gender
                </Form.Label>
                <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Select Gender</option>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-4 m-b-15">
              <Form.Group className="m-b-20">
                <Form.Label for="status">
                  Birthdate
                </Form.Label>
                <InputGroup className="mb-4">
                  <Form.Control type="date" format='yyyy-MM-dd' value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                </InputGroup>
              </Form.Group>
            </div>
          </div>
          <div className="row row-space-10">
            <div className="col-md-4 m-b-15">
              <Form.Group className="m-b-20">
                <Form.Label for="status">
                  Citizenship
                </Form.Label>
                <InputGroup className="mb-4">
                  <Form.Control type="text" value={citizenship} onChange={(e) => setCitizenship(e.target.value)} placeholder='Citizenship' />
                </InputGroup>
              </Form.Group>
            </div>
            <div className="col-md-4 m-b-15">
              <Form.Group className="m-b-20">
                <Form.Label for="status">
                  Status
                </Form.Label>
                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option>Select status</option>
                  <option value='Single'>Single</option>
                  <option value='Married'>Married</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
          <hr />
          <h3><label className="control-label">Account Information </label></h3>
          <div className="row row-space-10">
            <div className="col-md-4 m-b-15">
              <Form.Group className="m-b-20">
                <Form.Label for="status">
                  Employee Number
                </Form.Label>
                <InputGroup className="mb-4">
                  <Form.Control type="text" value={employeeNo} onChange={(e) => setEmployeeNo(e.target.value)} placeholder="Employee No." />
                </InputGroup>
              </Form.Group>
            </div>
          </div>
          <hr />
          <h3><label className="control-label">Contact Information </label></h3>
          <div className="row row-space-10">
            <div className="col-md-4 m-b-15">
              <Form.Group className="m-b-20">
                <Form.Label for="status">
                  Permanent Addres
                </Form.Label>
                <InputGroup className="mb-4">
                  <Form.Control type="text" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} placeholder="Permamnent Address" />
                </InputGroup>
              </Form.Group>
            </div>
            <div className="col-md-4 m-b-15">
              <Form.Group className="m-b-20">
                <Form.Label for="status">
                  Present Addres
                </Form.Label>
                <InputGroup className="mb-4">
                  <Form.Control type="text" value={presentAddress} onChange={(e) => setPresentAddress(e.target.value)} placeholder="Present Address" />
                </InputGroup>
              </Form.Group>
            </div>
            <div className="col-md-4 m-b-15">
              <Form.Group className="m-b-20">
                <Form.Label for="status">
                  Contact Number
                </Form.Label>
                <InputGroup className="mb-4">
                  <Form.Control type="number" value={contactNo} onChange={(e) => setContactNo(e.target.value)} placeholder="Contact No." />
                </InputGroup>
              </Form.Group>
            </div>
          </div>
          <div className="row row-space-10">
            <div className="col-md-4 m-b-15">
              <Form.Group className="m-b-20">
                <Form.Label for="status">
                  Email Address
                </Form.Label>
                <InputGroup className="mb-4">
                  <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                </InputGroup>
              </Form.Group>
            </div>
            <div className="col-md-4 m-b-15">
              <Form.Group className="m-b-20">
                <Form.Label for="status">
                  Emergency Number
                </Form.Label>
                <InputGroup className="mb-4">
                  <Form.Control type="number" value={emergencyNo} onChange={(e) => setEmergencyNo(e.target.value)} placeholder="Emergency No." />
                </InputGroup>
              </Form.Group>
            </div>
          </div>
          <button className="btn float-right tficolorbg-button mb-4" onClick={() => handleSaveEdit()}>Save Edit</button>
          <button className="btn float-right btn-danger mb-4 m-r-10" onClick={() => setShowEditModal(false)}>Cancel</button>
        </Modal.Body>
      </Modal>
        :
        <Modal size="lg" show={showEditModal} onHide={() => setShowEditModal(false)} aria-labelledby="example-modal-sizes-title-lg">
          <Modal.Header className='class-modal-header' closeButton>Register Teacher</Modal.Header>
          <Modal.Body>
            <h3><label className="control-label">Personal Information </label></h3>
            <label className="control-label">Name</label>
            <div className="row row-space-10">
              <div className="col-md-2 m-b-15">
                <InputGroup className="mb-4">
                  <Form.Control type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="Prefix" />
                </InputGroup>
              </div>
              <div className="col-md-4 m-b-15">
                <InputGroup className="mb-4">
                  <Form.Control type="text" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="First name" />
                </InputGroup>
              </div>
              <div className="col-md-4 m-b-15">
                <InputGroup className="mb-4">
                  <Form.Control type="text" value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Last name" />
                </InputGroup>
              </div>
              <div className="col-md-2 m-b-15">
                <InputGroup className="mb-4">
                  <Form.Control type="text" value={mname} onChange={(e) => setMname(e.target.value)} placeholder="Middle initial" />
                </InputGroup>
              </div>
            </div>
            <div className="row row-space-10">
              <div className="col-md-4 m-b-15">
                <Form.Group className="m-b-20">
                  <Form.Label for="status">
                    Gender
                  </Form.Label>
                  <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4 m-b-15">
                <Form.Group className="m-b-20">
                  <Form.Label for="status">
                    Birthdate
                  </Form.Label>
                  <InputGroup className="mb-4">
                    <Form.Control type="date" format='yyyy-MM-dd' value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                  </InputGroup>
                </Form.Group>
              </div>
            </div>
            <div className="row row-space-10">
              <div className="col-md-4 m-b-15">
                <Form.Group className="m-b-20">
                  <Form.Label for="status">
                    Citizenship
                  </Form.Label>
                  <InputGroup className="mb-4">
                    <Form.Control type="text" value={citizenship} onChange={(e) => setCitizenship(e.target.value)} placeholder='Citizenship' />
                  </InputGroup>
                </Form.Group>
              </div>
              <div className="col-md-4 m-b-15">
                <Form.Group className="m-b-20">
                  <Form.Label for="status">
                    Status
                  </Form.Label>
                  <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option>Select status</option>
                    <option value='Single'>Single</option>
                    <option value='Married'>Married</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <hr />
            <h3><label className="control-label">Account Information </label></h3>
            <div className="row row-space-10">
              <div className="col-md-4 m-b-15">
                <Form.Group className="m-b-20">
                  <Form.Label for="status">
                    Employee Number
                  </Form.Label>
                  <InputGroup className="mb-4">
                    <Form.Control type="number" value={employeeNo} onChange={(e) => setEmployeeNo(e.target.value)} placeholder="Employee No." />
                  </InputGroup>
                </Form.Group>
              </div>
              <div className="col-md-4 m-b-15">
                <Form.Group className="m-b-20">
                  <Form.Label for="status">
                    Username
                  </Form.Label>
                  <InputGroup className="mb-4">
                    <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                  </InputGroup>
                </Form.Group>
              </div>
              <div className="col-md-4 m-b-15">
                <Form.Group className="m-b-20">
                  <Form.Label for="status">
                    Password
                  </Form.Label>
                  <InputGroup className="mb-4">
                    <Form.Control type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                  </InputGroup>
                </Form.Group>
              </div>
            </div>
            <hr />
            <h3><label className="control-label">Contact Information </label></h3>
            <div className="row row-space-10">
              <div className="col-md-4 m-b-15">
                <Form.Group className="m-b-20">
                  <Form.Label for="status">
                    Permanent Addres
                  </Form.Label>
                  <InputGroup className="mb-4">
                    <Form.Control type="text" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} placeholder="Permamnent Address" />
                  </InputGroup>
                </Form.Group>
              </div>
              <div className="col-md-4 m-b-15">
                <Form.Group className="m-b-20">
                  <Form.Label for="status">
                    Present Addres
                  </Form.Label>
                  <InputGroup className="mb-4">
                    <Form.Control type="text" value={presentAddress} onChange={(e) => setPresentAddress(e.target.value)} placeholder="Present Address" />
                  </InputGroup>
                </Form.Group>
              </div>
              <div className="col-md-4 m-b-15">
                <Form.Group className="m-b-20">
                  <Form.Label for="status">
                    Contact Number
                  </Form.Label>
                  <InputGroup className="mb-4">
                    <Form.Control type="number" value={contactNo} onChange={(e) => setContactNo(e.target.value)} placeholder="Contact No." />
                  </InputGroup>
                </Form.Group>
              </div>
            </div>
            <div className="row row-space-10">
              <div className="col-md-4 m-b-15">
                <Form.Group className="m-b-20">
                  <Form.Label for="status">
                    Email Address
                  </Form.Label>
                  <InputGroup className="mb-4">
                    <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                  </InputGroup>
                </Form.Group>
              </div>
              <div className="col-md-4 m-b-15">
                <Form.Group className="m-b-20">
                  <Form.Label for="status">
                    Emergency Number
                  </Form.Label>
                  <InputGroup className="mb-4">
                    <Form.Control type="number" value={emergencyNo} onChange={(e) => setEmergencyNo(e.target.value)} placeholder="Emergency No." />
                  </InputGroup>
                </Form.Group>
              </div>
            </div>
            <button className="btn float-right tficolorbg-button mb-4" onClick={() => handleRegisterTeacher()}>Register</button>
            <button className="btn float-right btn-danger mb-4 m-r-10" onClick={() => setShowEditModal(false)}>Cancel</button>
          </Modal.Body>
        </Modal>
    )
  }

  const handleSaveEdit = async () => {
    let data = {
      "id": teacherId,
      "employeeNo": employeeNo,
      "prefixName": prefix,
      fname,
      lname,
      "middleInitial": mname,
      "sex": gender,
      "citizenship": citizenship,
      status,
      permanentAddress,
      presentAddress,
      "bday": birthdate,
      contactNo,
      "emailAdd": email,
      "emergencyContactNo": emergencyNo,
      "positionID": positionID,
      "userAccountID": userAccountID,
    }
    // setLoading(true);
    let response = await new SchoolAPI().updateTeacherInfo(teacherId, data)
    if (response.ok) {
      // setLoading(false);
      // getStudentEnrolled();
      setShowEditModal(false);
      handleGetAllTeachers()
      toast.success("Successfully updated the teacher information.");
      setPrefix('')
      setFname('');
      setLname('');
      setMname('');
      setGender('');
      setBirthdate('');
      setCitizenship('');
      setStatus('');
      setEmployeeNo('');
      setPermanentAddress('');
      setPresentAddress('');
      setContactNo('');
      setEmail('');
      setEmergencyNo('');
      setTeacherId('');
      setPositionID('');
      setUserAccountID('');
    } else {
      // setLoading(false);
      toast.error(response?.data?.errorMessage);
    }
  }

  const handleClickEdit = (data) => {
    let date = moment(data.bday).format('YYYY-MM-DD');
    setPrefix(data.prefixName)
    setFname(data.fname);
    setLname(data.lname);
    setMname(data.middleInitial);
    setGender(data.sex);
    setBirthdate(date);
    setCitizenship(data.citizenship);
    setStatus(data.status);
    setEmployeeNo(data.employeeNo);
    setPermanentAddress(data.permanentAddress);
    setPresentAddress(data.presetAddress);
    setContactNo(data.contactNo);
    setEmail(data.email);
    setEmergencyNo(data.emergencyContactNo);
    setTeacherId(data.id);
    setPositionID(data.positionID);
    setUserAccountID(data.userAccountID);
    setShowEditModal(true);
  }

  const clearState = () => {
    setFname('');
    setLname('');
    setMname('');
    setGender('');
    setCitizenship('');
    setStatus('');
    setPermanentAddress('');
    setPresentAddress('');
    setBirthdate('');
    setContactNo('');
    setEmail('');
    setEmergencyNo('');
    setEmergencyNo('');
    setUserAccountID('');
    setPrefix('');
    setEmployeeNo('');
    setUsername('');
    setPassword('');
  };

  return (
    <>
      <span className='m-t-5'>Teachers List</span>|{' '}
      <button onClick={() => { setShowEditModal('Register'); setFormType('Register') }} className="tficolorbg-button btn btn-info btn-sm m-r-5">Register Teacher{' '}<i class="fas fa-plus"></i></button>|{' '}
      <button onClick={() => setShowUploadModal(true)} className="tficolorbg-button btn btn-info btn-sm m-r-5">Upload Teachers{' '}<i class="fas fa-plus"></i></button>
      <ReactTable pageCount={100}
        list={teachers}
        filterable
        data={teachers}
        columns={[{
          Header: '',
          columns:
            [
              {
                Header: 'Firstname',
                id: 'fname',
                accessor: d => d.fname,
              },
              {
                Header: 'Lastname',
                id: 'lname',
                accessor: d => d.lname,
              },
              {
                Header: 'Position',
                id: 'password',
                accessor: d => d.positionID,
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    {row.original.positionID}
                  </div>
                )
              },
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
        csv edited={teachers} defaultPageSize={10} className="-highlight"
      />
      <SweetAlert
        showCancel
        show={deleteNotify}
        onConfirm={() => handleDeleteTeacher()}
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

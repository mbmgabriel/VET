import React, { useEffect, useState } from 'react'
import { Col, Row, Modal, Form, Button, InputGroup } from 'react-bootstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import SchoolAPI from '../../../api/SchoolAPI';
import GradeAPI from '../../../api/GradeAPI'

import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from "react-toastify";
import moment from "moment"

export default function StudentsList() {

  const [Students, setStudents] = useState([]);
  const [deleteNotify, setDeleteNotify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toDeleteId, setToDeleteId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [toChangePassId, setToChangePassId] = useState('');
  const [filesToUpload, setFilesToUpload] = useState({});

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [studentNo, setStudentNo] = useState('');
  const [studentId, setStudentId] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('')
  const [mname, setMname] = useState('')
  const [gender, setGender] = useState('')
  const [citizenship, setCitizenship] = useState('');
  const [status, setStatus] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');
  // const [employeeNo, setEmployeeNo] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [motherFname, setMotherFname] = useState('');
  const [motherLname, setMotherLname] = useState('');
  const [fatherFname, setFatherFname] = useState('');
  const [fatherLname, setFatherLname] = useState('');
  const [emergencyNo, setEmergencyNo] = useState('');
  const [userAccountID, setUserAccountID] = useState('')

  const [formType, setFormType] = useState('Edit')
  const [gradeLevelId, setGetGradeLevel] = useState('')
  const [grade, setGrade] = useState([])

  useEffect(() => {
    handleGetAllStudents();
    getGrade();
  }, [])

  const handleDeleteStudent = async () => {
    let response = await new SchoolAPI().deleteStudent(toDeleteId);
    if (response.ok) {
      toast.success("Student deleted successfully")
      handleGetAllStudents();
    } else {
      toast.error("Something went wrong while deleting Student.")
    }
    setDeleteNotify(false);
  }

  const handleGetAllStudents = async () => {
    let response = await new SchoolAPI().getStudentsList();
    if (response.ok) {
      // setStudents(response.data)
      // console.log(response.data, '=======')
      handleGetAllStudentsAccounts(response.data);
    } else {
      toast.error("Something went wrong while fetching exam information")
    }
    console.log(response)
  }

  const handleGetAllStudentsAccounts = async(data) => {
    let response = await new SchoolAPI().getAllStudents();
    if(response.ok){
      let temp =response.data;
      const tempList = data.map(t1 => ({...t1, ...temp.find(t2 => t2.id === t1.userAccountID), id: t1.id}))
      // console.log(response.data, '=======', data, '===', tempList )
      setStudents(tempList)
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
    // setLoading(true);
    let response = await new SchoolAPI().uploadStudentList(filesToUpload)
    if (response.ok) {
      // setLoading(false);
      // getStudentEnrolled();
      handleGetAllStudents()
      toast.success("Successfully uploaded the Student list.")
    } else {
      // setLoading(false);
      toast.error("Something went wrong while uploading Student list.")
    }
  }

  const handleClickDelete = (id) => {
    setToDeleteId(id);
    setDeleteNotify(true)
  }

  const clearState = () => {
    setStudentNo('');
    setStudentId('');
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
    setMotherFname('');
    setMotherLname('');
    setFatherFname('');
    setFatherLname('');
    setEmergencyNo('');
    setEmergencyNo('');
    setUserAccountID('');
    setGetGradeLevel(null);
  }

  const getGrade = async() =>{
    let response = await new GradeAPI().getGrade()
    if(response.ok){
      setGrade(response.data)
    }else{
      alert("Something went wrong while fetching all Grade")
    }
  }

  const form = () => {
    return (
      <Modal size="lg" show={showEditModal} onHide={() => { setShowEditModal(false); clearState(); }} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>{formType === 'Edit' ? 'Edit Profile' : 'Register Student'}</Modal.Header>
        <Modal.Body>
          <h3><label className="control-label">Personal Information </label></h3>
          <label className="control-label">Name</label>
          <div className="row row-space-10">
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
          <label className="control-label">Mother's Name</label>
          <div className="row row-space-10">
            <div className="col-md-4 m-b-15">
              <InputGroup className="mb-4">
                <Form.Control type="text" value={motherFname} onChange={(e) => setMotherFname(e.target.value)} placeholder="Mother's First name" />
              </InputGroup>
            </div>
            <div className="col-md-4 m-b-15">
              <InputGroup className="mb-4">
                <Form.Control type="text" value={motherLname} onChange={(e) => setMotherLname(e.target.value)} placeholder="Mother's Last name" />
              </InputGroup>
            </div>
          </div>
          <label className="control-label">Fathe's Name</label>
          <div className="row row-space-10">
            <div className="col-md-4 m-b-15">
              <InputGroup className="mb-4">
                <Form.Control type="text" value={fatherFname} onChange={(e) => setFatherFname(e.target.value)} placeholder="Father's First name" />
              </InputGroup>
            </div>
            <div className="col-md-4 m-b-15">
              <InputGroup className="mb-4">
                <Form.Control type="text" value={fatherLname} onChange={(e) => setFatherLname(e.target.value)} placeholder="Father's Last name" />
              </InputGroup>
            </div>
          </div>
          <hr />
          <h3><label className="control-label">Account Information </label></h3>
          <div className="row row-space-10">
            <div className="col-md-4 m-b-15">
              <Form.Group className="m-b-20">
                <Form.Label for="status">
                  Student Number
                </Form.Label>
                <InputGroup className="mb-4">
                  <Form.Control type="number" value={studentNo} onChange={(e) => setStudentNo(e.target.value)} placeholder="Student No." />
                </InputGroup>
              </Form.Group>
            </div>
            <div className="col-md-4 m-b-15">
                <Form.Group className="mb-3">
                  <Form.Label>Grade Level</Form.Label>
                    <Form.Select value={gradeLevelId} onChange={(e) => setGetGradeLevel(e.target.value)}>
                      <option value={''}>Select Grade Level</option>
                      {grade.map(item =>{
                        return(<option value={item.id}>{item.gradeName}</option>)
                        })
                      }
                  </Form.Select>
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
          {
            formType === 'Edit' ? 
            <button className="btn float-right tficolorbg-button mb-4" onClick={() => handleSaveEdit()}>Save Edit</button>
            :
            <button className="btn float-right tficolorbg-button mb-4" onClick={() => handleRegisterStudent()}>Register</button>
          }
          <button className="btn float-right btn-danger mb-4 m-r-10" onClick={() => setShowEditModal(false)}>Cancel</button>
        </Modal.Body>
      </Modal>
    )
  }

  const handleSaveEdit = async () => {
    console.log(birthdate);
    let data = {
      "id": studentId,
      studentNo,
      fname,
      lname,
      mname,
      "sex": gender,
      citizenship,
      status,
      permanentAddress,
      presentAddress,
      "bday": birthdate == 'Invalid date' ? '' : birthdate,
      contactNo,
      "emailAdd": email,
      mothersFname: motherFname,
      mothersLname: motherLname,
      fathersFname: fatherFname,
      fathersLname: fatherLname,
      gradeLevelId,
      "emergencyContactNo": emergencyNo,
      "userAccountID": userAccountID,
    }
    let response = await new SchoolAPI().updateStudentInfo(studentId, data)
    if (response.ok) {
      handleGetAllStudents()
      toast.success("Successfully updated the student information.");
      setStudentId('')
      setStudentNo('')
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
      setMotherFname('');
      setMotherLname('');
      setFatherFname('');
      setFatherLname('');
      setEmergencyNo('');
      setUserAccountID('');
      setShowEditModal(false);
      setGetGradeLevel('');
    } else {
      // setLoading(false);
      toast.error(response?.data?.errorMessage);
    }
  }

  const handleRegisterStudent = async () => {
    let data = {
      username,
      password,
      student: {
        studentNo,
        fname,
        lname,
        mname,
        sex: gender,
        citizenship,
        status,
        permanentAddress,
        presentAddress,
        bday: birthdate === 'Invalid date' ? '' : birthdate,
        contactNo,
        emailAdd: email,
        gradeLevelId,
        mothersFname: motherFname,
        mothersLname: motherLname,
        fathersFname: fatherFname,
        fathersLname: fatherLname,
        emergencyContactNo: emergencyNo,
      }
    }
    let response = await new SchoolAPI().registerStudent(data);
    if (response.ok) {
      handleGetAllStudents()
      toast.success("Successfully registered the student.");
      clearState();
      setShowEditModal(false);
    } else {
      toast.error(response.data.errorMessage)
    }
  }

  const handleClickEdit = (data) => {
    console.log(data);
    let date = moment(data.bday).format('YYYY-MM-DD');
    setStudentId(data.id)
    setStudentNo(data.studentNo);
    setFname(data.fname);
    setLname(data.lname);
    setMname(data.mname);
    setGender(data.sex);
    setCitizenship(data.citizenship);
    setStatus(data.status);
    setPermanentAddress(data.permanentAddress);
    setPresentAddress(data.presentAddress);
    setBirthdate(date);
    setContactNo(data.contactNo);
    setEmail(data.emailAdd);
    setMotherFname(data.mothersFname);
    setMotherLname(data.mothersLname);
    setFatherFname(data.fathersFname);
    setFatherLname(data.fathersLName);
    setEmergencyNo(data.emergencyContactNo);
    setUserAccountID(data.userAccountID);
    setGetGradeLevel(data.gradeLevelId);
    setShowEditModal(true);
  }

  return (
    <>
      <span className='m-t-5'>Students List</span> |{' '}
      <button onClick={() => { setShowEditModal('Register'); setFormType('Register') }} className="tficolorbg-button btn btn-info btn-sm m-r-5">Register Students{' '}<i class="fas fa-plus"></i></button>|{' '}
      <button onClick={() => setShowUploadModal(true)} className="tficolorbg-button btn btn-info btn-sm m-r-5">Upload Students{' '}<i class="fas fa-plus"></i></button> | {' '}
      <input type="checkbox" id={'cboxspassword'} name={'cboxspassword'} checked={showPassword} onChange={() => setShowPassword(!showPassword) } />{' '}<label className="form-check-label" for={'cboxspassword'}>Show passwords</label>
      <ReactTable pageCount={100}
        list={Students} 
        filterable
        defaultFilterMethod={(filter, row) => {
          let f = filter.value.toLowerCase();
          const id = filter.pivotId || filter.id
          return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(f) : true
        }}
        data={Students}
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
                Header: 'Username',
                id: 'username',
                accessor: d => d.username,
              },
              {
                Header: 'Password',
                id: 'password',
                accessor: 
                showPassword ?
                d => <input type="text" className="form-control form-control-lg font-16" placeholder="Password" name="password" value={d.password} required disabled />
                :
                d => <input type="password" className="form-control form-control-lg font-16" placeholder="Password" name="password" value={d.password} required disabled />
              },
              {
                Header: 'Actions',
                id: 'edit',
                accessor: d => d.id,
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    <button onClick={() => {
                      handleClickEdit(row.original);
                      setFormType('Edit')
                    }}
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
        csv edited={Students} defaultPageSize={10} className="-highlight"
      />
      <SweetAlert
        showCancel
        show={deleteNotify}
        onConfirm={() => handleDeleteStudent()}
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
            Upload Students
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

import React, { useEffect, useState } from 'react'
import { Col, Row, Modal} from 'react-bootstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import SchoolAPI from '../../../api/SchoolAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from "react-toastify";

export default function StudentsTable() {

  const [teachers, setTeachers ] = useState([]);
  const [ resetNotify, setResetNotify ] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toResetId, setToResetId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [toChangePassId, setToChangePassId] =  useState('');
  
	useEffect(() => {
    handleGetAllTeachers()
  }, [])

  const handleResetPassword = async() => {
    let response = await new SchoolAPI().resetDefaultPassword(toResetId);
    if(response.ok){
      toast.success("Password reset!")
      handleGetAllTeachers();
    }else{
      toast.error("Something went wrong while reseting teacher's password.")
    }
    setResetNotify(false);
  }

  const handleClikedReset = (id) => {
    console.log(id)
    setResetNotify(true);
    setToResetId(id)
  }

  const handleGetAllTeachers = async() => {
    let response = await new SchoolAPI().getAllStudents();
    if(response.ok){
      setTeachers(response.data)
      console.log(response.data)
    }else{
      toast.error("Something went wrong while fetching exam information")
    }
    console.log(response)
  }

  const handleChangePassword = async() => {
    let data = {
      currentPassword: currentPass,
      newPassword: newPass
    }
    let response = await new SchoolAPI().changePassword(toChangePassId, data);
    if(response.ok){
      console.log(response.data);
      setShowEditModal(false);
      toast.success("Password updated!")
      handleGetAllTeachers();
      setCurrentPass('');
      setNewPass('');
      setShowEditModal(false);
    }else{
      setCurrentPass('');
      setNewPass('');
      toast.error(response.data?.errorMessage ? response.data?.errorMessage : 'Something went wrong while changing password.')
    }
  }

  const handleClickedit = (id) => {
    setShowEditModal(true);
    setToChangePassId(id)
  }

  const handleCloseModal = () => {
    setShowEditModal(false);
    setCurrentPass('');
    setNewPass('');
  }

  return (
    <>
      <span className='m-t-5'>Students List</span> | <input type="checkbox" id={'cboxspassword'} name={'cboxspassword'} checked={showPassword} onChange={() => setShowPassword(!showPassword) } />
      <label className="form-check-label" for={'cboxspassword'} >Show passwords</label>
      <ReactTable pageCount={100}
        list={teachers}
        filterable
        data={teachers}
        columns={[{
          Header: '',
          columns:
          [
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
                <div className="">
                  <button onClick={() => handleClickedit(row.original.id)} className="btn btn-info btn-sm m-r-5" >
                    Change Password
                  </button>
                  <button onClick={() => handleClikedReset(row.original.id)} className="btn btn-warning btn-sm m-r-5">
                    Reset Password
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
        show={resetNotify} 
        onConfirm={()=> handleResetPassword()}
        confirmBtnText="Yes, Reset password!"
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="error"
        title="Are you sure?"
        onCancel={() => setResetNotify(false)}
      >
        Are you sure? resetting this password!
      </SweetAlert>

      <Modal show={showEditModal} onHide={() => handleCloseModal()}>
        <Modal.Header className="font-10" closeButton><span className='font-20'>Edit Password</span></Modal.Header>
        <Modal.Body>
          <div className="col-md-12 m-b-15">
            <label className="control-label">Current Password <span className="text-danger">*</span></label>
            <input type="text" size="30" className="form-control" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} placeholder="Current Password" name="currentPassword" required="" />
          </div>
          <div className="col-md-12 m-b-15">
            <label className="control-label">New Password <span className="text-danger">*</span></label>
            <input type="text" size="30" className="form-control" value={newPass}  onChange={(e) => setNewPass(e.target.value)} placeholder="New Password" name="newPassword" required="" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => handleChangePassword()} className="btn btn-sm btn-success">Save</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

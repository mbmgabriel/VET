import React, { useEffect, useState } from 'react'
import { Col, Row, Modal, Form, Button, InputGroup, FormControl} from 'react-bootstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import SchoolAPI from '../../../api/SchoolAPI';
import CoursesAPI from '../../../api/CoursesAPI';
import MirandaAPI from '../../../api/MirandaAPI';
import SubjectAreaAPI from '../../../api/SubjectAreaAPI';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from "react-toastify";
import moment from "moment"
import MainContainer from '../../../components/layouts/MainContainer';


export default function MirandaAccounts() {

  const [mirandaAccounts, setMirandaAccounts ] = useState([]);
  const [ deleteNotify, setDeleteNotify ] = useState(false);
  const [toDeleteId, setToDeleteId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [connectionCode, setConnectionCode] = useState('');
  const [room, setRoom] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [filesToUpload, setFilesToUpload] = useState({});

  useEffect(() => {
    getAccounts()
  }, [])

  const handleDeleteAccount = async() => {
    let response = await new CoursesAPI().deleteCourse(selectedId);
    if(response.ok){
      toast.success("Course deleted successfully")
      getAccounts();
    }else{
      toast.error("Something went wrong while deleting course.")
    }
    setDeleteNotify(false);
  }


  const getAccounts = async() => {
    setLoading(true);
    let response = await new MirandaAPI().fetchMirandaAccounts();
    if(response.ok){
      setMirandaAccounts(response.data)
    }else{
      toast.error("Something went wrong while fetching exam information")
    }
    setLoading(false);
  }

  const handleEditModal = () => {
    return(
      <Modal size="lg" className="modal-all" show={showEditModal} onHide={()=> setShowEditModal(!showEditModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit Account
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveEditAccount}>
							<Form.Group className="m-b-20">
								<Form.Label for="courseName">
									Username
								</Form.Label>
								<FormControl defaultValue={username} 
									className="custom-input" 
									size="lg" 
									type="text"
									onChange={(e) => setUsername(e.target.value)}
								/>
							</Form.Group>
							<Form.Group className="m-b-20">
								<Form.Label for="description">
									Password
								</Form.Label>
								<FormControl defaultValue={password} 
									className="custom-input" 
									size="lg" 
									type="text"
									onChange={(e) => setPassword(e.target.value)}
								/>
							</Form.Group>
              <Form.Group className="m-b-20">
								<Form.Label for="description">
									Connection Code
								</Form.Label>
								<FormControl defaultValue={connectionCode} 
									className="custom-input" 
									size="lg" 
									type="text"
									onChange={(e) => setConnectionCode(e.target.value)}
								/>
							</Form.Group>
              <Form.Group className="m-b-20">
								<Form.Label for="description">
									Room
								</Form.Label>
								<FormControl defaultValue={room} 
									className="custom-input" 
									size="lg" 
									type="text"
									onChange={(e) => setRoom(e.target.value)}
								/>
							</Form.Group>
              <span style={{float:"right"}}>
                <Button className="tficolorbg-button" type="submit" >
									Update Account
								</Button>
							</span>
						</Form>
					</Modal.Body>
			</Modal>
    )
  }

  const handleClickEdit = (data) => {
    setUsername(data.username);
    setPassword(data.password);
    setConnectionCode(data.connectionCode);
    setRoom(data.roomNumber);
    setSelectedId(data.id);
    setShowEditModal(true);
  }

  const handleClickDelete = (id) => {
    setToDeleteId(id);
    setDeleteNotify(true)
  }

  const saveEditAccount = async(e) => {
    e.preventDefault();
		if(username == '' || password == '' || connectionCode == '' || room == ''){
			toast.error('Please insert all the required fields', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				});
		}else{
      let data = {
        id: selectedId,
        username,
        password,
        connectionCode,
        roomNumber: room
      }
      let response = await new MirandaAPI().updateMirandaAccounts(selectedId, data);
			if(response.ok){
        toast.success('Account updated successfully.');
				getAccounts();
				setShowEditModal(false);
        setUsername('');
        setPassword('');
        setConnectionCode('');
        setRoom('');
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
		}
  }

  const handleGetUploadedFile = (file) => {
    getBase64(file).then(
      data => {
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
    setShowUpload(false);
    // setLoading(true);
    let response = await new MirandaAPI().uploadAccounts(filesToUpload)
    if (response.ok) {
      // setLoading(false);
      // getStudentEnrolled();
      getAccounts()
      toast.success("Successfully uploaded the Student list.")
    } else {
      // setLoading(false);
      toast.error("Something went wrong while uploading Student list.")
    }
  }

  return (
    <MainContainer title="Dashboard" activeHeader={"miranda"} loading={loading}>
      <p/>
      <span className='font-24'>Miranda Accounts</span> |{' '}
      <button onClick={() => { setShowUpload('Register')}} className="tficolorbg-button btn btn-info btn-sm m-r-5 my-3">Add Miranda Account{' '}<i class="fas fa-plus"></i></button>
        <ReactTable pageCount={100}
          list={mirandaAccounts}
          filterable
          defaultFilterMethod={(filter, row) => {
            let f = filter.value.toLowerCase();
            const id = filter.pivotId || filter.id
            return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(f) : true
          }}
          data={mirandaAccounts}
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
                accessor: d => d.password,
              },
              {
                Header: 'Connection Code',
                id: 'connectionCode',
                accessor: d => d.connectionCode,
              },
              {
                Header: 'Room',
                id: 'room',
                accessor: d => d.roomNumber,
              },
              {
                Header: 'Actions',
                id: 'edit',
                accessor: d => d.id,
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    <button onClick={() => handleClickEdit(row.original)} className="btn btn-info btn-sm m-r-5" >
                      <i class="fas fa-edit"/>
                    </button>
                    {/* <button onClick={() => handleClickDelete(row.original.id)} className="btn btn-danger btn-sm m-r-5">
                      <i class="fas fa-trash" />
                    </button> */}
                  </div>
                )
              }
            ]
          }]}
        csv edited={mirandaAccounts} defaultPageSize={10} className="-highlight" 
        />
        <Modal size="lg" show={showUpload} onHide={() => showUpload(false)} aria-labelledby="example-modal-sizes-title-lg">
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
        <SweetAlert 
          showCancel
          show={deleteNotify} 
          onConfirm={()=> handleDeleteAccount()}
          confirmBtnText="Delete"
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="error"
          title="Are you sure?"
          onCancel={() => setDeleteNotify(false)}
        >
          You will not be able to recover this data!
        </SweetAlert>
        {handleEditModal()}
    </MainContainer>
  )
}

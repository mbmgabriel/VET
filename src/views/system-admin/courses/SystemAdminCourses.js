import React, { useEffect, useState } from 'react'
import { Col, Row, Modal, Form, Button, InputGroup, FormControl} from 'react-bootstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import SchoolAPI from '../../../api/SchoolAPI';
import CoursesAPI from '../../../api/CoursesAPI';
import SubjectAreaAPI from '../../../api/SubjectAreaAPI';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from "react-toastify";
import moment from "moment"
import MainContainer from '../../../components/layouts/MainContainer';


export default function SystemAdminCourses() {

  const [teachers, setTeachers ] = useState([]);
  const [ deleteNotify, setDeleteNotify ] = useState(false);
  const [toDeleteId, setToDeleteId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [courseName, setCourseName] = useState('')
	const [description, setDescription] = useState('')
	const [subjectAreaId, setSubjectArea] = useState('')
	const [sarea, setSarea] = useState([])
	const [locked, setLockStatus]= useState(false);
  const [selectedCourse, setSelectedCourse] = useState({});
  
	useEffect(() => {
    viewSubjectArea()
    getCourses()
  }, [])

  const handleDeleteTeacher = async() => {
    let response = await new CoursesAPI().deleteCourse(toDeleteId);
    if(response.ok){
      toast.success("Course deleted successfully")
      getCourses();
    }else{
      toast.error("Something went wrong while deleting course.")
    }
    setDeleteNotify(false);
  }


  const getCourses = async() => {
    setLoading(true);
    let response = await new CoursesAPI().getCourses();
    if(response.ok){
      setTeachers(response.data)
    }else{
      toast.error("Something went wrong while fetching exam information")
    }
    setLoading(false);
  }

  const handleEditModal = () => {
    return(
      <Modal size="lg" className="modal-all" show={showEditModal} onHide={()=> setShowEditModal(!showEditModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit Course
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveEditCourse}>
							<Form.Group className="m-b-20">
								<Form.Label for="courseName">
									Course Name
								</Form.Label>
								<FormControl defaultValue={courseName} 
									className="custom-input" 
									size="lg" 
									type="text"
									onChange={(e) => setCourseName(e.target.value)}
								/>
							</Form.Group>
							<Form.Group className="m-b-20">
								<Form.Label for="description">
									Description
								</Form.Label>
								<FormControl defaultValue={description} 
									className="custom-input" 
									size="lg" 
									type="text"
									onChange={(e) => setDescription(e.target.value)}
								/>
							</Form.Group>
							<Form.Group className="m-b-20">
										<Form.Label for="subjectArea">
												Subject Area
										</Form.Label>
										<Form.Select size="lg" onChange={(e) => setSubjectArea(e.target.value)}>
											{
												sarea.map(item => {
													return(
														<option value={item.id} selected={selectedCourse?.subjectAreaId === item.id}>
															{item.subjectAreaName}
														</option>
													)
												})
											}
										</Form.Select>
								</Form.Group>
								<Form.Group className="m-b-20">
										<Form.Label for="status">
												Status
										</Form.Label>
										<Form.Select size="lg" onChange={(e) => setStatus(e.target.value)}>
											<option value={true} selected={selectedCourse?.status === true}>
												Active
											</option>
											<option value={false} selected={selectedCourse?.status === false}>
												Inactive
											</option>
										</Form.Select>
								</Form.Group>
							  <span style={{float:"right"}}>
								<Button className="tficolorbg-button" type="submit" >
									Update Course
								</Button>
							</span>
						</Form>
					</Modal.Body>
			</Modal>
    )
  }

  const handleClickEdit = (data) => {
    setSelectedCourse(data)
    setStatus(data.status);
    setCourseName(data.courseName);
    setDescription(data.description);
    setSubjectArea(data.subjectAreaId)
    setShowEditModal(true);
  }

  const viewSubjectArea = async() => {
    let response = await new SubjectAreaAPI().getSubjectArea()
    if(response.ok){
      setSarea(response.data)
			console.log(response.data)
    }else{
      toast.error("Something went wrong while fetching all subject area")
    }
  }

  const handleClickDelete = (id) => {
    setToDeleteId(id);
    setDeleteNotify(true)
  }

  const saveEditCourse = async(e) => {
    e.preventDefault();
		if(description == '' || courseName == '' || subjectAreaId == ''){
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
        courseName,
        description,
        status,
        subjectAreaId
      }
      let response = await new CoursesAPI().editCourse(selectedCourse.id, data);
			if(response.ok){
				getCourses();
				setShowEditModal(false);
        setSelectedCourse({});
        setStatus('');
        setCourseName('');
        setDescription('');
        setSubjectArea('')
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

  const handleUpdateStatus = async(data) => {
    console.log(data);
    let response = await new CoursesAPI().editCourse(data.id, {...data, status: !data.status});
    if(response.ok){
      getCourses();
      toast.success('Course status updated successfully.')
    }else{
      toast.error("Something went wrong while fetching exam information")
    }
  }

  return (
    <MainContainer title="Dashboard" activeHeader={"courses"} loading={loading}>
        <h3 className='m-b-20 m-t-20'>Course List</h3> 
        <ReactTable pageCount={100}
          list={teachers}
          filterable
          defaultFilterMethod={(filter, row) => {
            let f = filter.value.toLowerCase();
            const id = filter.pivotId || filter.id
            return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(f) : true
          }}
          data={teachers}
          columns={[{
            Header: '',
            columns:
            [
              {
                Header: 'Course Name',
                id: 'fname',
                accessor: d => d.courseName,
              },
              {
                Header: 'Author',
                id: 'lname',
                accessor: d => d.authorName,
              },
              {
                Header: 'Subject Area',
                id: 'subjectArea',
                accessor: d => d.subjectArea?.subjectAreaName,
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    {row.original.subjectArea?.subjectAreaName}
                  </div>
                )
              },
              {
                Header: 'Status',
                id: 'toggle',
                accessor: d => d.status ? 'Active' : 'Inactive',
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    <Form>
                      <Form.Check
                        disabled={loading}
                        checked={row.original.status ? true : false}
                        type="switch"
                        id="custom-switch"
                        label={row.original.status ? 'Active' : 'Inactive'}
                        onClick={() => handleUpdateStatus(row.original)}
                      />
                    </Form>
                  </div>
                )
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
        csv edited={teachers} defaultPageSize={10} className="-highlight" 
        />
        <SweetAlert 
          showCancel
          show={deleteNotify} 
          onConfirm={()=> handleDeleteTeacher()}
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

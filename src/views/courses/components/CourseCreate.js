import React, {useState, useEffect, useContext} from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { UserContext } from './../../../context/UserContext'
import { toast } from 'react-toastify';

export default function CourseCreate({getCourses, setCourse, openModal, setOpenModal}){

	const [loading, setLoading] = useState(false)
	const [courseName, setCourseName] = useState('')
	const [description, setDescription] = useState('')
	const [subjectAreaId, setSubjectArea] = useState('')
	const [sarea, setSarea] = useState([])
	const [status, setStatus] = useState('')
	const [locked, setLockStatus]= useState('')
	const userContext = useContext(UserContext)
  const {user} = userContext.data

	const handleCloseModal = e => {
    e.preventDefault()
    setOpenModal(false)
  }

	const viewSubjectArea = async() => {
    setLoading(true)
    let response = await new SubjectAreaAPI().getSubjectArea()
    setLoading(false)
    if(response.ok){
      setSarea(response.data)
			console.log(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
  }

	// const getCourses = async() => {
  //   setLoading(true)
  //   let response = await new CoursesAPI().getCourses()
  //   setLoading(false)
  //   if(response.ok){
  //     setCourse(response.data)
  //   }else{
  //     alert("Something went wrong while fetching all courses")
  //   }
  // }

	const saveCourse = async(e) => {
    e.preventDefault()
		if(description === ''){
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
			setLoading(true)
			let isTechFactors = user.role !== "Teacher" && true
			let response = await new CoursesAPI().createCourse(
				{courseName, description, subjectAreaId, status, locked, isTechFactors}
			)
			if(response.ok){
			successSave()
			handleCloseModal(e)
			setCourseName('')
			setDescription('')
			setSubjectArea('')
			setStatus('')
			setLockStatus('')
			getCourses()
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
			setLoading(false)
		}
  }

	useEffect(() => {
    viewSubjectArea()
  }, [])

	const successSave = () => {
		toast.success('Successfully created course', {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			});

	}

	return (
		<div>
			
			<Modal size="lg" className="modal-all" show={openModal} onHide={()=> setOpenModal(!openModal)} >
				<Modal.Header className="modal-header" closeButton>
				Create Course 
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveCourse}>
						<Form.Group className="m-b-20">
										<Form.Label for="subjectArea">
												Subject Area
										</Form.Label>
										<Form.Select size="lg" onChange={(e) => setSubjectArea(e.target.value)}>
											<option>
											Select subject area...
											</option>
											{
												sarea.map(item => {
													return(
														<option value={item.id}>
															{item.subjectAreaName}
														</option>
													)
												})
											}
										</Form.Select>
								</Form.Group>
								{' '}
								
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Course Name
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter course name here"
                      onChange={(e) => setCourseName(e.target.value)}
                    />
								</Form.Group>
								{' '}

								<Form.Group className="m-b-20">
										<Form.Label for="description">
										Course Description
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter course description here"
                      onChange={(e) => setDescription(e.target.value)}
                    />
								</Form.Group>
								{' '}

								<Form.Group className="m-b-20">
										<Form.Label for="status">
												Status
										</Form.Label>
										<Form.Select size="lg" onChange={(e) => setStatus(e.target.value)}>
											<option>
												Select status here...
											</option>
											<option value={true}>
												Active
											</option>
											<option value={false}> 
												Inactive
											</option>
										</Form.Select>
								</Form.Group>
								{' '}

								<Form.Group className="m-b-20">
										<Form.Label for="lock">
												Lock Status
										</Form.Label>
										<Form.Select size="lg" onChange={(e) => setLockStatus(e.target.value)}>
											<option>
											Select lock status here...
											</option>
											<option value={true}>
												Locked
											</option>
											<option value={false}> 
												Unlocked
											</option>
										</Form.Select>
								</Form.Group>
								{' '}

								<span style={{float:"right"}}>
										<Button className="tficolorbg-button" type="submit">
												Save
										</Button>
								</span>
						</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}
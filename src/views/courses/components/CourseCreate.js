import React, {useState, useEffect, useContext} from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { UserContext } from './../../../context/UserContext'
import { toast } from 'react-toastify';
import GradeAPI from '../../../api/GradeAPI';

export default function CourseCreate({getCourses, setCourse, openModal, setOpenModal}){

	const [loading, setLoading] = useState(false)
	const [courseName, setCourseName] = useState('')
	const [description, setDescription] = useState('')
	const [subjectAreaId, setSubjectArea] = useState('')
	const [sarea, setSarea] = useState([])
	const [status, setStatus] = useState('')
	const [locked, setLockStatus]= useState(false)
	const userContext = useContext(UserContext)
	const [validated, setValidated] = useState(false);
	const [grade, setGrade] = useState([])
	const [gradeLevelid, setGradeLevelId] = useState('')
  const {user} = userContext.data

	const handleCloseModal = e => {
    e.preventDefault()
    setOpenModal(false)
		setValidated(false)
  }

	const getGradeLevel = async () =>{
		let response = await new GradeAPI().getGrade()
		if(response.ok){
			setGrade(response.data)
			console.log('GradeLevel:', response.data)
		}else{
			alert(response.data.errorMessage)
		}
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
		e.preventDefault();
		const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);

		if(description === '' || gradeLevelid === ''){
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
				{courseName, description, subjectAreaId, status, locked, gradeLevelid, isTechFactors}
			)
			if(response.ok){
			successSave()
			handleCloseModal(e)
			setCourseName('')
			setDescription('')
			setSubjectArea('')
			setStatus('')
			setGradeLevelId('')
			setLockStatus(false)
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
		getGradeLevel()
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

	const closeModal = () => {
		setOpenModal(false)
		setValidated(false)
	}

	return (
		<div>
			
			<Modal size="lg" className="modal-all" show={openModal} onHide={()=> closeModal()} >
				<Modal.Header className="modal-header" closeButton>
				Create Course 
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form noValidate validated={validated} onSubmit={saveCourse}>
						<Form.Group controlId="validationCustom01" className="m-b-20">
										<Form.Label for="subjectArea">
												Subject Area
										</Form.Label>
										<Form.Select  required size="lg" onChange={(e) => setSubjectArea(e.target.value)}>
											<option value={''}>
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
								<Form.Group className="mb-3">
            <Form.Label>Grade Level</Form.Label>
              <Form.Select required size="lg"  onChange={(e) => setGradeLevelId(e.target.value)}>
                <option value={''}>-- Select Grade Level Here --</option>
                {grade.map(item =>{
                    return(<option value={item.id}>{item.gradeName}</option>)
                    })
                  }
              </Form.Select>
            </Form.Group>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Course Name
										</Form.Label>
										<Form.Control 
											required
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
											required
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
										<Form.Select required size="lg" onChange={(e) => setStatus(e.target.value)}>
											<option value={''}>
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

								{/* <Form.Group className="m-b-20">
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
								</Form.Group> */}
								{' '}

								<span style={{float:"right"}}>
										<Button className="tficolorbg-button" type="submit">
												Save Course
										</Button>
								</span>
						</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}
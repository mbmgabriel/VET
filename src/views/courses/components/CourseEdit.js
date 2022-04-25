import React, { useState, useEffect } from "react";
import { Button, Form, FormControl, Modal } from 'react-bootstrap';
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import CoursesAPI from "../../../api/CoursesAPI";
import { toast } from 'react-toastify';

export default function CourseEdit({getCourses, setCourse, openEditModal, setOpenEditModal, selectedCourse}){

	const [loading, setLoading] = useState(false)
	const [courseName, setCourseName] = useState('')
	const [description, setDescription] = useState('')
	const [subjectAreaId, setSubjectArea] = useState('')
	const [sarea, setSarea] = useState([])
	const [status, setStatus] = useState('')
	const [locked, setLockStatus]= useState('')

	const handleCloseModal = e => {
    e.preventDefault()
    setOpenEditModal(false)
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

	const saveEditCourse = async(e) => {
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
			let isTechFactors = true
			let sessionCourse = sessionStorage.getItem('courseid')
			let response = await new CoursesAPI().editCourse
			(
				sessionCourse,
				{courseName, description, subjectAreaId, status, locked, isTechFactors}
			)
			if(response.ok){
				successSave()
				getCourses()
				handleCloseModal(e)
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

	useEffect(() => {
    if(selectedCourse !== null) {
			setCourseName(selectedCourse?.courseName)
			setDescription(selectedCourse?.description)
			// setSarea(selectedCourse?.subjectAreaName)
			setSubjectArea(selectedCourse?.subjectAreaId)
			setLockStatus(selectedCourse?.locked)
			setStatus(selectedCourse?.status)
		}
  }, [selectedCourse])

	const successSave = () => {
		toast.success('Done Edit', {
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
			<Modal size="lg" className="modal-all" show={openEditModal} onHide={()=> setOpenEditModal(!openEditModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit Course
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveEditCourse}>
							<Form.Group className="m-b-20">
								<Form.Label for="courseName">
									Course Name
								</Form.Label>
								<FormControl defaultValue={selectedCourse?.courseName} 
									className="custom-input" 
									size="lg" 
									type="text"
									onChange={(e) => setCourseName(e.target.value)}
								/>
							</Form.Group>
							{' '}

							<Form.Group className="m-b-20">
								<Form.Label for="description">
									Description
								</Form.Label>
								<FormControl defaultValue={selectedCourse?.description} 
									className="custom-input" 
									size="lg" 
									type="text"
									onChange={(e) => setDescription(e.target.value)}
								/>
							</Form.Group>
							{' '}

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
								{' '}

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
								{' '}

								<Form.Group className="m-b-20">
										<Form.Label for="lock">
												Lock Status
										</Form.Label>
										<Form.Select size="lg" onChange={(e) => setLockStatus(e.target.value)}>
											<option value={true} selected={selectedCourse?.locked === true}>
												Locked
											</option>
											<option value={false} selected={selectedCourse?.locked === false}>
												Unlocked
											</option>
										</Form.Select>
								</Form.Group>
								{' '}
						
							<span style={{float:"right"}}>
								<Button className="tficolorbg-button" type="submit" >
									Save
								</Button>
							</span>
						</Form>
					</Modal.Body>
			</Modal>
		</div>
	)
}
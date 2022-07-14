import React, {useState, useEffect, useContext} from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import CoursesAPI from '../../../../api/CoursesAPI'
import GradeAPI from '../../../../api/GradeAPI';
import ClassesAPI from '../../../../api/ClassesAPI';
import AcademicTermAPI from '../../../../api/AcademicTermAPI';
import { UserContext } from '../../../../context/UserContext'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

function EditClassModal({seletedClass, openEditModal, setOpenEditModal, getClasses }) {
  const [addNotify, setAddNotity] = useState(false)
  const [course, setCourse] = useState([])
  const [grade, setGreade] = useState([])
  const [className, setClassName] = useState('')
  const [courseId, setCourseId] = useState('')
  const [gradeLevelId, setGradeLevelId] = useState('')
  const [academicTerm, setAcademicTerm] = useState([])
  const [academicTermId, setAcademicTermId] = useState('')
  const userContext = useContext(UserContext)
  const {user} = userContext.data

  const handleCloseModal = (e) =>{
    e.preventDefault()
    setOpenEditModal(false)
  }

  const closeNotify = () =>{
    setAddNotity(false)
  }

  const getAcademicTerm = async () =>{
    let response = await new AcademicTermAPI().fetchAcademicTerm()
    if(response.ok){
      setAcademicTerm(response.data)
    }else{
      alert("Something went wrong while fetching all Academic Term")
    }
  }

  useEffect(() => {
    getAcademicTerm()
  }, [])

  const getCourses = async() => {
    let response = await new CoursesAPI().getCourses()
    if(response.ok){
      setCourse(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
  }
      
  useEffect(() => {
    getCourses()
  }, [])

  const getGrade = async() =>{
    let response = await new GradeAPI().getGrade()
    if(response.ok){
      setGreade(response.data)
    }else{
      alert("Something went wrong while fetching all Grade")
    }
  }

  useEffect(() => {
    getGrade()
    getCourses()
  }, [])

  const saveEditClasses = async (e) =>{
    e.preventDefault()
    let teacherId = user.teacher.id
    let classId = seletedClass.classId
    let classCode = seletedClass.classCode
    let response = await new ClassesAPI().editClasses(
      classId,
      {classCode, className, courseId, gradeLevelId, academicTermId, teacherId }
    )
    if(response.ok){
      // setAddNotity(true)
      success()
      getClasses()
      handleCloseModal(e)
    }else{
      // alert(response.data.errorMessage)
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

  const success = () => {
    toast.success('Successfully updated class', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  useEffect(() => {
    if(seletedClass !== null){
      setGradeLevelId(seletedClass?.gradeLevelId)
      setClassName(seletedClass?.className)
      setCourseId(seletedClass?.courseId) 
      setAcademicTermId(seletedClass?.academicTermId)
    }
  }, [seletedClass])

  const handleGetSelected = (data) => {
    console.log(data)
    let selected = course.find(e => e.courseName == data);
    setCourseId(selected?.id.toString());
  }
  
  return (
		<div>
			<Modal size="lg" show={openEditModal} onHide={()=> setOpenEditModal(!setOpenEditModal)} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Edit Class
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={saveEditClasses}>
          <Form.Group className="mb-3">
            <Form.Label>Grade Level</Form.Label>
            	<Form.Select onChange={(e) => setGradeLevelId(e.target.value)}>
                <option value={seletedClass?.gradeLevelId}>{seletedClass?.gradeName}</option>
                  {grade.map(item =>{
                    return (<option value={item.id}>{item.gradeName}</option>) 
                    })
                  }
            	</Form.Select>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Course</Form.Label>
              	{/* <Form.Select onChange={(e) => setCourseId(e.target.value)} >
                  <option value={seletedClass?.courseId}>{seletedClass?.courseName}</option>
                     {course.map(item =>{
                      return (<option value={item.id}>{item.courseName}</option>)
                      })
                    }
                </Form.Select> */}

              <Form.Control list="courses"  onChange={(e) => handleGetSelected(e.target.value)} placeholder={seletedClass?.courseName} name="course" id="courseInput2" />
                <datalist id="courses" onChange={(e) => console.log(e, 'sample')}>
                  {course.map(item =>{
                      return <option value={item.courseName} />
                      })
                    }
                </datalist>
            </Form.Group>

            <Form.Group className="mb-4">
            	<Form.Label>School Year</Form.Label>
                <Form.Select onChange={(e) => setAcademicTermId(e.target.value)}>
                <option value={seletedClass?.academicTermId}>{seletedClass?.termName}</option>
                  {academicTerm.map(item =>{
                      return(<option value={item.id}>{item.academicTermName}</option>)
                      })
                    }
                </Form.Select>       

                </Form.Group>

            <Form.Group className="mb-4">
            	<Form.Label >Class Name</Form.Label>
                <Form.Control defaultValue={seletedClass?.className} onChange={(e) => setClassName(e.target.value)} type="text" placeholder='Enter class name here'/>
            </Form.Group>
            {/* <Form.Group className="mb-4">
            	<Form.Label >Class Description</Form.Label>
                <Form.Control type="text" placeholder='Enter class Description here'/>
            </Form.Group> */}
              <Form.Group className='mb-4'>
              	<Form.Label >Class Code</Form.Label>{' '}
                	<Button className='tficolorbg-button' disabled>
                    Get class code
                	</Button>
              </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Control defaultValue={seletedClass?.classCode}  type="text" placeholder='Enter class Code here' disabled/>
            	</Form.Group>
            <Form.Group className='right-btn'> 
            	<Button className='tficolorbg-button' type='submit'>Update Class</Button>
            </Form.Group>
         </Form>
				</Modal.Body>
      </Modal>
      <SweetAlert 
          success
          show={addNotify} 
          title="Done!" 
          onConfirm={closeNotify}>
        </SweetAlert>
    </div>
    )
}
export default EditClassModal

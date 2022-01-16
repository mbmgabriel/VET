import React, {useState, useEffect, useContext} from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import GradeAPI from '../../../../api/GradeAPI';
import CoursesAPI from '../../../../api/CoursesAPI'
import ClassesAPI from '../../../../api/ClassesAPI';
import { UserContext } from '../../../../context/UserContext'
import AcademicTermAPI from '../../../../api/AcademicTermAPI';
import SweetAlert from 'react-bootstrap-sweetalert';

function CreateClassModal({modal, toggle,getClasses}) {
  const [addNotify, setAddNotity] = useState(false)
  const [grade, setGreade] = useState([])
  const [course, setCourse] = useState([])
  const [classCode, setGetCode] = useState('')
  const [gradeLevelId, setGetGradeLevel] = useState('')
  const [courseId, setGetCourseId] = useState('')
  const [className, setClassName] = useState('')
  const [academicTerm, setAcademicTerm] = useState([])
  const [academicTermId, setAcademicTermId] = useState('')
  const userContext = useContext(UserContext)
  const {user} = userContext.data

  const closeNotify = () =>{
    setAddNotity(false)
  }

  const getClassCode = e =>{
    e.preventDefault()
    setGetCode(createRandomCode(4))
    
  }

  console.log(classCode)

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
  }, [])

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

  const addClass = async(e) => {
    e.preventDefault()
    let teacherId = user.teacher.id
    let response = await new ClassesAPI().createClasses(
      {classCode, gradeLevelId, className, courseId, teacherId, academicTermId}
    )
    if(response.ok){
      setAddNotity(true)
      toggle(e)
      getClasses()

    }else{
      alert(response.data.errorMessage)
    }
  }


  const createRandomCode = (string_length) => {
    var randomString = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTWXYZ1234567890'
    for (var i, i = 0; i < string_length; i++){
      randomString += characters.charAt(Math.floor(Math.random() * characters.length))
    }
      return randomString
  }


	return (
    <div>
    	<Modal size="lg" show={modal} onHide={toggle} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Create Class
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={addClass}>
          <Form.Group className="mb-3">
            <Form.Label>Grade Level</Form.Label>
              <Form.Select onChange={(e) => setGetGradeLevel(e.target.value)}>
                <option>-- Select Grade Level Here --</option>
                {grade.map(item =>{
                    return(<option value={item.id}>{item.gradeName}</option>)
                    })
                  }
              </Form.Select>
            </Form.Group>
          	<Form.Group className="mb-4">
            	<Form.Label>Course</Form.Label>
                <Form.Select onChange={(e) => setGetCourseId(e.target.value)}>
                  <option>-- Select Course Level Here --</option>
                  {course.map(item =>{
                      return(<option value={item.id}>{item.courseName}</option>)
                      })
                    }
                </Form.Select>
                
            </Form.Group>
            <Form.Group className="mb-4">
            	<Form.Label>Academic Term</Form.Label>
                <Form.Select onChange={(e) => setAcademicTermId(e.target.value)}>
                  <option>-- Select Academic Term HERE --</option>
                  {academicTerm.map(item =>{
                      return(<option value={item.id}>{item.academicTermName}</option>)
                      })
                    }
                </Form.Select> 
            </Form.Group>
            <Form.Group className="mb-4">
          		<Form.Label >Class Name</Form.Label>
                <Form.Control onChange={(e) => setClassName(e.target.value)} type="text" placeholder='Enter class name here'/>
            </Form.Group>
            <Form.Group className="mb-4">
            <Form.Label >Class Description</Form.Label>
              <Form.Control type="text" placeholder='Enter class Description here' />
            </Form.Group>
              <Form.Group className='mb-4'>
                <Form.Label >Class Code</Form.Label>&nbsp;{' '}
                	<Button  className='tficolorbg-button' onClick={getClassCode}>
                    Get class code
                	</Button>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Control value={classCode} type="text" placeholder='Enter class Code here'/>
            </Form.Group>
            <Form.Group className='right-btn'>
							<Button className='tficolorbg-button' type='submit'>Save</Button>
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
export default CreateClassModal


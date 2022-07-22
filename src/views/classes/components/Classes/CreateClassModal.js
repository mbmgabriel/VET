import React, {useState, useEffect, useContext} from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import GradeAPI from '../../../../api/GradeAPI';
import CoursesAPI from '../../../../api/CoursesAPI'
import ClassesAPI from '../../../../api/ClassesAPI';
import { UserContext } from '../../../../context/UserContext'
import AcademicTermAPI from '../../../../api/AcademicTermAPI';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

function CreateClassModal({setModal, modal, getClasses}) {
  const [addNotify, setAddNotity] = useState(false)
  const [grade, setGreade] = useState([])
  const [course, setCourse] = useState([])
  const [classCode, setGetCode] = useState('')
  const [gradeLevelId, setGetGradeLevel] = useState('')
  const [courseId, setGetCourseId] = useState('')
  const [className, setClassName] = useState('')
  const [academicTerm, setAcademicTerm] = useState([])
  const [academicTermId, setAcademicTermId] = useState('')
  const [validated, setValidated] = useState(false);
  const userContext = useContext(UserContext)
  const {user} = userContext.data

  const closeNotify = () =>{
    setAddNotity(false)
  }

  console.log('course12312:', course)

  const toggle = () =>{
    setModal(!modal)
    setGetCode('')
    setGetGradeLevel('')
    setGetCourseId('')
    setClassName('')
    setAcademicTermId('')
    setValidated(false)
  }

  const getClassCode = e =>{
    e.preventDefault()
    setGetCode(createRandomCode(4))
    
  }

  const success = () => {
    toast.success('Successfully created class', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
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
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    if(academicTermId == '' || courseId == '' || gradeLevelId == '' ){
      toast.error('Please input all required fields', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }else{
      let teacherId = user.teacher.id
      let response = await new ClassesAPI().createClasses(
        {classCode, gradeLevelId, className, courseId, teacherId, academicTermId}
      )
      if(response.ok){
        success()
        toggle(e)
        getClasses()
        setGetCode('')
  
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


  const createRandomCode = (string_length) => {
    var randomString = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTWXYZ1234567890'
    for (var i, i = 0; i < string_length; i++){
      randomString += characters.charAt(Math.floor(Math.random() * characters.length))
    }
      return randomString
  }

  const handleGetSelected = (data) => {
    console.log(data)
    let selected = course.find(e => e.courseName == data);
    setGetCourseId(selected?.id.toString());
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
        <Form noValidate validated={validated} onSubmit={addClass}>
          <Form.Group className="mb-3">
            <Form.Label>Grade Level</Form.Label>
              <Form.Select required onChange={(e) => setGetGradeLevel(e.target.value)}>
                <option value={''}>-- Select Grade Level Here --</option>
                {grade.map(item =>{
                    return(<option value={item.id}>{item.gradeName}</option>)
                    })
                  }
              </Form.Select>
            </Form.Group>

          	<Form.Group className="mb-4">
            	<Form.Label>Course</Form.Label>
                {/* <Form.Select onChange={(e) => setGetCourseId(e.target.value)}>
                  <option>-- Select Course Level Here --</option>
                  {course.map(item =>{
                      return(<option value={item.id}>{item.courseName}</option>)
                      })
                    }
                </Form.Select> */}
                <Form.Control required list="courses"  onChange={(e) => handleGetSelected(e.target.value)} placeholder='-- Select Course Level Here --' name="course" id="courseInput" />
                <datalist id="courses" onChange={(e) => console.log(e, 'sample')}>
                  {course.map(item =>{
                      return <option value={item.courseName} />
                      })
                    }
                </datalist>
            </Form.Group>
            <Form.Group className="mb-4">
            	<Form.Label>School Year</Form.Label>
                <Form.Select required onChange={(e) => setAcademicTermId(e.target.value)}>
                  <option value={''}>-- Select School Year HERE --</option>
                  {academicTerm.map(item =>{
                      return(<option value={item.id}>{item.academicTermName}</option>)
                      })
                    }
                </Form.Select> 
            </Form.Group>
            <Form.Group className="mb-4">
          		<Form.Label >Class Name</Form.Label>
                <Form.Control required onChange={(e) => setClassName(e.target.value)} type="text" placeholder='Enter class name here'/>
            </Form.Group>
            {/* <Form.Group className="mb-4">
            <Form.Label >Class Description</Form.Label>
              <Form.Control type="text" placeholder='Enter class Description here' />
            </Form.Group> */}
              <Form.Group className='mb-4'>
                <Form.Label >Class Code</Form.Label>&nbsp;{' '}
                	<Button  className='tficolorbg-button' onClick={getClassCode}>
                    Get class code
                	</Button>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Control required pattern="^[a-zA-Z0-9]+$" title='Please Avoid special character on Class Code' value={classCode} onChange={(e) => setGetCode(e.target.value) } type="text" placeholder='Enter class Code here'/>
                
            </Form.Group>
            <Form.Group className='right-btn'>
							<Button className='tficolorbg-button' type='submit'>Save Class</Button>
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


import React, {useState, useEffect, useContext} from 'react'
import { CardGroup, Col } from 'react-bootstrap'
import ClassesAPI from '../../api/ClassesAPI'
import MainContainer from '../../components/layouts/MainContainer'
import ClassCard from './components/Classes/ClassCard'
import ClassHeader from './components/Classes/ClassHeader'
import EditClassModal from './components/Classes/EditClassModal'
import { UserContext } from '../../context/UserContext'
import moment from 'moment'
import StudentClasslist from './student/StudentClasslist'
import StudentClassListHeader from './student/components/StudentClassListHeader'

export default function Classes() {
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [studentClasses, setStudentClasses] = useState([])
  const [seletedClass, setSeletedClass] = useState(null)
  const [openEditModal, setOpenEditModal] = useState(false)
  const userContext = useContext(UserContext)
  const {user} = userContext.data

  const getClasses = async() => {
    let response = await new ClassesAPI().getClasses(user?.teacher?.id)
    if(response.ok){
      setClasses(response.data)
    }else{
      // alert("Something went wrong while fetching all Classes")
    }
    setLoading(false)
  }

  const getClassesStudent = async() => {
    let response = await new ClassesAPI().getClassesStudent(user?.student?.id)
    if(response.ok){
      setStudentClasses(response.data)
    }else{
      // alert("Something went wrong while fetching all Classes")
    }
    setLoading(false)
  }

  useEffect(() => {
    getClassesStudent()
  }, [])

  useEffect(() => {
    // console.log('moment data', moment("2021-07-01T00:00:00").format('dddd'))
    getClasses()
  }, [])

  return (

    <MainContainer loading={loading} activeHeader={'classes'}>
      <div className='page-container'>
        <div className='containerpages'>
          {(user?.teacher === null)?(
          <>
          <StudentClassListHeader />
          <CardGroup className='card-group2'>
          {studentClasses.length?
            studentClasses.map(item => {
              return( <StudentClasslist item={item} />)
            }):<></>  
            
          } 
          </CardGroup>
          </>
          ):
          <>
          <ClassHeader getClasses={getClasses} />
          <CardGroup className='card-group2'>
            {classes.length?
              classes.map(item => {
                return(<ClassCard getClasses={getClasses}  item={item} setOpenEditModal={setOpenEditModal} setSeletedClass={setSeletedClass} />)
                  }):<span></span>
                }
          </CardGroup>
          </>
          }
        </div>
      </div>
      <EditClassModal getClasses={getClasses} seletedClass={seletedClass} openEditModal={openEditModal} setOpenEditModal={setOpenEditModal} />
    </MainContainer>
  )
}

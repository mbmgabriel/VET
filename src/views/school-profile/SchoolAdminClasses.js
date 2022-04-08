import React, {useState, useEffect, useContext} from 'react'
import { CardGroup } from 'react-bootstrap'
import ClassesAPI from '../../api/ClassesAPI'
import MainContainer from '../../components/layouts/MainContainer'
import ClassCard from '../classes/components/Classes/ClassCard'
import ClassHeader from '../classes/components/Classes/ClassHeader'
import EditClassModal from '../classes/components/Classes/EditClassModal'
import { UserContext } from '../../context/UserContext'
import StudentClasslist from '../classes/student/StudentClasslist'
import StudentClassListHeader from '../classes/student/components/StudentClassListHeader'
import StudentClassListPending from '../classes/student/StudentClassListPending'

export default function Classes() {
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [studentClasses, setStudentClasses] = useState([])
  const [pendingClasses, setPendingClasses] = useState([])
  const [seletedClass, setSeletedClass] = useState(null)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [joinClassestModal, setJoinClassesModal] = useState(false)
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  let studentId = user?.student?.id
  const [searchTerm, setSearchTerm] = useState('')

  const onSearch = (text) =>{
    setSearchTerm(text)
  }

  console.log('ios:', studentId)

  const joinClassesToggle = () => {
    setJoinClassesModal(!joinClassestModal)
  }

  console.log('classesclassesclasses:', classes)

  const getClasses = async() => {
    setLoading(true)
    let response = await new ClassesAPI().getAllClass();
    setLoading(false)
    if(response.ok){
      setClasses(response.data)
    }else{
      alert("Something went wrong while fetching all getClasses")
    }
    setLoading(false)
  }

  const getClassesStudent = async() => {
    setLoading(true)
    let response = await new ClassesAPI().getClassesStudent(studentId)
    setLoading(false)
    if(response.ok){
      setStudentClasses(response.data)
    }else{
      alert("Something went wrong while fetching all getClassesStudent")
    }
  }

  const getPendingClasses = async() => {
    let response = await new ClassesAPI().getPendingClasses(studentId)
      if(response.ok){
        setPendingClasses(response.data)
      }else{
        alert("Something went wrong while fetching all getPendingClasses")
      }
  }

  // useEffect(() => {
  //   if(user?.teacher === null)
  //   return(
  //     getClassesStudent(),
  //     getPendingClasses()
  //   )
  // }, [])

  useEffect(() => {
    // if(user?.student === null)
    //   return(
        getClasses()
      // )
   
  }, [])

  console.log('searchTerm:', searchTerm)

  return (
    <MainContainer activeHeader={'classes'} loading={loading}>
      <div className='page-container'>
        <div className='containerpages'>
          {user.isStudent &&
          <>
          <StudentClassListHeader setJoinClassesModal={setJoinClassesModal} onSearch={onSearch} getPendingClasses={getPendingClasses}  joinClassesToggle={joinClassesToggle} joinClassestModal={joinClassestModal} />
          <CardGroup className='card-group2'>
          {studentClasses.length?
            studentClasses.filter((item) => {
              if(searchTerm == ''){
                return item
              }else if (item.className.toLowerCase().includes(searchTerm.toLocaleLowerCase())){
                return item
              }
            }).map(item => {
              return( 
              <StudentClasslist item={item} />
              )
            }):<></>  
          } 
          {pendingClasses.length?
            pendingClasses.filter((item) => {
              if(searchTerm == ''){
                return item
              } else if (item.className.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())){
                return item
              }
            }).map(item =>{
              return(
                <StudentClassListPending item={item} />
              )
            }):<></>
          } 
          </CardGroup>
          </>
          }
        {/* {user?.teacher && 
          <> */}
          <ClassHeader onSearch={onSearch} getClasses={getClasses} />
          <CardGroup className='card-group2'>
            {classes.length?
              classes.filter((item) => {
                if(searchTerm == '') {
                  return item
                } else if (item?.className.toLowerCase().includes(searchTerm.toLowerCase())){
                  return item
                }
              }).map(item => {
                return(<ClassCard getClasses={getClasses}  item={item} setOpenEditModal={setOpenEditModal} setSeletedClass={setSeletedClass} />)
                  }):<span></span>
                }
          </CardGroup>
          {/* </>
        } */}
        </div>
      </div>
      <EditClassModal getClasses={getClasses} seletedClass={seletedClass} openEditModal={openEditModal} setOpenEditModal={setOpenEditModal} />
    </MainContainer>
  )
}

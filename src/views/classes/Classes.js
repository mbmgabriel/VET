import React, {useState, useEffect, useContext} from 'react'
import { CardGroup } from 'react-bootstrap'
import ClassesAPI from '../../api/ClassesAPI'
import AcademicTermAPI from '../../api/AcademicTermAPI';
import MainContainer from '../../components/layouts/MainContainer'
import ClassCard from './components/Classes/ClassCard'
import ClassHeader from './components/Classes/ClassHeader'
import EditClassModal from './components/Classes/EditClassModal'
import { UserContext } from '../../context/UserContext'
import moment from 'moment'
import StudentClasslist from './student/StudentClasslist'
import StudentClassListHeader from './student/components/StudentClassListHeader'
import StudentClassListPending from './student/StudentClassListPending'
import StudentJoinClass from './student/StudentJoinClass'
import ClassCoverPhoto from './components/Classes/ClassCoverPhoto'
import FullScreenLoader from '../../components/loaders/FullScreenLoader'

export default function Classes() {
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [studentClasses, setStudentClasses] = useState([])
  const [pendingClasses, setPendingClasses] = useState([])
  const [seletedClass, setSeletedClass] = useState(null)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [joinClassestModal, setJoinClassesModal] = useState(false)
  const [openCoverPhotoModal, setOpenCoverPhotoModal] = useState(false)
  const [classIdCoverPhoto, setClassIdCoverPhoto] = useState(null)
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  let studentId = user?.student?.id
  const [searchTerm, setSearchTerm] = useState('')
  const [currentAcademicTerm, setCurrentAcademicTerm] = useState('');

  const onSearch = (text) =>{
    setSearchTerm(text)
  }

  const joinClassesToggle = () => {
    setJoinClassesModal(!joinClassestModal)
  }

  const getClasses = async() => {
    setLoading(true)
    let response = await new ClassesAPI().getClasses(user.isTeacher ? user?.teacher?.id : user?.student?.id)
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

  useEffect(() => {
    let temp = localStorage.getItem('academicTerm')
    setCurrentAcademicTerm(temp)
    if(user?.teacher === null)
    return(
      getClassesStudent(),
      getPendingClasses()
    )
  }, [])

  useEffect(() => {
    let temp = localStorage.getItem('academicTerm')
    setCurrentAcademicTerm(temp)
    if(user?.student === null)
      return(
        getClasses()
      )
   
  }, [])

  return (
    <MainContainer activeHeader={'classes'} loading={loading}>
      {loading && <FullScreenLoader/>}
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
              }else if (item.className.toLowerCase().includes(searchTerm.toLocaleLowerCase()) || item?.classCode.toLowerCase().includes(searchTerm.toLowerCase()) ){
                return item
              }
            }).map(item => {
              return( 
                item.termName == currentAcademicTerm &&
              <StudentClasslist item={item} />
              )
            }):<></>  
          } 
          {pendingClasses.length?
            pendingClasses.filter((item) => {
              if(searchTerm == ''){
                return item
              } else if (item.className.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) || item?.classCode.toLowerCase().includes(searchTerm.toLowerCase())){
                return item
              }
            }).map(item =>{
              return(
                item.termName == currentAcademicTerm &&
                <StudentClassListPending item={item} />
              )
            }):<></>
          } 
          </CardGroup>
          </>
          }
        {user?.teacher && 
          <>
          <ClassHeader onSearch={onSearch} getClasses={getClasses} />
          <CardGroup className='card-group2'>
            {classes.length?
              classes.filter((item) => {
                if(searchTerm == '') {
                  return item
                } else if (item?.className.toLowerCase().includes(searchTerm.toLowerCase()) || item?.classCode.toLowerCase().includes(searchTerm.toLowerCase())){
                  return item
                }
              }).map(item => {
                return(
                  item.termName == currentAcademicTerm &&
                    <ClassCard classIdCoverPhoto={classIdCoverPhoto} setClassIdCoverPhoto={setClassIdCoverPhoto} openCoverPhotoModal={openCoverPhotoModal} setOpenCoverPhotoModal={setOpenCoverPhotoModal} getClasses={getClasses}  item={item} setOpenEditModal={setOpenEditModal} setSeletedClass={setSeletedClass} />)
                })
              :
              <span></span>
            }
          </CardGroup>
          </>
        }
        </div>
      </div>
      <EditClassModal getClasses={getClasses} seletedClass={seletedClass} openEditModal={openEditModal} setOpenEditModal={setOpenEditModal} />
      <ClassCoverPhoto getClasses={getClasses} classIdCoverPhoto={classIdCoverPhoto} setClassIdCoverPhoto={setClassIdCoverPhoto} openCoverPhotoModal={openCoverPhotoModal} setOpenCoverPhotoModal={setOpenCoverPhotoModal} />
    </MainContainer>
  )
}

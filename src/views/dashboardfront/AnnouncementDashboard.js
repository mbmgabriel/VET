import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap'
import { toast } from 'react-toastify'
import SchoolAPI from '../../api/SchoolAPI'
import { UserContext } from '../../context/UserContext'
import CoursesAPI from '../../api/CoursesAPI'
import AnnouncementAPI from '../../api/AnnouncementAPI'
import Moment from 'moment'
import CreateAnnouncement from './components/CreateAnnouncementModal'
import EditAnnouncement from './components/EditAnnouncementModal'
import ViewAnnoncement from './components/VIewAnnoncement'
import ReactPaginate from 'react-paginate'
import AdminAnnouncement from './components/AdminAnnouncement'
import TeacherAnnouncement from './components/TeacherAnnouncement'
import AllAnouncement from './components/AllAnouncement'
import ContentViewer from '../../components/content_field/ContentViewer'

export default function AnnouncementDashboard() {

  const userContext = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [announcement, setAnnouncement] = useState([])
  const [myAnnouncement, setMyAnnouncement] = useState([])
	const [openCreateAnnouncementModal, setOpenCreateAnnouncementModal] = useState(false)
  const [openEditAnnoncementModal, setOpenEditAnnouncementModal] = useState(false)
  const [ViewAnnoncementModal, setViewAnnouncementModal] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [announcementId, setAnnouncementId] = useState('')
  const [viewTitle, setViewTitle] = useState('')
  const [viewContent, setViewContent] = useState('')
  const [viewDate, setViewDate] = useState()
  const [pageNumber, setPagesNumber] = useState(0)
  const [viewPage, setViewPage] = useState(2)
  const announcementPage = 10;
  const pagesVisited = pageNumber * announcementPage;
  const {user} = userContext.data
  let studentId = user?.student?.id
  const [searchTerm, setSearchTerm] = useState('')

  // const openTeacherAnnouncement = () => {
  //   setViewPage(1)
  // }

  // const openAdminAnnoncement = () => {
  //   setViewPage(2)
  // }

  // const openAllAnnouncement = () => {
  //   setViewPage(0)
  // }

  const onSearch = (text) => {
    setSearchTerm(text)
  }

  const displayAnnouncement = announcement.slice(pagesVisited, pagesVisited + announcementPage).map((item) => {
    return(
        <>
          <span className='dash-title'>{item?.title}</span><br></br>
          <span className='dash-date'><small>{item?.announcedBy} . {Moment(item?.createdDate).format('LL')}</small></span><br></br>
          <span className='dash-content'>{item?.content}</span>
          <span className='dash-read-more' ><Link to={'#'} onClick={() => handleViewAnnoncement(item?.title, item?.content,item?.createdDate)}> ...Read more </Link></span>
          <br></br>
          <hr></hr>
        </>
    )
  })

  const pageCount = Math.ceil(announcement.length / announcementPage);
  const changePage = ({selected}) =>{
    setPagesNumber(selected)
  }

  const handleViewAnnoncement = (title, content, date) => {
    setViewTitle(title)
    setViewContent(content)
    setViewDate(date)
    setViewAnnouncementModal(true)
  }

  const getAllAnnouncement = async() => {
    setLoading(true)
    let response = await new AnnouncementAPI().getAllAnnouncement()
    setLoading(false)
    if(response.ok){
      setAnnouncement(response.data)
    }else{
      alert("Something went wrong while fetching all getcourses")
    }
    setLoading(false)
  }

  // const getMyAnnouncement = async() => {
  //   setLoading(true)
  //   let response = await new AnnouncementAPI().getMyAnnouncement()
  //   setLoading(false)
  //   if(response.ok){
  //     const sortedActivities = response.data.sort((a, b) => b.id - a.id)
  //     console.log('sortedActivities:', sortedActivities)
  //     setMyAnnouncement(sortedActivities)
  //   }else{
  //     alert("Something went wrong while fetching all getcourses")
  //   }
  //   setLoading(false)
  // }

	const handleOpenModal = e => {
		e.preventDefault()
		setOpenCreateAnnouncementModal(true)
	}

  useEffect(() => {
    if(user?.student === null)
      return(
        getAllAnnouncement()
        // getMyAnnouncement()
      )
  }, [])

  useEffect(() => {
    if(user?.teacher === null)
      return(
        getAllAnnouncement()
      )
  }, [])

  console.log('myAnnouncement:', myAnnouncement)

  const deleteAnnouncement = async (id) =>{
    let response = await new AnnouncementAPI().deleteAnnouncement(id)
    if(response.ok){
      successDeleted()
      // getMyAnnouncement()
    }else{
      alert(response.data?.errorMessage)
    }
  }

  const successDeleted = () => {
		toast.success('Successfully deleted announcement', {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			});
	}

  const handleEditModal = (title, content, announcementId) =>{
    setTitle(title)
    setContent(content)
    setAnnouncementId(announcementId)
    setOpenEditAnnouncementModal(true)
  }

  console.log('teacherId:', user?.teacher?.id)

  return (
    <React.Fragment>
    <div className='dash-side-panel'>
      <Row>
        <Col sm={11}> 
          <div className='dash-title-header'>Announcements</div>
          <div className='dash-link-btn'>
          {/* <span  ><Link to={'#'} >All </Link></span>
          <span ><Link to={'#'}> Admin </Link></span>
          <span  ><Link to={'#'} > Teacher </Link></span> */}
          {user?.isTeacher && <>
            {/* <Button onClick={() => openAllAnnouncement()}  className='dash-link-btn' size='sm' variant="outline-warning"><b>All</b></Button> */}
            {/* <Button onClick={() => openAdminAnnoncement()} className='dash-link-btn'  size='sm' variant="outline-warning"><b>Admin </b></Button> */}
            {/* <span className='dash-link-btn'><b>Admin </b></span> */}
            {/* <Button onClick={() => openTeacherAnnouncement()} className='dash-link-btn'  size='sm' variant="outline-warning"><b>Teacher</b></Button> */}
          </>}
          </div>
          <br />
        </Col> 
				<Col sm={1}>
          {user?.isTeacher && <>
          {/* <Button variant='link' className="btn-create-class" onClick={handleOpenModal}><i className='fa fa-plus'></i></Button> */}
        </>} 
          {/* <CreateAnnouncement getMyAnnouncement={getMyAnnouncement} openCreateAnnouncementModal={openCreateAnnouncementModal} setOpenCreateAnnouncementModal={setOpenCreateAnnouncementModal}/> */}
        </Col> 
        <div className="col-md-12">
					<InputGroup size="lg">
						<FormControl onChange={(e) => onSearch(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search announcement here" type="search"/>
					<InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
					</InputGroup>
          <br />
				</div>
      </Row>
      {user?.isTeacher && <>
          {announcement.length?
            viewPage === 2?(<>
            <AdminAnnouncement searchTerm={searchTerm}  handleViewAnnoncement={handleViewAnnoncement} announcement={announcement} />
            </>):(<></>)
            :
            <span>No Announcement</span>
          }
          {/* {myAnnouncement.length?
            viewPage === 1? (<>
              <TeacherAnnouncement searchTerm={searchTerm} deleteAnnouncement={deleteAnnouncement} handleEditModal={handleEditModal} myAnnouncement={myAnnouncement} handleViewAnnoncement={handleViewAnnoncement} /> 
            </>):(<></>) 
             
            :
            <span>No Announcement Created</span>
         } */}
         {/* {viewPage === 0? (<>
          <AllAnouncement /> 
         </>):(<></>)} */}

      </>}
      {user?.isStudent && <>
        {announcement.length?
          <>
              {announcement.slice(pagesVisited, pagesVisited + announcementPage).filter((item) => {
                  if(searchTerm == ''){
                    return item
                  }else if(item?.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())){
                    return item
                  }
                }).map((item) => {
                  return(
                      <>
                        <span className='dash-title'>{item?.title}</span><br></br>
                        <span className='dash-date'><small>{item?.announcedBy} . {Moment(item?.createdDate).format('LL')}</small></span><br></br>
                        <span className='dash-content'><ContentViewer>{item?.content.substring(0, 350)}</ContentViewer></span>
                        <span className='dash-read-more' ><Link to={'#'} onClick={(e) => handleViewAnnoncement(item?.title, item?.content,item?.createdDate)}> ...Read more </Link></span>
                        <br></br>
                        <hr></hr>
                      </>
                  )
                })
              }
            <br />
            <ReactPaginate 
              previousLabel={'Previous'}
              nextLabel={'Next'}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={'paginationBtns'}
              previousLinkClassName={'previousBtns'}
              nextLinkClassName={'nextBtns'}
              disabledClassName={'paginationDisabled'}
              activeClassName={'paginationAcitve'}
            />
          </>
            :
            <span>No Announcement </span>
          }
      </>}
    </div>
    {/* <EditAnnouncement getMyAnnouncement={getMyAnnouncement} announcementId={announcementId} setContent={setContent} content={content} setTitle={setTitle} title={title} openEditAnnoncementModal={openEditAnnoncementModal} setOpenEditAnnouncementModal={setOpenEditAnnouncementModal}/> */}
    <ViewAnnoncement viewDate={viewDate} viewTitle={viewTitle} viewContent={viewContent} ViewAnnoncementModal={ViewAnnoncementModal}  setViewAnnouncementModal={setViewAnnouncementModal}/>
    </React.Fragment>
  )
}
import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { toast } from 'react-toastify'
import AnnouncementAPI from '../../../api/AnnouncementAPI'
import { UserContext } from '../../../context/UserContext'
import Moment from 'moment'
import ViewAnnoncement from '../../dashboardfront/components/VIewAnnoncement'
import EditAnnouncement from '../../dashboardfront/components/EditAnnouncementModal'
import CreateAnnouncement from '../../dashboardfront/components/CreateAnnouncementModal'
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactPaginate from 'react-paginate'


function SchoolAnouncementContent() {
  const [myAnnouncement, setMyAnnouncement] = useState([])
  const [pageNumber, setPagesNumber] = useState(0)
  const [viewPage, setViewPage] = useState(2)
  const [viewTitle, setViewTitle] = useState('')
  const [viewContent, setViewContent] = useState('')
  const [viewDate, setViewDate] = useState()
  const [ViewAnnoncementModal, setViewAnnouncementModal] = useState(false)
  const [openEditAnnoncementModal, setOpenEditAnnouncementModal] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [announcementId, setAnnouncementId] = useState('')
  const [openCreateAnnouncementModal, setOpenCreateAnnouncementModal] = useState(false)
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const announcementPage = 10;
  const pagesVisited = pageNumber * announcementPage;
  const userContext = useContext(UserContext)
  const {user} = userContext.data

  const onSearch = (text) => {
    setSearchTerm(text)
  }

  const closeNotify = () =>{
    setDeleteNotify(false)
  }
  
  const getMyAnnouncement = async() => {
    let response = await new AnnouncementAPI().getMyAnnouncement()
    if(response.ok){
      const sortedActivities = response.data.sort((a, b) => b.id - a.id)
      setMyAnnouncement(sortedActivities)
    }else{
      alert("Something went wrong while fetching all getcourses")
    }
  }

  useEffect(() => {
    if(user?.student === null && user?.teacher === null)
      return(
        getMyAnnouncement()
        
      )
  }, [])

  const handleViewAnnoncement = (title, content, date) => {
    setViewTitle(title)
    setViewContent(content)
    setViewDate(date)
    setViewAnnouncementModal(true)
  }

  const handleEditModal = (title, content, announcementId) =>{
    setTitle(title)
    setContent(content)
    setAnnouncementId(announcementId)
    setOpenEditAnnouncementModal(true)
  }

  const deleteAnnouncement = async (id) =>{
    let response = await new AnnouncementAPI().deleteAnnouncement(id)
    if(response.ok){
      successDeleted()
      getMyAnnouncement()
      setDeleteNotify(false)
    }else{
      alert(response.data?.errorMessage)
    }
  }

  const handleDeleteNotify = (item) =>{
    setDeleteNotify(true)
    setAnnouncementId(item)
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

  const handleOpenModal = e => {
		e.preventDefault()
		setOpenCreateAnnouncementModal(true)
	}
  const pageCount = Math.ceil(myAnnouncement.length / announcementPage);
  const changePage = ({selected}) =>{
    setPagesNumber(selected)
  }

  const displayAnnouncement = myAnnouncement.slice(pagesVisited, pagesVisited + announcementPage).map((item) => {
    return(
        <>
          <span className='dash-title'>{item?.title}</span>
          <div className='inline-flex' style={{paddingTop:'20px', paddingTop:'6px', float:'right', }}>
            <div style={{color:'#EE9337', fontSize:'18px',paddingTop:'4px'}}>
                <Button onClick={() => handleEditModal(item?.title, item?.content, item?.id)}   className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-pencil-alt"></i>&nbsp; </Button>
            </div>
            <div style={{color:'#EE9337', fontSize:'18px',paddingTop:'4px'}}> 
              <Button onClick={() => handleDeleteNotify(item?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="far fa-trash-alt"></i>&nbsp; </Button>
            </div> 
          </div>
          <br></br>
          <span className='dash-date'><small>{item?.announcedBy} . {Moment(item?.createdDate).format('LL')}</small></span><br></br>
          <span className='dash-content'>{item?.content}</span>
          <span className='dash-read-more' ><Link to={'#'} onClick={(e) => handleViewAnnoncement(item?.title, item?.content,item?.createdDate)}> ...Read more </Link></span>
          <br></br>
          <hr></hr>
        </>
    )
  })

  console.log('myAnnouncement:',myAnnouncement)

  return (
    <>
      <SweetAlert
        warning
        showCancel
        show={deleteNotify}
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title="Are you sure?"
        onConfirm={() => deleteAnnouncement(announcementId)}
        onCancel={closeNotify}
        focusCancelBtn
          >
            You will not be able to recover this Announcement!
      </SweetAlert>
    <div className='rounded-white-container'>
           <Row>
        <Col sm={11}> 
          <div className='dash-title-header'>Announcements</div>
          <div className='dash-link-btn'>
          {/* <span  ><Link to={'#'} >All </Link></span>
          <span ><Link to={'#'}> Admin </Link></span>
          <span  ><Link to={'#'} > Teacher </Link></span> */}
         
            {/* <Button onClick={() => openAllAnnouncement()}  className='dash-link-btn' size='sm' variant="outline-warning"><b>All</b></Button> */}
            {/* <Button onClick={() => openAdminAnnoncement()} className='dash-link-btn'  size='sm' variant="outline-warning"><b>Admin </b></Button> */}
            {/* <span className='dash-link-btn'><b>Admin </b></span> */}
            {/* <Button onClick={() => openTeacherAnnouncement()} className='dash-link-btn'  size='sm' variant="outline-warning"><b>Teacher</b></Button> */}
      
          </div>
          <br />
        </Col> 
				<Col sm={1}>
        
          <Button variant='link' className="btn-create-class" onClick={handleOpenModal} ><i className='fa fa-plus'></i></Button>
   
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
      {myAnnouncement.slice(pagesVisited, pagesVisited + announcementPage).filter((item) => {
          if(searchTerm == ''){
            return item
          }else if(item?.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())){
            return item
          }
        }).map((item) => {
          return(
              <>
        <>
          <span className='dash-title'>{item?.title}</span>
          <div className='inline-flex' style={{paddingTop:'20px', paddingTop:'6px', float:'right', }}>
            <div style={{color:'#EE9337', fontSize:'18px',paddingTop:'4px'}}>
                <Button onClick={() => handleEditModal(item?.title, item?.content, item?.id)}   className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-pencil-alt"></i>&nbsp; </Button>
            </div>
            <div style={{color:'#EE9337', fontSize:'18px',paddingTop:'4px'}}> 
              <Button onClick={() => handleDeleteNotify(item?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="far fa-trash-alt"></i>&nbsp; </Button>
            </div> 
          </div>
          <br></br>
          <span className='dash-date'><small>{item?.announcedBy} . {Moment(item?.createdDate).format('LL')}</small></span><br></br>
          <span className='dash-content'>{item?.content.substring(0, 70)}</span>
          <span className='dash-read-more' ><Link to={'#'} onClick={(e) => handleViewAnnoncement(item?.title, item?.content,item?.createdDate)}> ...Read more </Link></span>
          <br></br>
          <hr></hr>
        </>
              </>
          )
        })
        }
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
      </div>
      <ViewAnnoncement 
        viewDate={viewDate} 
        viewTitle={viewTitle} 
        viewContent={viewContent} 
        ViewAnnoncementModal={ViewAnnoncementModal}  
        setViewAnnouncementModal={setViewAnnouncementModal}
      />
      <EditAnnouncement 
        getMyAnnouncement={getMyAnnouncement} 
        announcementId={announcementId} 
        setContent={setContent} 
        content={content} 
        setTitle={setTitle} 
        title={title} 
        openEditAnnoncementModal={openEditAnnoncementModal} 
        setOpenEditAnnouncementModal={setOpenEditAnnouncementModal}
      />
      <CreateAnnouncement 
        getMyAnnouncement={getMyAnnouncement} 
        openCreateAnnouncementModal={openCreateAnnouncementModal} 
        setOpenCreateAnnouncementModal={setOpenCreateAnnouncementModal}
      />
      </>
  )
}

export default SchoolAnouncementContent
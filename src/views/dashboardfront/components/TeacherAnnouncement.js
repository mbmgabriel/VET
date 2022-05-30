import React, {useState} from 'react'
import ReactPaginate from 'react-paginate'
import Moment from 'moment'
import { Link } from 'react-router-dom'
import {Button, } from 'react-bootstrap'

function TeacherAnnouncement({searchTerm, handleEditModal, deleteAnnouncement, myAnnouncement, handleViewAnnoncement}) {
  const [pageNumber, setPagesNumber] = useState(0)
  const announcementPage = 5;
  const pagesVisited = pageNumber * announcementPage;


  const displayAnnouncement = myAnnouncement.slice(pagesVisited, pagesVisited + announcementPage).map((item) => {
    return(
        <>
          <span className='dash-title'>{item?.title}</span>
          <div className='inline-flex' style={{paddingTop:'20px', paddingTop:'6px', float:'right', }}>
            <div style={{color:'#EE9337', fontSize:'18px',paddingTop:'4px'}}>
                <Button onClick={() => handleEditModal(item?.title, item?.content, item?.id)}   className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-pencil-alt"></i>&nbsp; </Button>
            </div>
            <div style={{color:'#EE9337', fontSize:'18px',paddingTop:'4px'}}> 
              <Button onClick={() => deleteAnnouncement(item?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="far fa-trash-alt"></i>&nbsp; </Button>
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

  const pageCount = Math.ceil(myAnnouncement.length / announcementPage);
  const changePage = ({selected}) =>{
    setPagesNumber(selected)
  }

  return (
    <>
      {/* {displayAnnouncement.filter((item) => {
        if(searchTerm != ''){
          return item
        }else if(item?.title.toLowerCase().includes(searchTerm.toLowerCase())){
          return item
        }
      })} */}
      {displayAnnouncement}{<><p>asd</p></>}
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
    
    
  )
}

export default TeacherAnnouncement
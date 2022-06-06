import React, {useState} from 'react'
import ReactPaginate from 'react-paginate'
import Moment from 'moment'
import { Link } from 'react-router-dom'

function AdminAnnouncement({handleViewAnnoncement, announcement, searchTerm}) {
  const [pageNumber, setPagesNumber] = useState(0)
  const announcementPage = 10;
  const pagesVisited = pageNumber * announcementPage;

  const displayAnnouncement = announcement.slice(pagesVisited, pagesVisited + announcementPage).map((item) => {
    return(
        <>
          <span className='dash-title'>{item?.title}</span><br></br>
          <span className='dash-date'><small>{item?.announcedBy} . {Moment(item?.createdDate).format('LL')}</small></span><br></br>
          <span className='dash-content'>{item?.content}</span>
          <span className='dash-read-more' ><Link to={'#'} onClick={(e) => handleViewAnnoncement(item?.title, item?.content,item?.createdDate)}> ...Read more </Link></span>
          <br></br>
          <hr></hr>
        </>
    )
  })

  const pageCount = Math.ceil(announcement.length / announcementPage);
  const changePage = ({selected}) =>{
    setPagesNumber(selected)
  }

  
  console.log('displayAnnouncement:', announcement)
  return (
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
                <span className='dash-content'>{item?.content.substring(0, 70)}</span>
                <span className='dash-read-more' ><Link to={'#'} onClick={(e) => handleViewAnnoncement(item?.title, item?.content,item?.createdDate)}> ...Read more </Link></span>
                <br></br>
                <hr></hr>
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
   </>
  )
}

export default AdminAnnouncement
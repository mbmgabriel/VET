import React, {useState, useEffect, useContext} from 'react'
import {Form, InputGroup, FormControl, Card, Button, Row, Col} from 'react-bootstrap'
import { toast } from "react-toastify";
import { useParams } from 'react-router';
import ClassesAPI from '../../../../api/ClassesAPI';
import { UserContext } from '../../../../context/UserContext'
import moment from 'moment';

const AnnouncementComment = ({refId, typeId, getFeedClass, commentInfo}) => {
  const [comment, setComment] = useState('')
  const [commentAnnouncementItem, setAnnouncementItem] = useState([])
  const {id} = useParams();
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [loading, setLoading] = useState(true);


  const commentAnnouncement = async (e) => {
    e.preventDefault()
    if(comment === ''){
      toast.warning("Please fill out this Field")
    }else{
      let response = await new ClassesAPI().commentAnnouncement(id, refId, typeId, {comment:comment})
      if(response.ok){
        toast.success("Comment was successfully Created")
        setComment('')
        getFeedClass()
        getComment()
      }else{
        alert(response.data.errorMessage)
      }
    }

  }
 useEffect(() => {
   console.log(commentInfo)
    getFeedClass();
  }, [commentInfo])


  const getComment = async () => {
    setLoading(true);
    let response = await new ClassesAPI().getComment(id, refId, typeId,)
    setLoading(false);
      if(response.ok){
        setAnnouncementItem(response.data)
      }else{
        alert(response.data.errorMessage)
      }
  }

  console.log('refId:', refId)

  useEffect(() => {

    getComment();
  }, [])

  const commentDelete = async (e, item) => {
    e.preventDefault()
    let commentId = item
    let response = await new ClassesAPI().deleteCommentfeed(id, commentId)
      if(response.ok){
        getFeedClass()
        getComment()
        toast.success("Comment was successfully deleted")
      }else{
        alert(response.data.errorMessage)
      }
  }

  console.log('commentInfo:', commentInfo)

  return (
    <div>
        {/* <div style={{color:'#EE9337', fontSize:'18px',paddingTop:'4px'}}>            
          <Button onClick={() => refreshComment()} className="m-r-5 color-white tficolorbg-button" size="sm"> Refresh</Button>
        </div> */}
      {commentAnnouncementItem?.map(item => {
        return(
          <>
            {/* <Card style={{border:'none'}}>
                <div className='inline-flex' style={{color: "#7D7D7D"}}>
                <i class="fas fa-user-circle comment-log" ></i> 
                <b><p style={{paddingLeft:'8px', paddingTop:'5px', color:'#EE9337'}}>{item?.commentedBy}</p></b> <p style={{fontSize:'14px', paddingLeft:'8px', paddingTop:'8px', color:'#707070'}}>  {moment(item?.createdDate).format('ll')}&nbsp; </p>
                <p style={{color:'#EE9337', fontSize:'15px', float:'right'}}> </p>
                </div> 
              <Card.Body>
                  {item?.comment}
              </Card.Body>
            </Card> */}
            <Row style={{marginBottom:10}}>
              <Col md={1} style={{textAlign:"right"}}>
               <i class="fas fa-md fa-user-circle comment-log" ></i> 
              </Col>
              <Col md={10} style={{backgroundColor:"#F8F8F8", padding:5, borderRadius:10}}>
                {item?.commentedBy} <small>{moment(item?.createdDate).format('ll')}</small>
                {user.isTeacher && <Button onClick={(e) => commentDelete(e, item?.id)} className='btn-like' size="sm" Button variant="link">&nbsp;<i className="fas fa-trash"></i></Button>}  
                {(user?.userId === item?.createdById && user?.teacher === null)?(<><Button onClick={(e) => commentDelete(e, item?.id)} className='btn-like' size="sm" Button variant="link">&nbsp;<i className="fas fa-trash"></i></Button></>):(<></>)}
                <br></br>
                <span>{item?.comment}</span>
              </Col>
              <Col md={1} >
              </Col>
            </Row>
          </>
        )
        
      })}

      <Form>  
        <InputGroup size="xs" style={{padding:20}}>
          <FormControl value={comment} onChange={(e) => setComment(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-xs" placeholder="Write your comment here..." style={{borderRadius:10}}/>
          <InputGroup.Text style={{borderRadius:"0px 10px 10px 0px"}} onClick={(e) => commentAnnouncement(e)} id="basic-addon2" className="comment-btn"><i className="fas fa-paper-plane"></i></InputGroup.Text>
        </InputGroup><br />
      </Form> 
    </div>
  )
}

export default AnnouncementComment
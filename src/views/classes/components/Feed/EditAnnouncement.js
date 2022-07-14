import React, { useEffect, useState }from 'react'
import { Modal, Card, Form, InputGroup, FormControl, Button } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';
import ContentRichText from '../../../../components/content_field/ContentRichText';
import ContentField from '../../../../components/content_field/ContentField';
import ClassCourseFileLibrary from '../ClassCourseFileLibrary';

function EditAnnouncement({setEditAnnouncementModal, content, setContent, getFeedClass, editAnnouncementItem, editAnnouncementModal, openEditAnnouncementToggle}) {
  console.log('this is announcement:', editAnnouncementItem)
  const [editNotify, setEditNotity] = useState(false)
  const [showFiles, setShowFiles] = useState(false);
  // const [content, setContent] = useState('')

  const closeNotify = () =>{
    setEditNotity(false)
  }

  const updateAnnouncement = async (e) =>{
    e.preventDefault()
    let id = 0
    let title = editAnnouncementItem?.title
    let announcementId = editAnnouncementItem?.referenceId
    let status = true
    let useraccountId = 0
    let response = await new ClassesAPI().updateAnnouncement(announcementId, {id, title, content, useraccountId, status})
      if(response.ok){
        success()
        setEditAnnouncementModal(false)
        getFeedClass()
        setContent('')
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

  const success = () => {
    toast.success('Successfully updated announcement!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  const CloceModal = () => {
    setContent('')
    setEditAnnouncementModal(false)
  }

  // useEffect(() => {
  //   if(editAnnouncementItem !== null) {
  //     setContent(editAnnouncementItem?.description)
	// 	}
  // }, [editAnnouncementItem])

  console.log('content:', content)

  return (
    <div>
      <Modal  size="lg" show={editAnnouncementModal} onHide={CloceModal} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
            <Modal.Title id="example-modal-sizes-title-lg" >
              Update Announcement
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Card className='calendar-card'>
      <Card.Body>
      <Form onSubmit={updateAnnouncement}>
      <div className={showFiles ? 'mb-3' : 'd-none'}>
            <ClassCourseFileLibrary />
          </div>
      {/* <InputGroup  size="lg">
        <InputGroup.Text id="basic-addon2" className="feed-button"><i class="fas fa-user-circle fas-1x" ></i></InputGroup.Text>
          <FormControl onChange={(e) => setContent(e.target.value)} defaultValue={editAnnouncementItem?.description} className='feed-box'  aria-label="small" aria-describedby="inputGroup-sizing-sm" placeholder="Type Announcement for the class here" type="text"/> 
      </InputGroup> */}
      {/* <ContentField value={content}  placeholder='Enter Announcement here'  onChange={value => setContent(value)} /> */}
      <ContentRichText value={content}  placeholder='Enter Announcement here'  onChange={value => setContent(value)} />
      <div style={{textAlign:'right', paddingTop:'15px'}}>
        <Button className='tficolorbg-button' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>&nbsp;
        <Button className='tficolorbg-button' type='submit' >Update Announcement</Button>
      </div>
      </Form>
      </Card.Body>
    </Card>

          </Modal.Body>
      </Modal>
      <SweetAlert 
          success
          show={editNotify} 
          title="Done!" 
          onConfirm={closeNotify}>
        </SweetAlert>
    </div>
  )
}

export default EditAnnouncement

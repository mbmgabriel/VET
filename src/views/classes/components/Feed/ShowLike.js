import React from 'react'
import { Button, Form, Modal } from "react-bootstrap";

function ShowLike({feedItemLike, showLike, setShowLike}) {

  console.log('qweasd:',feedItemLike)

  return (
    <> <Modal
    size='sm'
    className='modal-all'
    show={showLike}
    onHide={() => setShowLike(false)}
    centered
  >
    <Modal.Header className='modal-header' closeButton>
      Likes
    </Modal.Header>
    <Modal.Body className='modal-label b-0px'>
      {feedItemLike?.likes?.map(item => {
        return(
          <><i class="fas fa-user-circle fas-1x" ></i>&nbsp;{item?.likeBy}<br /></>
        )
      })}
    </Modal.Body>
  </Modal></>
  )
}

export default ShowLike
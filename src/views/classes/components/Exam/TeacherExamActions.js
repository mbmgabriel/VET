import React, {useContext, useState} from "react";
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { UserContext } from "../../../../context/UserContext";
import { useParams } from "react-router-dom";
import SweetAlert from 'react-bootstrap-sweetalert';

export default function TeacherExamActions({
  exam,
  setShowModal,
  setShowEditModal,
  setShowWarning,
  toggleShare,
  getInformationExam
}) {

  const { data } = useContext(UserContext);
  const { user } = data;
  const {id} = useParams();
  const [openSweetAlert, setOpenSweetAlert] = useState(false)

  const hanldeSweetAlert = () => {
    setOpenSweetAlert(true)
  }

  let ifUserCreatedExam = exam.test.classId == id;
  const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit
    </Tooltip>
  )

  const renderTooltipPreview = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Preview
    </Tooltip>
  )

  const renderTooltipShare = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Share
    </Tooltip>
  )

  const renderTooltipUnShare = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Unshare
    </Tooltip>
  )

  const renderTooltipAssign = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Assign
    </Tooltip>
  )
  
  const renderTooltipReassign = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Reassign
    </Tooltip>
  )

  const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete
    </Tooltip>
  )

  console.log('exam123:', exam)

  const handleAssignNotify = () => {
    setOpenSweetAlert(false)
    toggleShare()
  }

  return (
    <>
        <SweetAlert
          warning
          showCancel
          show={openSweetAlert}
          confirmBtnText={exam.test.isShared ? "Yes, UnShare it!" : "Yes, Share it!"}
          confirmBtnBsStyle="danger"
          title="Are you sure?"
          onConfirm={(e) => handleAssignNotify()}
          onCancel={() => setOpenSweetAlert(false)}
          focusCancelBtn
        >
          {exam.test.isShared ? "Once this quiz is Unshared, You can update/edit this exam. Would you like to continue?" : "Once this quiz is shared, You can no longer update/edit this exam. Would you like to continue?"}
        
        </SweetAlert>
    <div className='exam-actions'>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 1, hide: 0 }}
        overlay={renderTooltipPreview}>
        <a href='#preview'
        >
          <i
            class='fas fa-eye'
            onClick={(e) => {
              getInformationExam(e, exam?.test?.id)
            }}
          ></i>
        </a>
      </OverlayTrigger>
      {exam.test.classId && ifUserCreatedExam && (
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 1, hide: 0 }}
        overlay={exam.test.isShared ? renderTooltipUnShare : renderTooltipShare}>
        <a
          href='#share'
          onClick={(e) => {
            e.preventDefault();
            hanldeSweetAlert();
          }}
        >
          <i class={`fas fa-share ${exam.test.isShared && "rotate"}`}></i>
        </a>
      </OverlayTrigger>
      ) }
       {exam?.isScheduled?(<>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 1, hide: 0 }}
        overlay={renderTooltipReassign}>
        <a
          href='#assign'
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
         <i class="fas fa-clock"></i>
         </a>
         </OverlayTrigger>
          </>):(<>
            <OverlayTrigger
        placement="bottom"
        delay={{ show: 1, hide: 0 }}
        overlay={renderTooltipAssign}>
        <a
          href='#assign'
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
         <i class='fas fa-user-clock'></i>
         </a>
         </OverlayTrigger>
          </>)}
          
        
      
      {exam.test.classId != null && !exam.test.isShared && (
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 1, hide: 0 }}
        overlay={renderTooltipEdit}>
        <a
          href='#edit'

          onClick={(e) => {
            e.preventDefault();
            setShowEditModal(true);
          }}
        >
          <i class='fas fa-edit'></i>
        </a>
      </OverlayTrigger>
      )}
      {exam.classTest == null && (
        <>
          {exam.test.classId != null && !exam.test.isShared && (
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 1, hide: 0 }}
            overlay={renderTooltipDelete}>
              <a
                href='#delete'
                onClick={(e) => {
                  e.preventDefault();
                  setShowWarning(true);
                }}
              >
                <i class='fas fa-trash-alt'></i>
              </a>
          </OverlayTrigger>
          )}
        </>
      )}
    </div>
    </>
  );
}

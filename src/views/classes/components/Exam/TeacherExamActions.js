import React from "react";
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

export default function TeacherExamActions({
  exam,
  setShowModal,
  setShowEditModal,
  setShowWarning,
  toggleShare,
  getInformationExam
}) {

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

  return (
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
      {exam.test.classId && (
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 1, hide: 0 }}
        overlay={exam.test.isShared ? renderTooltipUnShare : renderTooltipShare}>
        <a
          href='#share'
          onClick={(e) => {
            e.preventDefault();
            toggleShare();
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
  );
}

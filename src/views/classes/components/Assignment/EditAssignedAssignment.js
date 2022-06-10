import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Button } from "react-bootstrap";
import ClassesAPI from "../../../../api/ClassesAPI";
import { useParams } from "react-router";
import SweetAlert from "react-bootstrap-sweetalert";
import moment from "moment";
import { toast } from "react-toastify";
import { UserContext } from "../../../../context/UserContext";

function EditAssignedAssignment({
  selectedAssignmentName,
  moduleId,
  getAssignmentList,
  editAssignedAssignmentToggle,
  editAssignedAssignmentModal,
  editAssignAssignmentItem,
}) {
  console.log("this is edit assignAssignment:", editAssignAssignmentItem);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editNotufy, setEditNotify] = useState(false);
  const { id } = useParams();

  const userContext = useContext(UserContext);
  const { notify } = userContext.data;

  const notifyStudent = () => {
    const config = {
      description: `assignment ${selectedAssignmentName} to you.`,
      activityType: "",
      classId: `${id}`,
    };
    console.log({ notification: config });
    notify(config);
  };

  const closeNotify = () => {
    setEditNotify(false);
  };

  const updateAssignAssignment = async (e) => {
    e.preventDefault();
    let assignmentId = editAssignAssignmentItem?.assignment?.id;
    let response = await new ClassesAPI().updateAssignAssignment(
      id,
      assignmentId,
      { startDate, startTime, endDate, endTime }
    );
    if (response.ok) {
      // alert("updated")
      notifyStudent();
      editAssignedAssignmentToggle(e);
      success();
      getAssignmentList(null, moduleId);
    } else {
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
  };

  useEffect(() => {
    if (editAssignAssignmentItem !== null) {
      setStartDate(editAssignAssignmentItem?.classAssignment?.startDate);
      setStartTime(editAssignAssignmentItem?.classAssignment?.startTime);
      setEndDate(editAssignAssignmentItem?.classAssignment?.endDate);
      setEndTime(editAssignAssignmentItem?.classAssignment?.endTime);
    }
  }, [editAssignAssignmentItem]);

  const success = () => {
    toast.success("Successfully reassigned assignment", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div>
      <Modal
        size='lg'
        show={editAssignedAssignmentModal}
        onHide={editAssignedAssignmentToggle}
        aria-labelledby='example-modal-sizes-title-lg'
      >
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id='example-modal-sizes-title-lg'>
            Edit Assign Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateAssignAssignment}>
            <Form.Group className='mb-3'>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type='date'
                onChange={(e) => setStartDate(e.target.value)}
                defaultValue={moment(
                  editAssignAssignmentItem?.classAssignment?.startDate
                ).format("YYYY-MM-DD")}
              />
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type='time'
                onChange={(e) => setStartTime(e.target.value)}
                defaultValue={
                  editAssignAssignmentItem?.classAssignment?.startTime
                }
              />
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type='date'
                onChange={(e) => setEndDate(e.target.value)}
                defaultValue={moment(
                  editAssignAssignmentItem?.classAssignment?.endDate
                ).format("YYYY-MM-DD")}
              />
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type='time'
                onChange={(e) => setEndTime(e.target.value)}
                defaultValue={
                  editAssignAssignmentItem?.classAssignment?.endTime
                }
              />
            </Form.Group>
            <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit'>
                Save
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      <SweetAlert
        success
        show={editNotufy}
        title='Done!'
        onConfirm={closeNotify}
      ></SweetAlert>
    </div>
  );
}
export default EditAssignedAssignment;

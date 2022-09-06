import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";
import ExamAPI from "../../../../api/ExamAPI";
import { UserContext } from "../../../../context/UserContext";
import SweetAlert from 'react-bootstrap-sweetalert';

export default function AssignExam({ showModal, setShowModal, exam, id, setLoading, fetchExams, closeModal }) {
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const userContext = useContext(UserContext)
  const {notify} = userContext.data
  const [openSweetAlert, setOpenSweetAlert] = useState(false)

  const hanldeSweetAlert = () => {
    setOpenSweetAlert(true)
  }

  const handleAssignNotify = () => {
    setOpenSweetAlert(false)
    assignExam()
  }

  // const toggle = () => {
  //   setShowModal(false)
  //   setEndDate('')
  //   setEndTime('')
  //   setStartDate('')
  //   setStartTime('')
  //   setTimeLimit('')
  // }

  useEffect(() => {
    if(exam.classTest){
      let { endDate, endTime, startDate, startTime, timeLimit} = exam?.classTest;
      let startD = moment(startDate).format('YYYY-MM-DD'),
        endD = moment(endDate).format('YYYY-MM-DD');
      setEndDate(endD);
      setEndTime(endTime);
      setStartDate(startD);
      setStartTime(startTime);
      setTimeLimit(timeLimit);
    }
  }, [exam])

  const assignExam = async() => {
    if(endDate == '' || endTime == '' || startDate== '' || startTime == '' || timeLimit == ''){
      toast.error('Please input all the required fields.')
    }else if(timeLimit <= 1){
      toast.error('Time limit should be greater than 1 minute.')
    }else{
      const data = {
        allowLate: true,
        endDate,
        endTime,
        startDate,
        startTime,
        timeLimit,
      };
      console.log({ data }, exam);
      setLoading(true);
      console.log(startDate == endDate);
      let compareDate = startDate == endDate,
        compareTime = startTime < endTime;
      if(compareDate){
        if(compareTime){
          handleSendRequest(data)
        }
        else{
          setLoading(false);
          toast.error('Time limit should be greater than 1 minute.')
        }
      }else{
        handleSendRequest(data)
      }

    }  
  };

  const notifyStudent = () => {
    const config = {
      "description": `exam ${exam.test.testName} to you.`, 
      "activityType": "", 
      "classId": `${id}`
    }
    notify(config)
  }

  const handleSendRequest = async(data) => {
    if(exam.classTest){
      let response = await new ExamAPI().reAssignExam(id, exam.test.id, data)
      if(response.ok){
        toast.success("Exam assigned successfully")
        notifyStudent()
        fetchExams()
        closeModal()
      }else{
        toast.error(response?.data?.errorMessage || "Something went wrong while deleting the exam")
        setLoading(false);
      }
    }
    else{
      let response = await new ExamAPI().assignExam(id, exam.test.id, data)
      if(response.ok){
        toast.success("Exam assigned successfully")
        notifyStudent()
        fetchExams()
        closeModal()
      }else{
        toast.error(response?.data?.errorMessage || "Something went wrong while deleting the exam")
        setLoading(false);
      }
    }
  }

  return (
  <>
        <SweetAlert
          warning
          showCancel
          show={openSweetAlert}
          confirmBtnText="Yes, Assign it!"
          confirmBtnBsStyle="danger"
          title="Are you sure?"
          onConfirm={(e) => handleAssignNotify()}
          onCancel={() => setOpenSweetAlert(false)}
          focusCancelBtn
        >
          Once this quiz is assigned,You can no longer update/edit this exam.
Would you like to continue?        
        </SweetAlert>
    <Modal
      size='lg'
      className='modal-all'
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header className='modal-header' closeButton>
        {exam.classTest == null ? 'Assign Exam' :' Reassign Exam'}
      </Modal.Header>
      <Modal.Body className='modal-label b-0px'>
        
        <Form.Group className='m-b-20'>
            <Form.Label for='courseName'>Start Date </Form.Label>
            <Form.Control
              defaultValue={""}
              value={startDate}
              className='custom-input'
              size='lg'
              type='date'
              placeholder='Enter exam name'
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='m-b-20'>
            <Form.Label for='courseName'>Start Time </Form.Label>
            <Form.Control
              defaultValue={""}
              value={startTime}
              className='custom-input'
              size='lg'
              type='time'
              placeholder='Enter exam name'
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='m-b-20'>
            <Form.Label for='courseName'>End Date </Form.Label>
            <Form.Control
              defaultValue={""}
              value={endDate}
              className='custom-input'
              size='lg'
              type='date'
              min={startDate}
              placeholder='Enter exam name'
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='m-b-20'>
            <Form.Label for='courseName'>End Time </Form.Label>
            <Form.Control
              defaultValue={""}
              value={endTime}
              className='custom-input'
              size='lg'
              type='time'
              disabled={endDate ? false : true}
              placeholder='Enter exam name'
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className='m-b-20'>
            <Form.Label for='courseName'>Time Limit</Form.Label>
            <Form.Control
              defaultValue={""}
              value={timeLimit}
              className='custom-input'
              size='lg'
              type='number'
              placeholder='Time limit'
              onChange={(e) => setTimeLimit(e.target.value)}
            />
          </Form.Group>

          <span style={{ float: "right" }}>
            <Button className='tficolorbg-button' type='submit' onClick={ exam.classTest == null ? hanldeSweetAlert : assignExam}>
            {exam.classTest == null ? 'Save Exam' :' Update Exam'}
            </Button>
          </span>
        
      </Modal.Body>
    </Modal>
    </>
  );
}

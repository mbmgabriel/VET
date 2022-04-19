import React, { useContext, useState, useEffect } from "react";
import { InputGroup, FormControl, Button, Modal, Form } from "react-bootstrap";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { ToastContainer, toast } from 'react-toastify';
import ExamAPI from "../../../../api/ExamAPI";
import { UserContext } from "../../../../context/UserContext";

function ClassExamHeader({ onSearch, modules = [],fetchExams}, ) {
  const {id} = useParams();
  const { data } = useContext(UserContext);
  const { user } = data;
  const [showModal, setShowModal] = useState(false);
  const [testName, setTestName] = useState("");
  const [testInstructions, setTestInstructions] = useState("");
  const [module, setModule] = useState(modules[0]?.id)

  useEffect(() => {
    setModule(modules[0]?.id)
  }, [modules])

  const submitForm = async(e)  => {
    e.preventDefault()
    const data = {
      "test": {
        "moduleItemId": module,
        testName,
        testInstructions,
        "classId": id,
        isShared: false
      }
    }
    console.log({id, module, data})
    let response = await new ExamAPI().createExam(id, module, data)
    if(response.ok){
      toast.success("Successfully created the exam")
      await fetchExams()
      setShowModal(false)
      console.log("")
    }else{
      alert("Something went wrong while creating exam")
    }
  }
  return (
    <div>
      <div className="row m-b-20">
        <div className="col-md-10 pages-header">
          <h1 className="exam-title">Exam </h1>
          {user.isTeacher && 
            <>
              <Button
                className="btn-create-exam"
                Button
                variant="link"
                onClick={() => setShowModal(true)}
              >
                <i className="fa fa-plus"></i> Create Exam
              </Button>
              {/* <h4 className="exam-or">OR</h4>
              <Button className="btn-create-exam" Button variant="link" onClick={() => toast.error("Feature under development")}>
                <i className="fa fa-plus"></i> Import Exam --
              </Button> */}
            </>
          }
        </div>
      </div>
      <div className="row m-b-20">
        <div className="col-md-12">
          <InputGroup size="lg">
            <FormControl
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              placeholder="Search..."
              type="search"
              onChange={(e) => onSearch(e.target.value)}
            />
            <InputGroup.Text id="basic-addon2" className="search-button">
              <i className="fas fa-search fa-1x"></i>
            </InputGroup.Text>
          </InputGroup>
        </div>
      </div>
      <Modal
        size="lg"
        className="modal-all"
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header className="modal-header" closeButton>
          Create Exam
        </Modal.Header>
        <Modal.Body className="modal-label b-0px">
          <Form onSubmit={submitForm}>
            <Form.Group className="m-b-20">
              <Form.Label for="courseName">Module</Form.Label>
              <Form.Select aria-label="Default select example" onChange={(e) => setModule(e.target.value)}>
                {modules.map((item, index) => {
                  console.log({item})
                  return <option key={index} value={item.id}>{item.moduleName}</option>
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="m-b-20">
              <Form.Label for="courseName">Test Name</Form.Label>
              <Form.Control
                defaultValue={""}
                className="custom-input"
                size="lg"
                type="text"
                placeholder="Enter test name"
                onChange={(e) => setTestName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="m-b-20">
              <Form.Label for="description">Test Instructions</Form.Label>
              <Form.Control
                defaultValue={""}
                className="custom-input"
                size="lg"
                type="text"
                placeholder="Enter test instructions"
                onChange={(e) => setTestInstructions(e.target.value)}
              />
            </Form.Group>

            <span style={{ float: "right" }}>
              <Button className="tficolorbg-button" type="submit">
                Save
              </Button>
            </span>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default ClassExamHeader;

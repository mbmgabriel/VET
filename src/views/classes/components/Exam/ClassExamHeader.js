import React, { useContext, useState, useEffect } from "react";
import { InputGroup, FormControl, Button, Modal, Form } from "react-bootstrap";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from 'react-toastify';
import ExamAPI from "../../../../api/ExamAPI";
import ContentField from "../../../../components/content_field/ContentField";
import { UserContext } from "../../../../context/UserContext";
import ClassCourseFileLibrary from "../ClassCourseFileLibrary";

function ClassExamHeader({ onSearch, modules = [],fetchExams, onRefresh}, ) {
  const {id} = useParams();
  const { data } = useContext(UserContext);
  const { user } = data;
  const [showModal, setShowModal] = useState(false);
  const [testName, setTestName] = useState("");
  const [testInstructions, setTestInstructions] = useState("");
  const [module, setModule] = useState(modules[0]?.id)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [showFiles, setShowFiles] = useState(false);

  useEffect(() => {
    setModule(modules[0]?.id)
  }, [modules])

  const submitForm = async(e)  => {
    e.preventDefault()
    setIsButtonDisabled(true)
    setTimeout(()=> setIsButtonDisabled(false), 2000)
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
      toast.error("Please input all the required fields.")
    }
  }
  return (
    <div>
      <div className="row m-b-20">
        <div className="col-md-10 pages-header fd-row mr-3"><p className='title-header m-0'>Exam </p>
          <div>
            <Button onClick={() => onRefresh()} className='ml-3'>
              <i className="fa fa-sync"></i>
            </Button>
          </div>
          {
            user.isTeacher && 
              <p className='title-header m-0-dashboard'>
                <Button 
                  className='btn-create-task' 
                  Button variant="link" 
                  onClick={() => setShowModal(true) }
                >
                  <i className="fa fa-plus" /> Create Exam</Button>
              </p>
          }
        </div> 

      </div>
      <div className="row m-b-20">
        <div className="col-md-12">
          <InputGroup size="lg">
            <FormControl
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              placeholder="Search Exam Here"
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
          <div className={showFiles ? 'mb-3' : 'd-none'}>
            <ClassCourseFileLibrary />
          </div>
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
              <Form.Label for="courseName">Exam Name</Form.Label>
              <Form.Control
                defaultValue={""}
                className="custom-input"
                size="lg"
                type="text"
                placeholder="Enter exam name"
                onChange={(e) => setTestName(e.target.value)}
              />
            </Form.Group>
            <div>
                  <Button className='float-right my-2' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
                </div>
            <Form.Group className="m-b-20">
              <Form.Label for="description">Exam Instructions</Form.Label>
              {/* <Form.Control
                defaultValue={""}
                className="custom-input"
                size="lg"
                type="text"
                placeholder="Enter exam instructions"
                onChange={(e) => setTestInstructions(e.target.value)}
              /> */}
              <ContentField value={testInstructions}  placeholder='Enter instruction here'  onChange={value => setTestInstructions(value)} />
            </Form.Group>

            <span style={{ float: "right" }}>
              <Button disabled={isButtonDisabled} className="tficolorbg-button" type="submit">
                Save Exam
              </Button>
            </span>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default ClassExamHeader;

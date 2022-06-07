import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import CoursesAPI from "../../../../api/CoursesAPI";
import ExamAPI from "../../../../api/ExamAPI";
import ContentField from "../../../../components/content_field/ContentField";
import ContentViewer from "../../../../components/content_field/ContentViewer";
import QuestionActions from "./QuestionActions";
import FilesAPI from '../../../../api/FilesApi'
import FileHeader from "../../../courses/components/AssignmentFileHeader";

const EssayForm = ({
  showModal,
  setShowModal,
  onSubmit,
  question,
  setQuestion,
  rate,
  setRate,
  editQuestion
}) => {

  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  const courseid = sessionStorage.getItem('courseid')

  const handleGetCourseFiles = async() => {
    // setLoading(true)
    let response = await new FilesAPI().getCourseFiles(courseid)
    // setLoading(false)
    if(response.ok){
      console.log(response, '-----------------------')
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      alert("Something went wrong while fetching class files.")
    }
  }

  useEffect(() => {
    if(window.location.pathname.includes('course')){
    handleGetCourseFiles()
    }
  }, [])

  return (
    <Modal
      size='lg'
      className='modal-all'
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header className='modal-header' closeButton>
        {editQuestion ? <>Question Form</> : <>Edit Question Form</>}
      </Modal.Header>
      <Modal.Body className='modal-label b-0px'>
        <Form onSubmit={onSubmit}>
        <div className={showFiles ? 'mb-3' : 'd-none'}>
          <FileHeader type='Course' id={courseid}  subFolder={''} doneUpload={()=> handleGetCourseFiles()} />
          {/* {
            (displayFiles || []).map( (item,ind) => {
              return(
                <img src={item.pathBase.replace('http:', 'https:')} className='p-1' alt={item.fileName} height={30} width={30}/>
              )
            })
          } */}
          {
          (displayFiles || []).map( (item,ind) => {
            return(
              item.pathBase?.match(/.(jpg|jpeg|png|gif|pdf)$/i) ? 
              <img key={ind+item.name} src={item.pathBase.replace('http:', 'https:')} className='p-1' alt={item.name} height={30} width={30}/>
              :
              <i className="fas fa-sticky-note" style={{paddingRight: 5}}/>
            )
          })
          }
          {
            (displayFolder || []).map((itm) => {
              return(
                <i className='fas fa-folder-open' style={{height: 30, width: 30}}/>
              )
            })
          }
        </div>
        <div>
          <Button className='float-right my-2' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
        </div>
          <Form.Group className='m-b-20'>
            <Form.Label for='question'>Question</Form.Label>
            <ContentField value={question} placeholder="Enter test question" onChange={value => setQuestion(value)} />

          </Form.Group>
          <Form.Group className='m-b-20'>
            <Form.Label for='question'>Points</Form.Label>
            <Form.Control
              defaultValue={""}
              value={rate}
              className='custom-input'
              size='lg'
              type='number'
              placeholder='Enter test points'
              onChange={(e) => setRate(e.target.value)}
            />
          </Form.Group>

          <span style={{ float: "right" }}>
            <Button className='tficolorbg-button' type='submit'>
              {editQuestion ? <>Save Question</> : <>Update Question</>}
            </Button>
          </span>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default function Essay({
  part,
  questionTypeId,
  getExamInformation,
  setLoading,
  deleteQuestion,
  editable,
}) {
  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [rate, setRate] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const { id, examid } = useParams();
  const courseid = sessionStorage.getItem('courseid')
  const [courseInfos, setCourseInfos] = useState([])
  const [editQuestion, setEditQuestion] = useState('')

  const getCourseInformation = async () =>{
    let response = await new CoursesAPI().getCourseInformation(courseid)
    if(response.ok){
      setCourseInfos(response.data)
    }
  }

  useEffect(() => {
    getCourseInformation();
  }, [])

  const submitQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      questionTypeId,
      questionPartId: part.questionPart.id,
      testQuestion: question,
      questionImage: "",
      rate,
    };
    if(selectedId != null){
      if(rate > 0 && rate < 101){
        updateQuestion(selectedId, data)
      }else{
        setLoading(false)
        toast.error('Rate should be greater than 1 and less than 100.')
      }
    }else{
      if(rate > 0 && rate < 101){
        addQuestion(data);
      }else{
        setLoading(false)
        toast.error('Rate should be greater than 1 and less than 100.')
      }
    }
  };

  const updateQuestion = async (questionId, data) => {
    let response = await new ExamAPI().editEssay(questionId, data);
    if (response.ok) {
      setShowModal(false);
      toast.success("Successfully updated question");
      getExamInformation();
      setRate(1);
      setQuestion("");
      setSelectedId(null);
    } else {
      toast.error(
        response.data?.errorMessage ||
          "Something went wrong while updating the question"
      );
      setLoading(false);
    }
  };

  const addQuestion = async (data) => {
    let response = await new ExamAPI().addEssay(examid, part.questionPart.id, data);
    if (response.ok) {
      setShowModal(false);
      toast.success("Successfully added question");
      getExamInformation();
      setRate(1);
      setQuestion("");
      setSelectedId(null);
    } else {
      toast.error(
        response.data?.errorMessage ||
          "Something went wrong while creating the part"
      );
      setLoading(false);
    }
  };

  return (
    <div>
      {part.questionDtos.map((question, index) => (
        <div key={index} className='d-flex hover-link p-3 rounded'>
          <div style={{ flex: 1 }}>
            <p className='primary-title' title="">
              <ContentViewer>{question.question.testQuestion}</ContentViewer>
            </p>
            <p className='' title="">Point(s): {question.question.rate}</p>
          </div>
          {editable && (
            <QuestionActions
              onDelete={(e) => deleteQuestion(e, question.question.id)}
              onEdit={(e) => {
                setSelectedId(question.question.id);
                setQuestion(question.question.testQuestion);
                setRate(question.question.rate);
                setShowModal(true);
                setEditQuestion('')
              }}
            />
          )}
        </div>
      ))}
      {courseInfos?.isTechfactors? (<></>):(<>
        {editable && (
        <Button
          title=""
          className='tficolorbg-button m-r-5'
          type='submit'
          onClick={() => {
            setQuestion("");
            setRate("");
            setShowModal(true);
            setEditQuestion('1')
          }}
        >
          Add question
        </Button> 
      )}
      </>)}
      <EssayForm
        showModal={showModal}
        setShowModal={setShowModal}
        question={question}
        setQuestion={setQuestion}
        rate={rate}
        setRate={setRate}
        onSubmit={submitQuestion}
        editQuestion={editQuestion}
      />
    </div>
  );
}

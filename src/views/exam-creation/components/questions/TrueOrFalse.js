import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import CoursesAPI from "../../../../api/CoursesAPI";
import ExamAPI from "../../../../api/ExamAPI";
import ContentField from "../../../../components/content_field/ContentField";
import ContentViewer from "../../../../components/content_field/ContentViewer";
import QuestionActions from "./QuestionActions";
import FileHeader from "../../../courses/components/AssignmentFileHeader";
import FilesAPI from '../../../../api/FilesApi'
import {writeFileXLSX, utils} from "xlsx";
import { displayQuestionType } from "../../../../utils/displayQuestionType";
import { UserContext } from '../../../../context/UserContext';
import CourseFileLibrary from "../../../courses/components/CourseFileLibrary";
import ClassCourseFileLibrary from '../../../classes/components/ClassCourseFileLibrary';

const TrueOrFalseForm = ({
  showModal,
  setShowModal,
  onSubmit,
  question,
  setQuestion,
  rate,
  setRate,
  answer,
  setAnswer,
  editQuestion,
  isButtonDisabled
}) => {
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  const courseid = sessionStorage.getItem('courseid')
  const { id } = useParams();
  const tabType = window.location.pathname.includes("class") ? true : false; // if class or course

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
          {tabType ? <ClassCourseFileLibrary /> : <CourseFileLibrary />}
        </div>
        <div>
          <Button className='float-right file-library-btn my-2' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
        </div>
          <Form.Group className='m-b-20'>
            <Form.Label for='question'>Question</Form.Label>
            <ContentField withTextInput={true} placeholder='Enter exam question' value={question} onChange={value => setQuestion(value)} />
          </Form.Group>
          <Form.Group className='m-b-20'>
            <Form.Label for='question'>Points</Form.Label>
            <Form.Control
              defaultValue={""}
              value={rate}
              className='custom-input'
              size='lg'
              type='number'
              placeholder='Enter exam points'
              onChange={(e) => setRate(e.target.value)}
            />
          </Form.Group>
          <hr />
          <Form.Group className='m-b-20'>
            <Form.Label for='question'>Answer</Form.Label>
            {/* <Form.Control
              defaultValue={""}
              value={answer}
              className='custom-input'
              size='lg'
              type='text'
              placeholder='Enter exam instructions'
              onChange={(e) => setAnswer(e.target.value)}
            /> */}
            <Form.Select
              aria-label='Default select example'
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            >
              <option value='true'>True</option>
              <option value='false'>False</option>
            </Form.Select>
          </Form.Group>
          <span style={{ float: "right" }}>
            <Button disabled={isButtonDisabled} className='tficolorbg-button' type='submit'>
              {editQuestion ? <>Save Question</> : <>Update Question</>}
            </Button>
          </span>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default function TrueOrFalse({
  part,
  questionTypeId,
  getExamInformation,
  setLoading,
  deleteQuestion,
  editable,
  examName,
  shared
}) {
  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [rate, setRate] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("true");
  const { id,  examid} = useParams();
  const courseid = sessionStorage.getItem('courseid')
  const [courseInfos, setCourseInfos] = useState([])
  const [editQuestion, setEditQuestion] = useState('')
  const [data, setData] = useState([]);
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const contentCreator = user?.teacher?.positionID == 7;
  const isCourse = window.location.pathname.includes('course');
  const [isContributor, setIsContributor] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const ifCoursetab = window.location.pathname.includes('course') ? true : !shared;

  const getContributor = async() => {
    let response = await new CoursesAPI().getContributor(id)
    if(response.ok){
      let temp = response.data;
      let ifContri = temp.find(i => i.userInformation?.userId == user.userId);
      setIsContributor(ifContri ? true : false);
    }
  }
  const getCourseInformation = async () =>{
    let response = await new CoursesAPI().getCourseInformation(courseid)
    if(response.ok){
      setCourseInfos(response.data)
    }
  }

  useEffect(() => {
    if(window.location.pathname.includes('course')){
      getContributor();
      getCourseInformation();
    }
    // getContributor();
    // getCourseInformation();
  }, [])

  useEffect(() => {
    handleGetItems();
  },[part])

  const submitQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      question: {
        testQuestion: question,
        rate,
      },
      answer,
    };
    if (selectedQuestion != null) {
      if(rate > 0 && rate < 101){
        updateQuestion(selectedQuestion, data);
      }else{
        setLoading(false)
        toast.error('Rate should be greater than 1 and less than 100.')
      }
    } else {
      if(rate > 0 && rate < 101){
        addQuestion(data);
      }else{
        setLoading(false)
        toast.error('Rate should be greater than 1 and less than 100.')
      }
    }
  };

  const updateQuestion = async (selectedQuestion, data) => {
    console.log('data1213:', data)
    setIsButtonDisabled(true)
    let response = await new ExamAPI().editTrueOrFalse(
      selectedQuestion.question.id,
      data.question
    );
    // let a = selectedQuestion.choices[0].isCorrect === true  && selectedQuestion.choices[0].testChoices === "True" ? selectedQuestion.choices[1].id : selectedQuestion.choices[0].id
    // let b = selectedQuestion.choices[0].isCorrect === true  && selectedQuestion.choices[0].testChoices === "True" ? selectedQuestion.choices[1].testChoices : selectedQuestion.choices[0].testChoices
      let a = data.answer === 'false' ? selectedQuestion.choices[1].id : selectedQuestion.choices[0].id
      let b = data.answer === 'false' ? selectedQuestion.choices[1].testChoices : selectedQuestion.choices[0].testChoices 

    if (response.ok) {
      response = await new ExamAPI().editTrueOrFalseAnswer(
        a,
        {
          isCorrect: true,
          testChoices: b,
        }
      );
      if (response.ok) {
        setShowModal(false);
        toast.success("Successfully updated question");
        getExamInformation();
        setRate(1);
        setQuestion("");
        setAnswer("true");
        setSelectedQuestion(null);
        setIsButtonDisabled(false)
      } else {
        toast.error(
          response.data?.errorMessage ||
            "Something went wrong while updating the question"
        );
        setLoading(false);
        setIsButtonDisabled(false)
      }
    } else {
      toast.error(
        response.data?.errorMessage ||
          "Something went wrong while updating the question"
      );
      setLoading(false);
      setIsButtonDisabled(false)
    }
  };

  const addQuestion = async (data) => {
    let response = await new ExamAPI().addTrueOrFalse(
      examid,
      part.questionPart.id,
      data
    );
    if (response.ok) {
      setShowModal(false);
      toast.success("Successfully added question");
      getExamInformation();
      setRate(1);
      setQuestion("");
      setSelectedQuestion(null);
    } else {
      toast.error(
        response.data?.errorMessage ||
        "Something went wrong while creating the part"
        );
        setLoading(false);
      }
  };

  const handleGetItems = () => {
    let tempData =[]
    part.questionDtos.map((question, index) => {
      let temp= {};
      temp.question = question.question.testQuestion
      question.choices.map((choice, ind) =>{
        temp[`choice${ind+1}`] = choice.testChoices;
        temp[`isCorrect${ind+1}`] = choice.isCorrect ? 1 : 0;
      })
      temp[`choice3`] = '';
      temp[`isCorrect3`] = 0;

      temp[`choice4`] = '';
      temp[`isCorrect4`] = 0;
      temp.rate = question.question.rate
      tempData.push(temp)
    })
    setData(tempData)
  }

  const downloadxls = (e, data) => {
    e.preventDefault();
    const ws =utils.json_to_sheet(data);
    const wb =utils.book_new();
   utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    writeFileXLSX(wb, `${examName}_${displayQuestionType(part.questionPart.questionTypeId)}.xlsx`);
  };

  return (
    <div>
      {courseInfos?.isTechfactors && contentCreator && isCourse && <Button className='tficolorbg-button m-r-5 mb-3' onClick={(e) => downloadxls(e, data)} >Export Exam Part</Button>}
      <br/>
      {part.questionDtos.map((question, index) => (
        <div key={index} className='d-flex hover-link p-3 rounded'>
          <div style={{ flex: 1 }}>
            <p className='primary-title' title="">
              <ContentViewer>{question.question.testQuestion}</ContentViewer>
            </p>
            <p className='' title="">Answer: {question.answer}</p>
            <p className='' title="">Point(s): {question.question.rate}</p>
          </div>
          {editable && ifCoursetab && isContributor && (
            <QuestionActions
              onDelete={(e) => deleteQuestion(e, question.question.id)}
              onEdit={(e) => {
                setSelectedQuestion(question);
                setQuestion(question.question.testQuestion);
                setAnswer(question.answer);
                setRate(question.question.rate);
                setShowModal(true);
                setEditQuestion('')
              }}
            />
          )}
          
        </div>
      ))}
      {editable && ifCoursetab && isContributor && (
        <Button
          title=""
          className='tficolorbg-button m-r-5'
          type='submit'
          onClick={() => {
            setSelectedQuestion(null);
            setQuestion("");
            setRate("");
            setAnswer("true");
            setShowModal(true);
            setEditQuestion('1')
          }}
        >
          Add question
        </Button>
      )}
      <TrueOrFalseForm
        showModal={showModal}
        setShowModal={setShowModal}
        question={question}
        setQuestion={setQuestion}
        rate={rate}
        setRate={setRate}
        answer={answer}
        setAnswer={setAnswer}
        onSubmit={submitQuestion}
        editQuestion={editQuestion}
        isButtonDisabled={isButtonDisabled}
      />
    </div>
  );
}

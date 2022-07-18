import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import CoursesAPI from "../../../../api/CoursesAPI";
import ExamAPI from "../../../../api/ExamAPI";
import ContentField from "../../../../components/content_field/ContentField";
import ContentViewer from "../../../../components/content_field/ContentViewer";
import DEFAULT_CHOICES from "../../../../contants/default-choices";
import FileHeader from "../../../courses/components/AssignmentFileHeader";
import QuestionActions from "./QuestionActions";
import FilesAPI from '../../../../api/FilesApi'
import { displayQuestionType } from "../../../../utils/displayQuestionType";
import {writeFileXLSX, utils} from "xlsx";
import { UserContext } from '../../../../context/UserContext';
import CourseFileLibrary from "../../../courses/components/CourseFileLibrary";
import ClassCourseFileLibrary from '../../../classes/components/ClassCourseFileLibrary';

const MultipleChoiceForm = ({
  selectedQuestion,
  showModal,
  setShowModal,
  onSubmit,
  question,
  setQuestion,
  rate,
  setRate,
  choices,
  setChoices,
  editQuestion,
  isButtonDisabled
}) => {
  const userContext = useContext(UserContext);
  const { user } = userContext.data;
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  const courseid = sessionStorage.getItem('courseid')
  const { id } = useParams();
  const tabType = window.location.pathname.includes("class") ? true : false; // if class or course
  
  const addQuestion = (e) => {
    e.preventDefault();
    if(choices.length > 8){
      toast.error("You can only add 8 choices")
      return
    }
    setChoices([
      ...choices,
      { choicesImage: null, isCorrect: false, testChoices: "" },
    ]);
  };

  const removeQuestion = (e, index) => {
    if(choices.length <= 2){
      toast.error("You must have at least 2 choices");
      return;
    }

    e.preventDefault()
    let tempChoices = choices.filter((choice, i) => i !== index)
    let hasAnswer = false
    tempChoices.forEach(choice => {
      if(choice.isCorrect) hasAnswer = true
    })
    if(!hasAnswer) {
      tempChoices[0].isCorrect = true
    }
    setChoices([...tempChoices])
  };


  return (
    <Modal
      size='lg'
      className='modal-all modal-adjust'
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
            <ContentField
              value={question}
              placeholder='Enter exam question'
              onChange={(value) => setQuestion(value)}
            />
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
            <Form.Label for='question'>Choices</Form.Label>
            <div>
              {choices.map((choice, index) => {
                const onChoiceTextChange = (key, value) => {
                  // console.log({ key, value });
                  const tempChoices = choices.map((choice, i) => {
                    if (i === key) {
                      return {
                        ...choice,
                        testChoices: value,
                      };
                    }
                    return choice;
                  });
                  setChoices([...tempChoices]);
                };

                const onChoiceAnswerChange = (key) => {
                  // console.log({ key });
                  const tempChoices = choices.map((choice, i) => {
                    if (i === key) {
                      return {
                        ...choice,
                        isCorrect: true,
                      };
                    }
                    return {
                      ...choice,
                      isCorrect: false,
                    };
                  });
                  setChoices([...tempChoices]);
                };
                  
                return (
                  <div
                    key={index}
                    className={`choice-item ${choice.isCorrect && "active"}`}
                  >
                    <div
                      onClick={() => onChoiceAnswerChange(index)}
                      className={`hover-link question-radio ${
                        choice.isCorrect && "active"
                      }`}
                    >
                      <div />
                    </div>
                    <ContentField
                      className='flex-1'
                      value={choice.testChoices}
                      placeholder='Enter exam choices'
                      onChange={(value) => onChoiceTextChange(index, value)}
                    />
                    {selectedQuestion == null && (
                      <a href='#delete-item' className="choice-delete" onClick={(e) => removeQuestion(e, index)}>
                        <i class='fas fa-trash-alt'></i>
                      </a>
                    )}
                    
                  </div>
                );
              })}
              {selectedQuestion == null && (
                <Button
                  className='tficolorbg-button'
                  type='add-question'
                  onClick={addQuestion}
                  >
                  Add Choice 
                </Button>
              )}
            </div>
          </Form.Group>
          <span style={{ float: "right" }}>
            <Button disabled={isButtonDisabled} className='tficolorbg-button' type='submit'>
            {editQuestion ? <>Save Question </> : <>Update Question</>}
            </Button>
          </span>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default function MultipleChoice({
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
  const [answer, setAnswer] = useState("");
  const [choices, setChoices] = useState(DEFAULT_CHOICES);
  const { id, examid } = useParams();
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
    getContributor();
    getCourseInformation();
    handleGetItems()
  }, [])

  useEffect(() => {
    handleGetItems();
  },[part])

  const validChoices = () => {
    let isDuplicated = false;
    choices.forEach((choice, index) => {
      choices.forEach((choice2, index2) => {
        if (index !== index2 && choice.testChoices === choice2.testChoices) {
          isDuplicated = true;
        }
      });
    });

    if (isDuplicated) {
      toast.error("You can't have duplicate choices");
      return false;
    }
    return true
  }
  const submitQuestion = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true)
    setTimeout(()=> setIsButtonDisabled(false), 1000)
    setLoading(true);
    const data = {
      question: {
        questionTypeId,
        questionPartId: part.questionPart.id,
        testQuestion: question,
        questionImage: "",
        rate,
      },
      choices,
    };

    if(!validChoices()){
      setLoading(false);
      return
    }
    
    if (selectedQuestion != null) {
      if (rate > 0 && rate < 101) {
        updateQuestion(selectedQuestion, data);
      } else {
        setLoading(false);
        toast.error("Rate should be greater than 1 and less than 100.");
      }
    } else {
      if (rate > 0 && rate < 101) {
        addQuestion(data);
      } else {
        setLoading(false);
        toast.error("Rate should be greater than 1 and less than 100.");
      }
    }
  };

  const updateQuestion = async (selectedQuestion, data) => {
    setLoading(true);
    let response = await new ExamAPI().editMultipleChoice(
      selectedQuestion.question.id,
      data.question
    );
    if (response.ok) {
      for (let index = 0; index < data.choices.length; index++) {
        const choice = data.choices[index];
        await new ExamAPI().editMultipleChoiceAnswer(choice.id, choice);
      }
      setShowModal(false);
      toast.success("Successfully updated question");
      getExamInformation();
      setRate(1);
      setQuestion("");
      setSelectedQuestion(null);
    } else {
      toast.error(
        response.data?.errorMessage ||
          "Something went wrong while updating the question"
      );
      setLoading(false);
    }
  };

  const addQuestion = async (data) => {
    let response = await new ExamAPI().addMultipleChoice(
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
      setAnswer("");
      setSelectedQuestion(null);
      setChoices(DEFAULT_CHOICES);
    } else {
      toast.error(
        response.data?.errorMessage ||
        "Something went wrong while creating the Question"
        );
        setLoading(false);
      }
  };

  const handleMapChoices = (part) => { // get the choices and identify the largest number of choices
    let lenght = 0;
    let choices = {};
    part.questionDtos.map((question, index) => {
      lenght = question.choices.length > lenght ? question.choices.length : lenght
    })
    for (let i = 0; i < lenght; i++) {
      choices[`choice${i+1}`] = '';
      choices[`isCorrect${i+1}`] = 0;
    }
    return choices;
  }

  const handleGetItems = () => {
    let tempData =[]
    part.questionDtos.map((question, index) => {
      let temp= {
        question: '',
        ...handleMapChoices(part), //map the largest number of choices to put the rate at the end
        rate: 0
      };
      temp.question = question.question.testQuestion //set the temp question
      question.choices.map((choice, ind) =>{ //map choices and fill each fields
        temp[`choice${ind+1}`] = choice.testChoices;
        temp[`isCorrect${ind+1}`] = choice.isCorrect ? 1 : 0;
      })
      temp.rate = question.question.rate //add rate
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
            <h5 title="">Choices</h5>
            <table>
              {question.choices.map((choice, index) => (
                <tr key={index}>
                  <td title="">
                    <ContentViewer>{choice.testChoices}</ContentViewer>
                  </td>
                </tr>
              ))}
            </table>
            <h5 className='font-weight-bold mt-3' title="">
              Answer: <ContentViewer>{question.answer}</ContentViewer>
            </h5>
            <p title="" className=''>Point(s): {question.question.rate}</p>
          </div>
          {editable && !shared && isContributor && (
            <QuestionActions
              onDelete={(e) => deleteQuestion(e, question.question.id)}
              onEdit={(e) => {
                setChoices(question.choices);
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
          className='tficolorbg-button m-r-5'
          type='submit'
          title=""
          onClick={() => {
            setSelectedQuestion(null);
            setQuestion("");
            setRate("");
            setAnswer("");
            setChoices(DEFAULT_CHOICES);
            setShowModal(true);
            setEditQuestion('1')
          }}
        >
          Add question
        </Button>
      )}
      <MultipleChoiceForm
        selectedQuestion={selectedQuestion}
        showModal={showModal}
        setShowModal={setShowModal}
        question={question}
        setQuestion={setQuestion}
        rate={rate}
        setRate={setRate}
        choices={choices}
        setChoices={setChoices}
        onSubmit={submitQuestion}
        editQuestion={editQuestion}
        isButtonDisabled={isButtonDisabled}
      />
    </div>
  );
}

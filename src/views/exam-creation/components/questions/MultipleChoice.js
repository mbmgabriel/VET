import React, { useState, useEffect } from "react";
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
}) => {

  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  const courseid = sessionStorage.getItem('courseid')

  console.log(editQuestion)
  
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
            <ContentField
              value={question}
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
              placeholder='Enter test points'
              onChange={(e) => setRate(e.target.value)}
            />
          </Form.Group>
          <hr />
          <Form.Group className='m-b-20'>
            <Form.Label for='question'>Choices</Form.Label>
            <div>
              {choices.map((choice, index) => {
                const onChoiceTextChange = (key, value) => {
                  console.log({ key, value });
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
                  console.log({ key });
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
            <Button className='tficolorbg-button' type='submit'>
            {editQuestion ? <>Save Question</> : <>Update Question</>}
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
    console.log({ selectedQuestion });
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
      toast.success("Question updated successfully");
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
      toast.success("Question added successfully");
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

  return (
    <div>
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
          {editable && (
            <QuestionActions
              onDelete={(e) => deleteQuestion(e, question.question.id)}
              onEdit={(e) => {
                console.log({ question });
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
      {courseInfos?.isTechfactors? (<></>):(<>
        {editable && (
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
          Add question 1
        </Button>
      )}
      </>)}
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
      />
    </div>
  );
}

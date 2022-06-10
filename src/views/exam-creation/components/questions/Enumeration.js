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
import {writeFileXLSX, utils} from "xlsx";
import { displayQuestionType } from "../../../../utils/displayQuestionType";

const EnumerationForm = ({
  showModal,
  setShowModal,
  onSubmit,
  question,
  setQuestion,
  rate,
  setRate,
  choices,
  setChoices,
  selectedQuestion,
  editQuestion
}) => {
  const addAnswer = () => {
    setChoices([...choices, { testChoices: "", choicesImage: "" }]);
  };

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
          <hr />
          <Form.Group className='m-b-20'>
            <Form.Label for='question'>Answers</Form.Label>
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

                const onDelete = (key) => {
                  const tempChoices = choices.filter((choice, i) => {
                    return i !== key;
                  });
                  setChoices([...tempChoices]);
                };

                return (
                  <div key={index} className={`choice-item`}>
                    <Form.Control
                      defaultValue={""}
                      value={choice.testChoices}
                      className='custom-input'
                      size='lg'
                      type='text'
                      placeholder='Enter Answer'
                      onChange={(e) =>
                        onChoiceTextChange(index, e.target.value)
                      }
                    />
                    {selectedQuestion == null && (
                      <div className='exam-actions '>
                        <a href='#delete-part' onClick={() => onDelete(index)}>
                          <i class='fas fa-trash-alt'></i>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
              {selectedQuestion == null && (
                <Button className='tficolorbg-button' onClick={addAnswer}>
                  Add Answer
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

export default function Enumeration({
  exam,
  part,
  questionTypeId,
  getExamInformation,
  setLoading,
  deleteQuestion,
  editable,
  examName
}) {
  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [rate, setRate] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [choices, setChoices] = useState([]);
  const { id, examid } = useParams();
  const courseid = sessionStorage.getItem('courseid')
  const [courseInfos, setCourseInfos] = useState([])
  const [editQuestion, setEditQuestion] = useState('')
  const [data, setData] = useState([]);

  const getCourseInformation = async () =>{
    let response = await new CoursesAPI().getCourseInformation(courseid)
    if(response.ok){
      setCourseInfos(response.data)
    }
  }

  useEffect(() => {
    handleGetItems();
    getCourseInformation();
  }, [])

  useEffect(() => {
    handleGetItems();
  },[part])

  const submitQuestion = async (e) => {
    e.preventDefault();
    console.log({ selectedQuestion });
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

    if(choices.length == 0){
      toast.error("Please add at least one answer");
      return
    }

    let unique = true
    choices.forEach((choice) => {
      if(choices.filter(c => c.testChoices == choice.testChoices).length > 1){
        unique = false
      }
    })

    if(!unique){
      toast.error("Please add unique answers")
      return
    }
    console.log({choices}, "GO HERE")
    setLoading(true);

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
    setLoading(true);
    let response = await new ExamAPI().editEnumeration(
      selectedQuestion.question.id,
      data.question
    );
    if (response.ok) {
      for (let index = 0; index < data.choices.length; index++) {
        const choice = data.choices[index];
        await new ExamAPI().editEnumerationAnswer(choice.id, choice);
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
    let response = await new ExamAPI().addEnumeration(
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
      setChoices([]);
    } else {
      toast.error(
        response.data?.errorMessage ||
        "Something went wrong while creating the Question"
        );
        setLoading(false);
      }
  };

  const handleGetItems = () => {
    console.log(part.questionDtos, '----------=======')
    let tempData =[]
    part.questionDtos.map((question, index) => {
      let temp= {};
      temp.question = question.question.testQuestion
      // temp.push({question: question.question.testQuestion})
      question.choices.map((choice, ind) =>{
        // console.log(choice.testChoices, '-----', choice.isCorrect)
        temp[`choice${ind+1}`] = choice.testChoices;
        temp[`isCorrect${ind+1}`] = choice.isCorrect ? 1 : 0;

        temp[`choice2`] = '';
        temp[`isCorrect2`] = 0;

        temp[`choice3`] = '';
        temp[`isCorrect3`] = 0;

        temp[`choice4`] = '';
        temp[`isCorrect4`] = 0;
      })
      temp.rate = question.question.rate
      tempData.push(temp)
      console.log({tempData}, {temp}, '------')
    })
    setData(tempData)
  }

  const downloadxls = (e, data) => {
    console.log(data);
    e.preventDefault();
    const ws =utils.json_to_sheet(data);
    const wb =utils.book_new();
   utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    writeFileXLSX(wb, `${examName}_${displayQuestionType(part.questionPart.questionTypeId)}.xlsx`);
  };

  return (
    <div>
      <Button className='tficolorbg-button m-r-5 mb-3' onClick={(e) => downloadxls(e, data)}>Export Exam Part</Button>
      <br/>
      {part.questionDtos.map((question, index) => (
        <div key={index} className='d-flex hover-link p-3 rounded'>
          <div style={{ flex: 1 }}>
            <p className='primary-title' title="">
              <ContentViewer>{question.question.testQuestion}</ContentViewer>
            </p>
            <h5 title="">Answers</h5>
            <table>
              {question.choices.map((choice, index) => (
                <tr key={index}>
                  <td title="">{choice.testChoices}</td>
                </tr>
              ))}
            </table>
            <hr/>
            <p className='' title="">Point(s): {question.question.rate}</p>
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
          title=""
          className='tficolorbg-button m-r-5'
          type='submit'
          onClick={() => {
            setSelectedQuestion(null);
            setQuestion("");
            setRate("");
            setAnswer("");
            setChoices([]);
            setShowModal(true);
            setEditQuestion('1')
          }}
        >
          Add question
        </Button>
      )}
      </>)}
      <EnumerationForm
        showModal={showModal}
        setShowModal={setShowModal}
        question={question}
        setQuestion={setQuestion}
        rate={rate}
        setRate={setRate}
        choices={choices}
        setChoices={setChoices}
        onSubmit={submitQuestion}
        selectedQuestion={selectedQuestion}
        editQuestion={editQuestion}
      />
    </div>
  );
}

import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import React, { useEffect, useState, useContext } from "react";
import { Button } from "react-bootstrap";
import { Redirect, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ClassesAPI from "../../api/ClassesAPI";
import ExamAPI from "../../api/ExamAPI";
import MainContainer from "../../components/layouts/MainContainer";
import { UserContext } from "../../context/UserContext";
import { getDifferenceOfTwoDatesInSeconds } from "../../utils/dateHelpers";
import Logger from "../../utils/logger";
import ExamDetails from "./components/ExamDetails";
import ExamForm from "./components/ExamForm";

export default function ExamInformation() {
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [additionalExamInfo, setAdditionalExamInfo] = useState({});

  const userContext = useContext(UserContext);
  const { user, takeExam, endExam } = userContext.data;
  const { class_id, id } = useParams();

  const getExamInformation = async () => {
    Logger.info("Getting exam information");
    setLoading(true);
    let response = await new ExamAPI().getExamInformation(id);
    let examInformation = null
    if (response.ok) {
      examInformation = response.data;
      setExam(examInformation);
    } else {
      alert("Something went wrong while fetching exam information");
    }
    response = await new ExamAPI().getExams(class_id);
    setLoading(false);
    if (response.ok) {
      const examInfo = response.data.find(
        (item) => item.test.id.toString() === id.toString()
      );
      const duration = (examInfo.classTest?.timeLimit || 0) * 60
      console.log(duration)
      console.log({ examInfo });
      setAdditionalExamInfo(examInfo);
      getExamStatus(duration, examInformation, examInfo)
    } else {
      alert("Something went wrong while fetching exams");
    }
  };

  const getExamStatus = async(duration, exam, examInfo) => {
    setLoading(true)
    Logger.info("Getting exam status");
    let response = await new ExamAPI().getExamStatus(user.student?.id, class_id, id);
    setLoading(false)
    if(response?.data?.id){
      if(response?.data?.isDone){
        Logger.info("Exam is done");
        setRemainingTime(duration)
      }else{
        Logger.info("Exam is ongoing")
        console.log({duration})

        const differenceInSeconds = getDifferenceOfTwoDatesInSeconds(new Date(), new Date(response?.data?.createdDate))
        let remainingSeconds = duration - differenceInSeconds

        if(examInfo.classTest?.endTime && examInfo.classTest?.endDate){
          const endTime = new Date(examInfo.classTest.endDate.replace("00:00", examInfo.classTest.endTime))
          const differenceInSecondsEndTime = getDifferenceOfTwoDatesInSeconds(endTime, new Date())
          if(remainingSeconds > differenceInSecondsEndTime){
            remainingSeconds = differenceInSecondsEndTime
          }
        }

        console.log({differenceInSeconds, remainingSeconds, duration})
        if(remainingSeconds <= 0){
          endTest()
          setRemainingTime(duration)
        }else{
          await updatePartsStatus(exam)
          setRemainingTime(remainingSeconds)
          setExamStarted(true);
        }
      }
    }else{
      Logger.info("Exam has not started")
      setRemainingTime(duration)
    }
  }

  const updatePartsStatus = async (tempExam) => {
    setLoading(true)
    Logger.info("Updating exam parts status");
    let response = await new ExamAPI().getExamPartStatuses(user.student?.id, class_id, id);
    setLoading(false)
    console.log({tempExam})
    if (response.ok) {

      response.data?.testPartAnswers.forEach(async (part) => {
        if(part.isDone){
          Logger.info("Part is done");
          let questionPartDto = [...tempExam.questionPartDto];
          questionPartDto = questionPartDto.map((tempPart) => {
            if (tempPart.questionPart.id === part.testPart.id) {
              tempPart.isDone = true;
              tempPart.hidden = true
            }
            return tempPart;
          });
          let newExam = { ...exam };
          newExam.questionPartDto = questionPartDto;
          setExam(newExam);
          console.log({ newExam });
        }else{
          Logger.info("Part is ongoing");
        }
      })
      Logger.info("Exam parts status updated");
    }else{
      alert("Something went wrong while updating exam parts status")
    }
  }

  const onAnswer = (partId, questionId, answer) => {
    let questionPartDto = [...exam.questionPartDto];
    questionPartDto = questionPartDto.map((part) => {
      if (part.questionPart.id === partId) {
        part.questionDtos = part.questionDtos.map((question) => {
          console.log({ question });
          if (question.question.id === questionId) {
            question.studentAnswer = answer;
          }
          return question;
        });
      }
      return part;
    });
    let newExam = { ...exam };
    newExam.questionPartDto = questionPartDto;
    setExam(newExam);
    console.log({ newExam });
  };

  const completePart = (partParams) => {
    let questionPartDto = [...exam.questionPartDto];
    questionPartDto = questionPartDto.map((part) => {
      if (part.questionPart.id === partParams.questionPart.id) {
        part.isDone = true;
      }
      return part;
    });

    let newExam = { ...exam };
    newExam.questionPartDto = questionPartDto;
    setExam(newExam);
  };

  const submitPartsAnswer = async (part) => {
    console.log("SUBMIT PART", { part });
    let payload = [];
    let unique = true;
    let empty = false;
    if (part.questionPart.questionTypeId == 5) {
      payload = part.questionDtos.map((question) => {
        let studentAnswers =
        question.studentAnswer ||
        question.choices.map(() => ({ answer: "" }));
        
        studentAnswers.forEach((choice) => {
          if (
            studentAnswers.filter((c) => c.answer.toLowerCase().trim() == choice.answer.toLowerCase().trim()).length > 1
          ) {
            unique = false;
          }
          if (choice.answer == "") {
            empty = true;
          }
        });

        return {
          answer: "",
          questionType: 5,
          questionId: question.question.id,
          enumeration: studentAnswers,
          webEnumerationAnswers: studentAnswers.map((item) => item.answer),
        };
      });
    } else {
      payload = part.questionDtos.map((question) => {
        return {
          questionId: question.question.id,
          answer: question.studentAnswer || "",
        };
      });
    }

    if (empty) {
      toast.error("Please answer all questions");
      return;
    }

    if (!unique) {
      toast.error("Please add unique answers");
      return;
    }

    console.log({ payload });
    setLoading(true);
    let response = await new ExamAPI().submitTestPerPart(
      user?.student?.id,
      class_id,
      part.questionPart.testId,
      part.questionPart.id,
      payload
    );
    setLoading(false);
    if (response.ok) {
      completePart(part);
    } else {
      alert("Something went wrong in submitting answer");
    }
  };

  const endTest = async (e) => {
    setLoading(true);
    let response = await new ExamAPI().endTest(user.student?.id, class_id, id);
    setLoading(false);
    if (!response.ok) {
      // alert("Something went wrong in ending test");
    }
    endExam();
    window.location.reload();
  };

  const startExam = async () => {
    setLoading(true);
    let response = await new ExamAPI().startTest(
      user.student?.id,
      class_id,
      id
    );
    setLoading(false);

    if (response.ok) {
      takeExam(window.location.pathname)
      setExamStarted(true);
      let remainingSeconds = (additionalExamInfo.classTest?.timeLimit || 0) * 60
      if(additionalExamInfo.classTest?.endTime && additionalExamInfo.classTest?.endDate){
        const endTime = new Date(additionalExamInfo.classTest.endDate.replace("00:00", additionalExamInfo.classTest.endTime))
        const differenceInSecondsEndTime = getDifferenceOfTwoDatesInSeconds(endTime, new Date())
        if(remainingSeconds > differenceInSecondsEndTime){
          remainingSeconds = differenceInSecondsEndTime
        }
      }
      setRemainingTime(remainingSeconds);
      
    } else {
      if (response.statusMessage === "Bad Request") {
        alert("This test has already been ended");
        getExamInformation();
      } else {
        alert("Something went wrong in starting test");
      }
    }
  };

  useEffect(() => {
    if (user.isTeacher) return (window.location.href = "/404");
    getExamInformation();
    
  }, []);

  useEffect(() => {
    if (remainingTime > 0) {
      setTimeout(() => {
        if (!examStarted) return;
        setRemainingTime((value) => value - 1);
        if (remainingTime == 600) {
          toast.success("You only have 10 minutes left to finish the exam");
        }
        if (remainingTime == 300) {
          toast.success("You only have 5 minutes left to finish the exam");
        }
        if (remainingTime == 60) {
          toast.success("You only have 1 minute left to finish the exam");
        }
        if (remainingTime == 10) {
          toast.success("You only have 10 seconds left to finish the exam");
        }
      }, 1000);
    } else {
      if (!examStarted) return;
      Logger.info("Exam is done");
      console.log({examStarted, remainingTime})
      endTest();
      setExamStarted(false);
    }
  }, [remainingTime, examStarted]);

  return (
    <MainContainer title='Exam Information' loading={loading}>
      <div className='page-container exam-information-container'>
        <div className='containerpages'>
          <ExamDetails
            exam={exam}
            loading={loading}
            startExam={startExam}
            remainingTime={remainingTime}
            examStarted={examStarted}
            additionalExamInfo={additionalExamInfo}
            isDoneTest={additionalExamInfo.isLoggedUserDone}
            
          />
          <ExamForm
            exam={exam}
            loading={loading}
            examStarted={examStarted}
            onAnswer={onAnswer}
            submitPartsAnswer={submitPartsAnswer}
            onSubmit={endTest}
          />
        </div>
      </div>
      <ToastContainer />
    </MainContainer>
  );
}

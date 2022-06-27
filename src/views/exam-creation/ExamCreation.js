import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ClassesAPI from "../../api/ClassesAPI";
import ExamAPI from "../../api/ExamAPI";
import MainContainer from "../../components/layouts/MainContainer";
import { UserContext } from "../../context/UserContext";
import AddPartModal from "./components/AddPartModal";
import ExamCreationDetails from "./components/ExamCreationDetails";
import { Container } from "react-bootstrap";
import CoursesAPI from "../../api/CoursesAPI";

export default function ExamCreation() {
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [showModal, setShowModal] = useState(false)
  const [instructions, setInstructions] = useState("")
  const [typeId, setTypeId] = useState(1)
  const [filesToUpload, setFilesToUpload] = useState({});
  const userContext = useContext(UserContext);
  const { user } = userContext.data;
  const { id, examid } = useParams();
  const [noAssigned, setNoAssigned] = useState(false)
  const [selectedPart, setSelectedPart] = useState(null);
  const [editable, setEditable] = useState(true)
  const [courseInfos, setCourseInfos] = useState([])
  const courseid = sessionStorage.getItem('courseid')
  
  const getCourseInformation = async () =>{
    let response = await new CoursesAPI().getCourseInformation(courseid)
    if(response.ok){
      setCourseInfos(response.data.isTechfactors)
    }
  }

  useEffect(() => {
    getCourseInformation();
  }, [])

  

  const getExamInformation = async () => {
    setLoading(true);
    let response = await new ExamAPI().getExamInformation(examid);
    if (response.ok) {
      let tempExam = response.data
      response = await new ExamAPI().getParts(examid)
      console.log({response, tempExam})
      response.data.forEach(item => {
        if(!tempExam.questionPartDto.map(temp_part => temp_part.questionPart.id).includes(item.id)){
          tempExam.questionPartDto.push({questionPart: item, questionDtos: []})
        }
      })
      tempExam = await getClassTest(tempExam)
      setExam(tempExam);
    } else {
      alert("Something went wrong while fetching exam information");
    }
    setLoading(false);
  };

  const getClassTest = async (tempExam) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const classId = tempExam.test.classId || params.class_id
    const not_editable = params.not_editable
    if(classId){
      let response = await new ExamAPI().getExams(classId);
      if (response.ok) {
        console.log({response})
        let foundExam = response.data.find(item => item.test.id === tempExam.test.id)
        if(foundExam){
          tempExam.classTest = foundExam.classTest
        }else{
          alert("Class test not found")
        }
        console.log({tempExam})
        response = await new ClassesAPI().getClassInformation(classId)
        if(tempExam.classTest){
          setEditable(false)
        }
        if (response.ok) {
          tempExam.class = response.data
        }else{
          alert("Invalid Class")
        }
      }
    }else{
      setNoAssigned(true)
    }
    if(not_editable){
      setEditable(false)
    }
    return tempExam
  }
  
  const submitPartForm = async (e) => {
    if(selectedPart != null){
      updatePart(e)
    }else{
      if(filesToUpload.fileName){
        addPartWithExcel(e)
      }else{
        addPart(e)
      }
    }
  }

  const addPartWithExcel = async(e) => {
    setLoading(true)
    e.preventDefault()
    let data = {
      questionPart: {
        instructions,
        questionTypeId: typeId,
        testId: examid
      },
      excelFile: filesToUpload
    }
    let response = await new ExamAPI().uploadTestPart(examid, typeId, data)
    console.log(response, '----------');
    if(response.ok){
      setTypeId('1');
      setInstructions('');
      setFilesToUpload({});
      setLoading(false)
      setShowModal(false)
      toast.success("Test part was successfully uploaded.")
      getExamInformation()
      setSelectedPart(null)
    }else{
      setLoading(false)
      toast.error(response.data?.errorMessage ? response.data?.errorMessage : "Something went wrong while uploading exam part")
    }
  }

  const updatePart = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      instructions
    }
    let response = await new ExamAPI().editPart(selectedPart.questionPart.id, data)
    if(response.ok){
      toast.success("Successfully Updated Part")
      setShowModal(false)
      getExamInformation()
      setTypeId('1')
      setSelectedPart(null);
    }else{
      toast.error(response.data?.errorMessage || "Something went wrong while creating the part")
      setLoading(false)
    }
  }

  const addPart = async(e) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      instructions
    }
    let response = await new ExamAPI().addPart(examid, typeId, data)
    if(response.ok){
      toast.success("Successfully Added Part")
      setShowModal(false);
      getExamInformation();
      setInstructions('')
      setTypeId('1')
      setSelectedPart(null)
    }else{
      toast.error(response.data?.errorMessage || "Something went wrong while creating the part")
      setLoading(false)
    }
  }

  const deletePart = async(e, part) => {
    setLoading(true)
    let response = await new ExamAPI().deletePart(part.questionPart.id)
    if(response.ok){
      toast.success("Part deleted")
      getExamInformation()
    }
    else{
      toast.error(response.data?.errorMessage || "Something went wrong while deleting the part")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user.isStudent) return (window.location.href = "/404");
    getExamInformation();
  }, []);

  useEffect(() => {
    if(selectedPart != null){
      setTypeId(selectedPart.questionPart.questionTypeId)
      setInstructions(selectedPart.questionPart.instructions)
    }else{
      setTypeId(1)
      setInstructions("")
    }
  
  }, [selectedPart]);

  useEffect(() => {
    if (user.isSchoolAdmin){
      setEditable(false)
    }
  }, []);

  // useEffect(() =>{
  //   if(courseInfos === true){
  //     setEditable(false)
  //   }
  // }, [courseInfos])

  

  return (
    <Container title='Exam Information' loading={loading} fluid className='x-0'>
      <div className='page-container exam-information-container'>
        <div className='containerpages'>
          <ExamCreationDetails
            getExamInformation={getExamInformation}
            setLoading={setLoading}
            exam={exam}
            loading={loading}
            setShowModal={setShowModal}
            deletePart={deletePart}
            selectedPart={selectedPart}
            setSelectedPart={setSelectedPart}
            noAssigned={noAssigned}
            editable={editable}
          />
        </div>
      </div>
      <AddPartModal 
        setShowModal={setShowModal}
        showModal={showModal}
        setTypeId={setTypeId}
        setFilesToUpload={setFilesToUpload}
        typeId={typeId}
        setInstructions={setInstructions}
        instructions={instructions}
        selectedPart={selectedPart}
        addPart={submitPartForm}/>
    </Container>
  );
}

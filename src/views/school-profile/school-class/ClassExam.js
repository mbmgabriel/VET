import React, { useState, useEffect, useContext } from 'react'
import MainContainer from '../../../components/layouts/MainContainer'
import ClassAdminSideNavigation from './components/ClassAdminSideNavigation'
import {Row, Col, Accordion} from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import ExamAPI from '../../../api/ExamAPI'
import { useParams } from 'react-router';
import { UserContext } from '../../../context/UserContext';
import { toast } from 'react-toastify';
import ActivityIndicator from "../../../components/loaders/ActivityIndicator";
import ClassExamHeader from "../../classes/components/Exam/ClassExamHeader";
import ExamItem from "./components/ExamItem";

function ClassAdminExam() {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const {id} = useParams();
  const [filter, setFilter] = useState("");
  const [modules, setModules] = useState([]);
  const { data } = useContext(UserContext);
  const [showExam, setShowExam] = useState(false)
  const [examName, setExamName] = useState('');
  const { user } = data;

  const fetchExams = async () => {
    setLoading(true);
    let response = await new ExamAPI().getExams(id);
    setLoading(false);
    if (response.ok) {
      const filteredExams = response.data.filter(
        (item) => user.isTeacher || item.classTest != null
      );
      const filteredModules = filteredExams.map((item) => item.module);
      const uniqueModules = [];
      filteredModules.forEach((item, index) => {
        if (!uniqueModules.map((item) => item.id).includes(item.id)) {
          uniqueModules.push(item);
        }
      });
      // fetch modules by class id

      setExams(filteredExams);
      
    } else {
      alert("Something went wrong while fetching exams");
    }
  };

 const getModuleClass = async () => {
    setLoading(true);
    let response = await new ClassesAPI().getModuleClass(id);
    setLoading(false);
    if(response.ok){
      setModules(response.data)
    }else{
      alert("Something went wrong while fetching Modules");
    }
  }

  useEffect(() => {
    getModuleClass()
  }, [])


  const deleteExam = async(id) => {
    setLoading(true)
    let response = await new ExamAPI().deleteExam(id)
    if(response.ok){
      await fetchExams()
      toast.success("Exam was successfully deleted")
    }else{
      toast.error(response?.data?.errorMessage || "Something went wrong while deleting the exam")
    }
    setLoading(false)

  }

  const onSearch = (text) => {
    setFilter(text);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <MainContainer title="School" activeHeader={"classes"} style='not-scrollable'>
      <Row className="mt-4">
        <Col sm={3}>
          <ClassAdminSideNavigation active="exam"/>
        </Col>
        <Col sm={9} className='scrollable vh-85'>
        <div className="class-container position-relative">
        {loading && <ActivityIndicator />}
        <ClassExamHeader onSearch={onSearch} modules={modules} fetchExams={fetchExams} />
        <Accordion defaultActiveKey="0">
          {modules.map((module, index) => {
            if (
              exams
                .filter((item) => module.id === item.module.id)
                .filter((item) =>
                  item.test.testName.toLowerCase().includes(filter.toLowerCase())
                ).length == 0
            ) {
              return <div />;
            }
            return (
              <Accordion.Item key={index} eventKey={index}>
                <Accordion.Header>{module.moduleName}</Accordion.Header>
                <Accordion.Body>
                  {exams
                    .filter((item) => module.id === item.module.id)
                    .filter((item) =>
                      item.test.testName
                        .toLowerCase()
                        .includes(filter.toLowerCase())
                    )
                    .map((exam, index) => (
                      <ExamItem key={index} exam={exam} deleteExam={deleteExam} setLoading={setLoading} fetchExams={fetchExams}/>
                    ))}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
        {exams.filter((item) =>
          item.test.testName.toLowerCase().includes(filter.toLowerCase())
        ).length === 0 &&
          !loading && <div className="no-exams">No exams found...</div>}
      </div>
        </Col>
      </Row>
    </MainContainer>
  )
}
export default ClassAdminExam

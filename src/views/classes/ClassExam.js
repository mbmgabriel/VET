import React, { useState, useContext } from "react";
import ClassExamHeader from "./components/Exam/ClassExamHeader";
import { Accordion } from "react-bootstrap";
import { useEffect } from "react";
import { useParams } from 'react-router';
import ExamItem from "./components/Exam/ExamItem";
import ExamAPI from "../../api/ExamAPI";
import ActivityIndicator from "../../components/loaders/ActivityIndicator";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import ClassesAPI from "../../api/ClassesAPI";
import ClassSideNavigation from "./components/ClassSideNavigation";
import ClassBreadcrumbs from "./components/ClassBreedCrumbs";
import FullScreenLoader from "../../components/loaders/FullScreenLoader";

export const ClassExam = () => {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const {id} = useParams();
  const [filter, setFilter] = useState("");
  const [modules, setModules] = useState([]);
  const { data } = useContext(UserContext);
  const [showExam, setShowExam] = useState(false)
  const [examName, setExamName] = useState('');
  const { user } = data;
  const subsType = user.subsType;

  const fetchExams = async () => {
    setLoading(true);
    let response = await new ExamAPI().getExams(id);
    if (response.ok) {
      setLoading(false)
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
      toast.error('Something went wrong while fetching exams')
    }
  };

 const getModuleClass = async () => {
    setLoading(true);
    let response = await new ClassesAPI().getModuleClass(id);
    setLoading(false);
    if(response.ok){
      setModules(response.data)
    }else{
      toast.error('Something went wrong while fetching modules')
    }
  }
  useEffect(() => {
    getModuleClass()
    // if(subsType != 'LMS'){
    //   window.location.href = "/classes"
    // }
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
    <ClassSideNavigation>
      {loading && <FullScreenLoader />}
      <ClassBreadcrumbs title={''} clicked={() => console.log('')}/>
      <div className="class-container position-relative">
        <ClassExamHeader onSearch={onSearch} modules={modules} fetchExams={fetchExams} onRefresh={() => fetchExams()}/>
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
    </ClassSideNavigation>
  );
};
export default ClassExam;

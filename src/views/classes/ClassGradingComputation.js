import { GradingTemplate } from './GradingTemplate';
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { UserContext } from "../../context/UserContext";
import MainContainer from "../../components/layouts/MainContainer";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import GradingTemplateAPI from "../../api/GradingTemplateAPI";
import GradingField from "./components/GradingField";
import FullScreenLoader from "../../components/loaders/FullScreenLoader";
import ClassTermAPI from "../../api/ClassTermAPI";
import { Link, useHistory, useParams } from "react-router-dom";
import GradingActivityForm from "./components/grading/GradingActivityForm";
import GradingActivityComputation from "./components/grading/GradingActivityComputation";
import ClassSideNavigation from './components/ClassSideNavigation';
import ClassBreadcrumbs from './components/ClassBreedCrumbs';

const getPercentageByDescription = (description, template) => {
  return template.templateTypes.reduce((total, item) => {
    console.log({ item });
    if (item.description === description) {
      return total + item.percentage;
    } else {
      return total + 0;
    }
  }, 0);
};

export default function ClassGradingComputation() {
  const userContext = useContext(UserContext);
  const { id, term_id } = useParams();
  const history = useHistory();
  const [exam, setExam] = useState();
  const [assignment, setAssignment] = useState();
  const [tasks, setTasks] = useState();

  const [customFields, setCustomFields] = useState([]);
  const { user } = userContext.data;
  const [loading, setLoading] = useState(true);
  const [gradingTemplate, setGradingTemplate] = useState(null);
  const [student, setStudent] = useState([]);
  const subsType = localStorage.getItem('subsType');
  
  const total =
    parseFloat(exam || "0") +
    parseFloat(assignment || "0") +
    parseFloat(tasks || "0") +
    parseFloat(
      customFields.reduce(
        (acc, cur) => acc + parseFloat(cur.value || "0"),
        0
      ) || "0"
    );

  const getStudent = async () => {
    setLoading(true);

    let response = await new ClassTermAPI().getStudents(id);
    console.log({ getTemplateResponse: response });
    if (response.ok) {
      console.log({ student: response.data });
      setStudent(response.data.students);
    } else {
    }
    setLoading(false);
  };

  const getGradingTemplate = async () => {
    setLoading(true);

    let response = await new ClassTermAPI().getTemplate(id, term_id);
    console.log({ getTemplateResponse: response });
    if (response.ok) {
      if (response.data.length === 0)
        return history.push(`/classes/${id}/class_grading/${term_id}/new`);
      setGradingTemplate(response.data[0]);
    } else {
      toast.error("Error getting grading template");
    }
    setLoading(false);
  };

  console.log({ gradingTemplate });
  useEffect(() => {
    getGradingTemplate();
    getStudent();
    if(subsType != 'LMS'){
      window.location.href = "/classes"
    }
  }, []);

  if (user.isTeacher) {
    return (
      <ClassSideNavigation>
        <ClassBreadcrumbs title='Grading Component' secondItem='Computation' clickedSecond={()=> history.push(`/classes/${id}/class_grading/${term_id}`)} clicked={() => history.push(`/classes/${id}/class_grading`)} />
        <div className='rounded-white-container container-fluid mt-4'>
          <h2 className='primary-color '>Grading Component --</h2>
          <table className='grading-table'>
            <thead>
              <tr>
                <th>Students</th>
                {gradingTemplate &&
                  gradingTemplate.classGradeTypes.map((item, index) => {
                    return (
                      <th className='' scope='col' key={index}>
                        <p className=''>{item.description}</p>
                        <p className=''>{item.percentage || 0}%</p>
                      </th>
                    );
                  })}
                {/* <th>Total</th> */}
              </tr>
            </thead>
            <tbody>
              {student.map((student, index) => {

                return (
                  <tr>
                    <td className="option-selection-computation student">{`${student.fname} ${student.lname}`}</td>
                    {gradingTemplate &&
                      gradingTemplate.classGradeTypes.map((item, index) => (
                        <GradingActivityComputation
                          index={index}
                          key={index}
                          item={item}
                          student={student}
                          setGradingTemplate={setGradingTemplate}
                        />
                      ))}
                    {/* <td className="option-selection-computation">100%</td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ClassSideNavigation>
    );
  }

  return <Redirect to='/404' />;
}

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

export default function ClassGradingInformation() {
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
  if(subsType != 'LMS'){
    window.location.href = "/classes"
  }
  }, []);

  if (user.isTeacher) {
    return (
      <MainContainer title='Grading System' fluid activeHeader={"grading"}>
        {loading && <FullScreenLoader />}
        <div className='rounded-white-container container-fluid mt-4'>
          <h2 className='primary-color '>Grading Component</h2>

          <table className='grading-table'>
            <thead>
              <tr>
                {gradingTemplate &&
                  gradingTemplate.classGradeTypes.map((item, index) => {
                    return (
                      <th scope='col' key={index}>
                        <p className=''>{item.description}</p>
                        <p className=''>{item.percentage || 0}%</p>
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody>
              <tr>
                {gradingTemplate &&
                  gradingTemplate.classGradeTypes.map((item, index) => (
                    <GradingActivityForm
                      index={index}
                      key={index}
                      item={item}
                      setGradingTemplate={setGradingTemplate}
                    />
                  ))}
              </tr>
            </tbody>
          </table>
          <Link to={`/classes/${id}/class_grading/${term_id}/computation`} className='btn btn-primary rounded-pill'>COMPUTE</Link>
        </div>
      </MainContainer>
    );
  }

  return <Redirect to='/404' />;
}

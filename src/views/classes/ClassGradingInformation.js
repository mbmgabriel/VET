import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { UserContext } from "../../context/UserContext";
import MainContainer from "../../components/layouts/MainContainer";
import { Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import GradingTemplateAPI from "../../api/GradingTemplateAPI";
import GradingField from "./components/GradingField";
import FullScreenLoader from "../../components/loaders/FullScreenLoader";
import ClassTermAPI from "../../api/ClassTermAPI";
import { Link, useHistory, useParams } from "react-router-dom";
import GradingActivityForm from "./components/grading/GradingActivityForm";
import ClassSideNavigation from "./components/ClassSideNavigation";
import ClassBreadcrumbs from "./components/ClassBreedCrumbs";
import SweetAlert from "react-bootstrap-sweetalert";

const getPercentageByDescription = (description, template) => {
  return template.templateTypes.reduce((total, item) => {
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
  const subsType = user.subsType;

  const [showWarning, setShowWarning] = useState(false);
  
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
    if (response.ok) {
      if (response.data.length === 0)
        return history.push(`/classes/${id}/class_grading/${term_id}/new`);
      setGradingTemplate(response.data[0]);
    } else {
      toast.error("Error getting grading template");
    }
    setLoading(false);
  };

  useEffect(() => {
    getGradingTemplate();
  // if(subsType != 'LMS'){
  //   window.location.href = "/classes"
  // }
  }, []);

  const deleteTemplate = async () => {
    let response = await new ClassTermAPI().deleteClassTerm(id, term_id);
    if (response.ok) {
      toast.success('Grading term deleted successfully');
      history.push(`/classes/${id}/class_grading`);
    } else {
      toast.error("Error deleting grading term template");
    }
    // setLoading(false);
  }

  if (user.isTeacher) {
    return (
      <ClassSideNavigation title='Grading System' fluid activeHeader={"classes"}>
        <ClassBreadcrumbs title='Grading Component' clicked={() => history.push(`/classes/${id}/class_grading`)} />
        <div className='rounded-white-container container-fluid mt-4'>
          <Row span className='font-size-22 row'>
            <Col><h2 className='primary-color'>Grading Component</h2></Col>
            <Col className="justify-content-end align-items-center align-content-end float-right d-flex">
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 1, hide: 0 }}
              overlay={(props) => 
                <Tooltip id="button-tooltip" {...props}>
                  Edit
                </Tooltip>}
            >
              <i className="fa fa-edit p-2 primary-color" onClick={() => history.push(`/classes/${id}/class_grading/${term_id}/edit`)}/>
            </OverlayTrigger> | 
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 1, hide: 0 }}
              overlay={(props) => 
                <Tooltip id="button-tooltip" {...props}>
                  Delete
                </Tooltip>}
            >
              <i className="fa fa-trash p-2 text-danger" onClick={()=> setShowWarning(true)}/>
            </OverlayTrigger>
            </Col>
          </Row>
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
        <SweetAlert
        warning
        showCancel
        show={showWarning}
        confirmBtnText='Yes, delete it!'
        confirmBtnBsStyle='danger'
        title='Are you sure?'
        onConfirm={async (e) => {
          await deleteTemplate();
          setShowWarning(false);
        }}
        onCancel={() => setShowWarning(false)}
        focusCancelBtn
      >
        You will not be able to recover this template!
      </SweetAlert>
      </ClassSideNavigation>
    );
  }

  return <Redirect to='/404' />;
}

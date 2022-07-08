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
import { useHistory, useParams } from "react-router-dom";
import ClassSideNavigation from "./components/ClassSideNavigation";
import ClassBreadcrumbs from "./components/ClassBreedCrumbs";

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

export default function NewClassGrading() {
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

  const setCustomFieldLabel = (index, label) => {
    const newCustomFields = [...customFields];
    newCustomFields[index].label = label;
    setCustomFields(newCustomFields);
  };

  const setCustomFieldValue = (index, value) => {
    if (value.length < 3) {
      const newCustomFields = [...customFields];
      newCustomFields[index].value = value;
      setCustomFields(newCustomFields);
    }
  };

  const deleteItemByIndex = (index) => {
    const newCustomFields = [...customFields];
    newCustomFields.splice(index, 1);
    setCustomFields(newCustomFields);
  };

  const getGradingTemplate = async () => {
    setLoading(true);

    let response = await new ClassTermAPI().getTemplate(id, term_id);
    console.log({getTemplateResponse: response})
    if (response.ok) {
      if(response.data.length > 0) return history.push(`/classes/${id}/class_grading/${term_id}`)

      new GradingTemplateAPI().getTemplates().then((response) => {
        if (response.ok) {
          const template = response.data[response.data.length - 1];
          setGradingTemplate(template);
          setExam(getPercentageByDescription("Test", template));
          setAssignment(getPercentageByDescription("Assignment", template));
          setTasks(getPercentageByDescription("Task", template));
          setCustomFields(
            template.templateTypes
              .filter(
                (item) =>
                  item.description !== "Assignment" &&
                  item.description !== "Test" &&
                  item.description !== "Task"
              )
              .map((item) => ({
                label: item.description,
                value: item.percentage,
              }))
          );
        } else {
          toast.error("Something went wrong while fetching grading template");
        }
        setLoading(false);
      });
    } else {
    }
  };

  useEffect(() => {
    getGradingTemplate();
    if(subsType != 'LMS'){
      window.location.href = "/classes"
    }
  }, []);

  const handleSubmit = async () => {
    const data = {
      classGradeTypes: [
        {
          description: "Test",
          percentage: exam,
        },
        {
          description: "Assignment",
          percentage: assignment,
        },
        {
          description: "Task",
          percentage: tasks,
        },
        ...customFields.map((item) => ({
          description: item.label,
          percentage: item.value,
        })),
      ],
    };
    console.log({ data });
    let isValid = true;
    let errors = [];
    if (total !== 100) {
      errors.push("Total must be 100%");
      isValid = false;
    }
    data.classGradeTypes.forEach((item) => {
      if (!isValid) return;
      if (item.percentage === "") {
        errors.push("All percentage must be filled");
        isValid = false;
      }
      if (item.description === "") {
        errors.push("All description must be filled");
        isValid = false;
      }
    });

    if (!isValid) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setLoading(true);
    let response = await new ClassTermAPI().createTemplate(id, term_id, data);
    if (response.ok) {
      toast.success("Successfully created grading template");
      history.push(`/classes/${id}/class_grading/${term_id}`);
    } else {
      toast.error("Something went wrong while creating grading template");
    }
    setLoading(false);
  };

  if (user.isTeacher) {
    return (
      <ClassSideNavigation title='Grading System' activeHeader={"grading"}>
        <ClassBreadcrumbs title='New Class Grading' clicked={() => history.push(`/classes/${id}/class_grading`)} />
        {/* {loading && <FullScreenLoader />} */}
        <div className='rounded-white-container mt-4'>
          <h2 className='primary-color '>Create New Grading Component</h2>
          <Row className='mt-4'>
            <Col className='' sm={6} lg={6}>
              <div className='grading-field'>
                <div className='grading-field-label'>Exam</div>
                <div className='grading-field-value'>
                  <input
                    type='number'
                    placeholder='0%'
                    value={exam}
                    onChange={(e) =>
                      e.target.value.length < 3 && setExam(e.target.value)
                    }
                  />
                </div>
                <div className=''>
                  <button className='btn btn-danger ' disabled>
                    <i class='fas fa-trash'></i>
                  </button>
                </div>
              </div>
              <div className='grading-field'>
                <div className='grading-field-label'>Assignment</div>
                <div className='grading-field-value'>
                  <input
                    type='number'
                    placeholder='0%'
                    value={assignment}
                    onChange={(e) =>
                      e.target.value.length < 3 && setAssignment(e.target.value)
                    }
                  />
                </div>
                <div className=''>
                  <button className='btn btn-danger ' disabled>
                    <i class='fas fa-trash'></i>
                  </button>
                </div>
              </div>
              <div className='grading-field'>
                <div className='grading-field-label'>Tasks</div>
                <div className='grading-field-value '>
                  <input
                    type='number'
                    placeholder='0%'
                    value={tasks}
                    onChange={(e) =>
                      e.target.value.length < 3 && setTasks(e.target.value)
                    }
                  />
                </div>
                <div className=''>
                  <button className='btn btn-danger ' disabled>
                    <i class='fas fa-trash'></i>
                  </button>
                </div>
              </div>

              {customFields.map((field, index) => {
                return (
                  <GradingField
                    key={index}
                    index={index}
                    field={field}
                    setCustomFieldLabel={setCustomFieldLabel}
                    setCustomFieldValue={setCustomFieldValue}
                    deleteItemByIndex={deleteItemByIndex}
                  />
                );
              })}
              <div className='grading-field'>
                <div
                  className='grading-field-button'
                  onClick={() =>
                    setCustomFields((prev) => [
                      ...prev,
                      { label: "", value: "" },
                    ])
                  }
                >
                  + Add
                </div>
                <div
                  className='grading-field-value bg-white'
                  style={{ flex: 1 }}
                />
              </div>
            </Col>
            <Col className='' sm={6} lg={6}>
              <div className='grading-field'>
                <div className='grading-field-label'>Total</div>
                <div className='grading-field-value'>
                  <input type='text' value={`${total}%`} readOnly />
                </div>
              </div>
            </Col>
          </Row>
          <div style={{ textAlign: "right" }}>
            <button
              className='btn btn-primary btn-lg grading-next-btn'
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </ClassSideNavigation>
    );
  }

  return <Redirect to='/404' />;
}

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ClassesAPI from "../../../../api/ClassesAPI";
import ClassTermAPI from "../../../../api/ClassTermAPI";
import FullScreenLoader from "../../../../components/loaders/FullScreenLoader";

export default function GradingActivityForm({
  index,
  item,
  setGradingTemplate,
}) {
  const [activityType, setActivityType] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [optionList, setOptionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id, term_id } = useParams();
  const [assignedActivities, setAssignedActivities] = useState([])

  const getAssignedActivity = async() => {
    setLoading(true)
    const response = await new ClassTermAPI().getAssignedActivity(id, term_id, item.id);
    if (response.ok) {
      console.log({assignedActivities: response})
      setAssignedActivities(response.data)
    } else {
      toast.error("Something went wrong while fetching assigned activity");
    }
    setLoading(false)
  }

  useEffect(() => {
    getAssignedActivity()
  }, [])
  

  const fetchAssignment = async () => {
    let response = await new ClassTermAPI().getAssignment(id);
    if (response.ok) {
      console.log({ assignment: response.data });
      setOptionList(
        response.data
          .filter((item) => item.classAssignment != null)
          .map((item) => ({
            id: item.classAssignment.id,
            name: item.assignment.assignmentName,
          }))
      );
    } else {
      toast.error("Error getting assignment");
    }
    setLoading(false);
  };

  const fetchTasks = async () => {
    let response = await new ClassTermAPI().getTasks(id);
    if (response.ok) {
      console.log({ tasks: response.data });
      setOptionList(
        response.data
          .filter((item) => item.taskAssignment != null)
          .map((item) => ({
            id: item.taskAssignment.id,
            name: item.task.taskName,
          }))
      );
    } else {
      toast.error("Error getting tasks");
    }
    setLoading(false);
  };

  const fetchTest = async () => {
    let response = await new ClassTermAPI().getTest(id);
    if (response.ok) {
      console.log({ test: response.data });
      setOptionList(
        response.data
          .filter((item) => item.classTest != null)
          .map((item) => ({ id: item.classTest.id, name: item.test.testName }))
      );
    } else {
      toast.error("Error getting test");
    }
    setLoading(false);
  };

  const fetchInteractive = async () => {
    let response = await new ClassTermAPI().getInteractive(id);
    if (response.ok) {
      console.log({ interactive: response.data });
      setOptionList(
        response.data
          .filter((item) => item.classInteractiveAssignment != null)
          .map((item) => ({
            id: item.classInteractiveAssignment.id,
            name: item.interactive.interactiveName,
          }))
      );
    } else {
      toast.error("Error getting interactive");
    }
    setLoading(false);
  };

  const onChangeActivityType = (e) => {
    setLoading(true);
    const value = e.target.value;
    setActivityType(value);
    setReferenceId("");
    setOptionList([]);
    console.log({ value });
    switch (value) {
      case "2":
        fetchAssignment();
        break;
      case "3":
        fetchTasks();
        break;
      case "4":
        fetchTest();
        break;
      case "5":
        fetchInteractive();
        break;
      default:
        setLoading(false);
        break;
    }
  };

  const addActivity = async () => {
    setLoading(true);
    const data = [
      {
        activityType,
        referenceId,
      },
    ];
    let response = await new ClassTermAPI().assignActivity(
      id,
      term_id,
      item.id,
      data
    );
    if (response.ok) {
      toast.success("Activity added");
      getAssignedActivity()
    } else {
      toast.error("Activity have already been added");
    }
    setLoading(false);
  };

  return (
    <td key={index} className='option-selection'>
      <div className='position-relative option-selection-form-container'>
        {loading && <FullScreenLoader />}
        <select onChange={onChangeActivityType}>
          <option value=''>- Select type of activity here -</option>
          <option value='2'> Assignment</option>
          <option value='3'> Task</option>
          <option value='4'> Test</option>
          <option value='5'> Interactive</option>
        </select>

        {activityType !== "" && (
          <select
            className='d-block mx-auto'
            onChange={(e) => setReferenceId(e.target.value)}
          >
            <option value=''>- Select activity here -</option>
            {optionList &&
              optionList.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
        )}
        {referenceId !== "" && (
          <button className='btn btn-primary btn-sm' onClick={addActivity}>
            Add activity
          </button>
        )}
      </div>

      <div>
        {assignedActivities && assignedActivities.map((item, index) => (
          <p>{`${item.activityName} - ${item.activityType}`}</p>
        ))}
        </div>
    </td>
  );
}

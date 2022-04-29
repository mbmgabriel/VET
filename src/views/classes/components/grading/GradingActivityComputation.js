import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ClassesAPI from "../../../../api/ClassesAPI";
import ClassTermAPI from "../../../../api/ClassTermAPI";
import ScoreComputationAPI from "../../../../api/ScoreComputationAPI";
import FullScreenLoader from "../../../../components/loaders/FullScreenLoader";
import AssignedActivityItem from "./AssignedActivityItem";

export default function GradingActivityComputation({
  index,
  item,
  student
}) {
  const [loading, setLoading] = useState(false);
  const { id, term_id } = useParams();
  const [assignedActivities, setAssignedActivities] = useState([]);

  const getAssignedActivity = async () => {
    setLoading(true);
    console.log("gradetypeid")
    console.log({item})
    let response = await new ClassTermAPI().getAssignedActivity(
      id,
      term_id,
      item.id
    );
    let tempAssignedActivity = response.data

    if (response.ok) {
      console.log({ assignedActivities: tempAssignedActivity });
      
      response = await new ScoreComputationAPI().computeActivity(
        student.id,
        id,
        term_id,
        item.id
      );

      console.log("Computing task score");
      if (response.ok) {
          console.log({ computed: response.data });
          
          tempAssignedActivity = tempAssignedActivity.map((item, index) => {
            const score = response.data.filter(answer => answer.activityId === item.classGradeGroup.referenceId).reduce((acc, curr) => acc + curr.scores, 0);
            item.score = score;
            return item
          })
          console.log({tempAssignedActivity})
      } else {
        alert("Something went wrong while computing the activity");
      }
      setAssignedActivities(tempAssignedActivity);


    } else {
      toast.error("Something went wrong while fetching assigned activity");
    }
    setLoading(false);
  };

  useEffect(() => {
    getAssignedActivity();
  }, []);

  return (
    <td
      key={index}
      style={{height: 1}}
      className='option-selection-computation position-relative'
    >
      {loading && <FullScreenLoader />}
      <AssignedActivityItem assignedActivities={assignedActivities} student={student} termId={term_id} gradeTypeId={item.id} />
    </td>
  );
}

  
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ScoreComputationAPI from "../../../../api/ScoreComputationAPI";

export default function AssignedActivityItem({
  assignedActivities,
  student,
  termId,
  gradeTypeId,
}) {
  const { id } = useParams();
  const [total, setTotal] = useState(0);
  const [answers, setAnswers] = useState([]);
  const computeTotal = async () => {
    console.log("Computing total", assignedActivities);
    let total = 0;
    assignedActivities.forEach(async (item, index) => {
      switch (item.activityType) {
        case "Test":
          total += 0;

          break;
        case "Assignment":
          total += 0;
          break;
        case "Task":
          total += 0;
          break;
        case "Interactive":
          total += 0;
          break;
        default:
          break;
      }
    });
    setTotal(total);
  };

  useEffect(() => {
    console.log({ student });
    computeTotal();
  }, [assignedActivities]);
  console.log({ assignedActivities });
  const totalScore = assignedActivities.reduce((acc, curr) => acc + curr.score, 0)
  const percentage = totalScore / assignedActivities.length / 100;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",
      }}
    >
      <div style={{ flex: 1 }}>
        {assignedActivities &&
          assignedActivities.map((item, index) => {
            console.log({ item, answers });
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    marginLeft: 12,
                    paddingLeft: 12,
                    borderLeft: "1px solid black",
                    width: 40,
                  }}
                >
                  {item.score}
                </div>
                <div>{`${item.activityName}  `}</div>
              </div>
            );
          })}
      </div>
      <div
        style={{
          fontWeight: "bold",
          borderTop: "1px solid #BCBCBC",
          marginTop: 20,
          paddingTop: 20,
        }}
      >
        TOTAL: {totalScore}
      </div>
    </div>
  );
}

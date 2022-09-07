import React from "react";

export default function ExamTimer({ remainingTime, examStarted }) {
  let minutes = Math.floor(remainingTime / 60);
  let seconds = remainingTime - minutes * 60;
  return (
    <div>
      <p className='secondary-title'>{examStarted ? "Remaining Time" : "Duration"}: {minutes > 0 && `${Math.trunc(minutes)} minute(s)`} {Math.trunc(seconds)} second(s)</p>
    </div>
  );
}

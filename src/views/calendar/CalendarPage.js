import moment from "moment";
import React, { useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import MainContainer from "../../components/layouts/MainContainer";
const localizer = momentLocalizer(moment); // or globalizeLocalizer
let allViews = Object.keys(Views).map((k) => Views[k]);

const EVENTS = [
  {
    start: moment().toDate(),
    end: moment().add(1, "days").toDate(),
    title: `Some title  ${moment().format('LT')}`,
  },
  {
    start: moment().subtract(1, "hours").toDate(),
    end: moment().toDate(),
    title: `Test ${moment().subtract(1, "hours").format('LT')}`,
  },
];

export default function CalendarPage() {
  const [loading, setLoading] = useState(false);

  return (
    <MainContainer activeHeader={"classes"} loading={loading}>
      <div className='page-container'>
        <div className='containerpages'>
          <div className='calendar-view'>
            <Calendar
              localizer={localizer}
              dayLayoutAlgorithm='no-overlap'
              events={EVENTS}
              startAccessor='start'
              endAccessor='end'
              defaultView='month'
              onSelectEvent={(data) => alert(`You click ${data.title}`)}

            />
          </div>
        </div>
      </div>
    </MainContainer>
  );
}

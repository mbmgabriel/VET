import moment from "moment";
import React, { useState, useEffect, useContext } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import { toast } from "react-toastify";
import FeedsAPI from "../../api/FeedsAPI";
import MainContainer from "../../components/layouts/MainContainer";
import { UserContext } from "../../context/UserContext";
const localizer = momentLocalizer(moment); // or globalizeLocalizer


export default function CalendarPage() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  
  const fetchEvents = async() => {
    setLoading(true);
    const response = await new FeedsAPI().fetchEvents(user?.userId);
    if(response.ok){
      let tempEvents = response.data.map(item => {
        let start = new Date(item.startDate)
        let end = new Date(item.endDate)

        return {
          start,
          end,
          title: item.title,
        };
      })
      console.log({tempEvents})
      setEvents(tempEvents);
    }else{
      toast.error("Something went wrong while fetching events")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <MainContainer activeHeader={"classes"} loading={loading}>
      <div className='page-container'>
        <div className='containerpages'>
          <div className='calendar-view'>
            <Calendar
              localizer={localizer}
              dayLayoutAlgorithm='no-overlap'
              events={events}
              startAccessor='start'
              endAccessor='end'
              defaultView='month'
              onSelectEvent={(data) => console.log(`You click ${data.title}`)}

            />
          </div>
        </div>
      </div>
    </MainContainer>
  );
}

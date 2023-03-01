import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) =>
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }))
    );
  }, []);

  /* 
 ---Original solution. Imperfect but kept for personal reference ---
    Had bug where spots would change when existing appointment was updated

  const updateSpots = (addOrSubtract) => {
    //finds the amount of spots remaining in the selected day by utilizing the getAppointments function
    let spotsRemaining =
      getAppointmentsForDay(state, state.day).filter((spot) => {
        return !spot.interview;
      }).length + addOrSubtract
    //creates a new days state with the amount of spots remaining to set on the page
    const newDays = state.days.map((day) => {
      if (day.name === state.day) {
        day.spots = spotsRemaining
      }
      return day;
    });
    return newDays;
  };

  */

  // updated solution taught in breakout //
  const updateSpots = (state, appointments) => {
    const dayObj = state.days.find((d) => d.name === state.day);

    let spots = 0;
    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        spots++;
      }
    }
    const day = { ...dayObj, spots };
    const days = state.days.map((d) => (d.name === state.day ? day : d));
    return days;
  };

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios.put(`/api/appointments/${id}`, { ...appointment }).then(() => {
      const days = updateSpots(state, appointments);
      setState({ ...state, appointments, days });
    });
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.delete(`/api/appointments/${id}`).then(() => {
      const days = updateSpots(state, appointments);
      setState({ ...state, appointments, days });
    });
  };

  return { state, setState, setDay, bookInterview, cancelInterview };
}

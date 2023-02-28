import { useState, useEffect } from "react";
import { getAppointmentsForDay } from "helpers/selectors";
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

  const updateSpots = (addOrSubtract) => {
    //finds the amount of spots remaining in the selected day by utilizing the getAppointments function
    const spotsRemaining =
      getAppointmentsForDay(state, state.day).filter((spot) => {
        return !spot.interview;
      }).length + addOrSubtract;
    //creates a new days state with the amount of spots remaining to set on the page
    const newDays = state.days.map((day) => {
      if (day.name === state.day) {
        day.spots = spotsRemaining;
      }
      return day;
    });
    return newDays;
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

    const newDays = updateSpots(-1);

    return axios
      .put(`/api/appointments/${id}`, { ...appointment })
      .then(() => setState({ ...state, appointments, days: newDays }));
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

    const newDays = updateSpots(1);

    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => setState({ ...state, appointments, days: newDays }));
  };

  return { state, setState, setDay, bookInterview, cancelInterview };
}

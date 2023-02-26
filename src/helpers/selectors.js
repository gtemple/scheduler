
export function getAppointmentsForDay(state, day) {
  const filteredAppointments = [];
  state.days.forEach(stateDay => {
    if (stateDay.name === day) {
      stateDay.appointments.forEach(appointmentId => {
        filteredAppointments.push(state.appointments[appointmentId]);
      });
    }
  });
  return filteredAppointments;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null
  }

  for (let interviewer in state.interviewers) {
    if (state.interviewers[interviewer].id === interview.interviewer) {
      return {
        'student': interview.student,
        'interviewer': state.interviewers[interviewer]
      }
    }
  }
}
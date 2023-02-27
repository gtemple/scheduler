
export function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  }
  let filteredAppointmentsID = state.days.filter(currentDay => {
    return currentDay.name === day
  });
  
  if (!filteredAppointmentsID[0]) {
    return [];
  }

  filteredAppointmentsID = filteredAppointmentsID[0].appointments
  
  const filteredAppointments = Object.values(state.appointments).filter(entry => {
    return filteredAppointmentsID.includes(entry.id)
  })

  return filteredAppointments;
}

export function getInterviewersForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  }
  let filteredInterviewersID = state.days.filter(currentDay => {
    return currentDay.name === day
  });
  
  if (!filteredInterviewersID[0]) {
    return [];
  }

  filteredInterviewersID = filteredInterviewersID[0].interviewers
  
  const filteredInterviewers = Object.values(state.interviewers).filter(entry => {
    return filteredInterviewersID.includes(entry.id)
  })

  return filteredInterviewers;
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
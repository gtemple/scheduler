import React, { Fragment } from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Form from "./Form";
import Empty from "./Empty";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const ERROR_SAVE = "ERROR SAVE"
  const ERROR_DELETE = "ERROR DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  };

  const deleteCheck = () => {
    transition(CONFIRM);
  };

  const destroy = (checkDelete) => {
    if (!checkDelete) {
      transition(SHOW);
      return;
    }
    if(checkDelete) {
      transition(DELETING, true)
      props.cancelInterview(props.id)
        .then(() => transition(EMPTY))
        .catch(error => transition(ERROR_DELETE, true));
    }
  };

  const edit = () => {
    transition(EDIT)
  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={edit}
          onDelete={deleteCheck}
        />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onDelete={destroy}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === DELETING && <Status message="Deleting"/>}
      {mode === SAVING && <Status message="Saving" />}
      {mode === ERROR_SAVE && 
        <Error 
          message="Could not save"
          onClose={() => back()}
          />}
      {mode === ERROR_DELETE && 
        <Error 
          message="Could not delete"
          onClose={() => back()}
          />}
    </article>
  );
}
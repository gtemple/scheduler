import React from "react";
import classNames from "classnames";

import "components/InterviewerListItem.scss"

export default function InterviewerListItem(props) {

  const interviewerClass = classNames({
    "interviewers__item--selected": props.selected,
    "interviewers__item": props.spots === 0
  });

  return (
    <li className={interviewerClass} onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}
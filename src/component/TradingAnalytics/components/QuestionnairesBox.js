import React from "react";
import QuestionnairesBoxContent from "./QuestionnairesBoxContent";

const QuestionnairesBox = ({ questionnaires, showForm }) => {
  return (
    <>
      <div className="mantra-box">
        {questionnaires?.length > 0 &&
          questionnaires?.map((el, i) => <QuestionnairesBoxContent questionnaire={el} key={i} />)}
      </div>
      <div
        className="add-btn"
        onClick={() => {
          showForm();
        }}
      >
        + Monthly Q&A
      </div>
    </>
  );
};

export default QuestionnairesBox;

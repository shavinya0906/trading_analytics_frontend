import React, { useEffect } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { monthlyQuestionnaireRemove } from "../../../store/slice/monthlySlice";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

const QuestionnairesBoxContent = ({ questionnaire }) => {
  const [showOptions, setShowOptions] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const reduxData = useSelector((state) => state.monthly?.updatedQuestionnaire);
  const removeHandler = () => {
    dispatch(
      monthlyQuestionnaireRemove({
        token: token,
        values: questionnaire,
      })
    );
  };

  useEffect(() => {}, [reduxData.id === questionnaire.id]);
  return (
    <div
      className="questionnaire-card more"
      onMouseLeave={() => setShowOptions(false)}
    >
      {showOptions ? (
        <span className="more-menu">
          <p onClick={removeHandler}>Delete</p>
        </span>
      ) : (
        <span className="more-vert" onClick={() => setShowOptions(true)}>
          <FontAwesomeIcon icon={faEllipsisVertical} color="black" />
        </span>
      )}
      <h4>{questionnaire?.month}</h4>
      <div className="questionnaire-details">
        <div className="questions">
          What was the total profit or loss for the month compared to previous
          months?
          <div className="answers">Ans. {questionnaire.totalProfitLoss}</div>
        </div>

        <div className="questions">
          What were the most profitable trades and what strategies were used?
          <div className="answers">
            Ans. {questionnaire.mostProfitableTrades}
          </div>
        </div>
        <div className="questions">
          Q. What were the least profitable trades and what went wrong?
          <div className="answers">
            Ans. {questionnaire.leastProfitableTrades}
          </div>
        </div>

        <div className="questions">
          What were the most common reasons for entering and exiting trades, and
          were they successful?
          <div className="answers">
            Ans. {questionnaire.commonReasonsForTrades}
          </div>
        </div>

        <div className="questions">
          How did market conditions and news events affect trading performance?
          <div className="answers">
            Ans. {questionnaire.marketConditionsImpact}
          </div>
        </div>

        <div className="questions">
          What changes were made to the trading plan or strategies, and how did
          they impact performance?
          <div className="answers">
            Ans. {questionnaire.changesToTradingPlan}
          </div>
        </div>

        <div className="questions">
          Were the risk management position sizing strategies followed
          consistently, and were they effective?
          <div className="answers">
            Ans. {questionnaire.riskManagementConsistency}
          </div>
        </div>

        <div className="questions">
          Were emotions and biases a factor in trading decisions, and if so, how
          can they be addressed?
          <div className="answers">Ans. {questionnaire.emotionsAndBiases}</div>
        </div>

        <div className="questions">
          What lessons were learned from the month’s trading, and how can they
          be applied in future trading?
          <div className="answers">Ans. {questionnaire.lessonsLearned}</div>
        </div>

        <div className="questions">
          What were the goals for the upcoming month, and what steps will be
          taken to achieve them?
          <div className="answers">
            Ans. {questionnaire.goalsForUpcomingMonth}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairesBoxContent;

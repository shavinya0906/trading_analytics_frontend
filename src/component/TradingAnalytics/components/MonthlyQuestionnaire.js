import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../../assets/images/closeIcon.svg";
import "./monthly.css"; // You may need to create a new CSS file for the monthly questionnaire styles
import { useDispatch, useSelector } from "react-redux";
import QuestionnairesBox from "./QuestionnairesBox";
import {
  monthlyQuestionnaireAdd,
  monthlyQuestionnaireEdit,
} from "../../../store/slice/monthlySlice";

const MonthlyQuestionnaire = ({ closePopUp,data }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const reduxData = useSelector((state) => state.monthly.data);
  const [answers, setAnswers] = useState(null);
  const answer1Ref = useRef(null);
  const answer2Ref = useRef(null);
  const answer3Ref = useRef(null);
  const answer4Ref = useRef(null);
  const answer5Ref = useRef(null);
  const answer6Ref = useRef(null);
  const answer7Ref = useRef(null);
  const answer8Ref = useRef(null);
  const answer9Ref = useRef(null);
  const answer10Ref = useRef(null);

  const handleSubmit = () => {
    const answer1 = answer1Ref.current.value;
    const answer2 = answer2Ref.current.value;
    const answer3 = answer3Ref.current.value;
    const answer4 = answer4Ref.current.value;
    const answer5 = answer5Ref.current.value;
    const answer6 = answer6Ref.current.value;
    const answer7 = answer7Ref.current.value;
    const answer8 = answer8Ref.current.value;
    const answer9 = answer9Ref.current.value;
    const answer10 = answer10Ref.current.value;

    const data = {
        totalProfitLoss: Number(answer1) || null,
      mostProfitableTrades: answer2 || null,
      leastProfitableTrades: answer3 || null,
      commonReasonsForTrades: answer4 || null,
      marketConditionsImpact: answer5 || null,
      changesToTradingPlan: answer6 || null,
      riskManagementConsistency: answer7 || null,
      emotionsAndBiases: answer8 || null,
      lessonsLearned: answer9 || null,
      goalsForUpcomingMonth: answer10 || null,
    };
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== null)
    );

    setAnswers(filteredData);
    
  };

    useEffect(() => {
      if (data) {
        const questionnaire =
          data;

        answer1Ref.current.value =
          questionnaire.totalProfitLoss != null
            ? questionnaire.totalProfitLoss
            : "";
        answer2Ref.current.value =
          questionnaire.mostProfitableTrades != null
            ? questionnaire.mostProfitableTrades
            : "";
        answer3Ref.current.value =
          questionnaire.leastProfitableTrades != null
            ? questionnaire.leastProfitableTrades
            : "";
        answer4Ref.current.value =
          questionnaire.commonReasonsForTrades != null
            ? questionnaire.commonReasonsForTrades
            : "";
        answer5Ref.current.value =
          questionnaire.marketConditionsImpact != null
            ? questionnaire.marketConditionsImpact
            : "";
        answer6Ref.current.value =
          questionnaire.changesToTradingPlan != null
            ? questionnaire.changesToTradingPlan
            : "";
        answer7Ref.current.value =
          questionnaire.riskManagementConsistency != null
            ? questionnaire.riskManagementConsistency
            : "";
        answer8Ref.current.value =
          questionnaire.emotionsAndBiases != null
            ? questionnaire.emotionsAndBiases
            : "";
        answer9Ref.current.value =
          questionnaire.lessonsLearned != null
            ? questionnaire.lessonsLearned
            : "";
        answer10Ref.current.value =
          questionnaire.goalsForUpcomingMonth != null
            ? questionnaire.goalsForUpcomingMonth
            : "";
      }
    }, [data]);

  useEffect(() => {
    const currentMonth =
      new Date().toLocaleString("default", { month: "long" }) +
      " " +
      new Date().getFullYear();

    if (answers) {
      const existingQuestionnaireForCurrentMonth = reduxData.find(
        (questionnaire) => questionnaire.month === currentMonth
      );

      if (existingQuestionnaireForCurrentMonth) {
        dispatch(
          monthlyQuestionnaireEdit({
            values: {
                ...answers,
                id: existingQuestionnaireForCurrentMonth.id,
              },
            token: token,
          })
        );
      } else {
        dispatch(
          monthlyQuestionnaireAdd({
            values: answers,
            token: token,
          })
        );
      }
      closePopUp();
    }
  }, [answers]);

  return (
    <div className="popUUpBg">
      <div className="filterPopUUp">
        <div className="filterPopUUpHeader">
          <p className="popUUpTitle">Monthly Questionnaire</p>
          <div className="closeFilter" onClick={closePopUp}>
            <img src={CloseIcon} alt="Close" className="closeIcon" />
          </div>
        </div>
        <div className="filterPopUUBody">
          <div className="questionContainer">
            <p className="question">
              What was the total profit or loss for the month compared to
              previous months?
            </p>
            <input type="number" ref={answer1Ref} className="inputField" />

            <p className="question">
              What were the most profitable trades and what strategies were
              used?
            </p>
            <input type="text" ref={answer2Ref} className="inputField" />

            <p className="question">
              What were the least profitable trades and what went wrong?
            </p>
            <input type="text" ref={answer3Ref} className="inputField" />

            <p className="question">
              What were the most common reasons for entering and exiting trades
              and were they successful?
            </p>
            <input type="text" ref={answer4Ref} className="inputField" />

            <p className="question">
              How did market conditions and news events affect trading
              performance?
            </p>
            <input type="text" ref={answer5Ref} className="inputField" />

            <p className="question">
              What changes were made to the trading plan or strategies and how
              did they impact performance?
            </p>
            <input type="text" ref={answer6Ref} className="inputField" />

            <p className="question">
              Were the risk management position sizing strategies followed
              consistently, and were they effective?
            </p>
            <input type="text" ref={answer7Ref} className="inputField" />

            <p className="question">
              Were emotions and biases a factor in trading decisions, and if so,
              how can they be addressed?
            </p>
            <input type="text" ref={answer8Ref} className="inputField" />

            <p className="question">
              What lessons were learned from the month’s trading, and how can
              they be applied in future trading?
            </p>
            <input type="text" ref={answer9Ref} className="inputField" />

            <p className="question">
              What were the goals for the upcoming month, and what steps will be
              taken to achieve them?
            </p>
            <input type="text" ref={answer10Ref} className="inputField" />
          </div>

          <button onClick={handleSubmit} className="submitButton">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyQuestionnaire;

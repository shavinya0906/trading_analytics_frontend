import React, { useEffect } from "react";
import MonthlyQuestionnaire from "./MonthlyQuestionnaire";
import { useSelector } from "react-redux/es/hooks/useSelector";
import QuestionnairesBox from "./QuestionnairesBox";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { monthlyQuestionnaireList } from "../../../store/slice/monthlySlice";
const MonthlyQA = () => {
  const reduxData = useSelector((state) => state.monthly?.data);
  const token = useSelector((state) => state.auth.token);
  const [qnas, setQnas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const [data,setData]=useState();
  const closeForm = () => {
    setShowForm(false);
  };
  const showFormHandler = () => {
    setShowForm(true);
  };

  useEffect(() => {
    setQnas(reduxData);
    const currentMonth =
      new Date().toLocaleString("default", { month: "long" }) +
      " " +
      new Date().getFullYear();
    const currentMonthData = reduxData.filter(
      (el) => el.month === currentMonth
    )[0];
    setData(currentMonthData);
  }, [reduxData]);
  useEffect(() => {
    dispatch(monthlyQuestionnaireList(token));
  }, []);
  return (
    <div>
      <div>
        <p className="heading-mantra">Monthly Questionnaire</p>
      </div>
      <div>{showForm && <MonthlyQuestionnaire closePopUp={closeForm} data={data}/>}</div>
      <div>
        <QuestionnairesBox questionnaires={qnas} showForm={showFormHandler} />
      </div>
    </div>
  );
};

export default MonthlyQA;

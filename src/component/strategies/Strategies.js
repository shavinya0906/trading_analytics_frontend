import React, { useEffect, useState } from "react";
import "./Strategies.scss";
import StrategiesBox from "./StrategyBox";
import StrategyForm from "./StrategyForm";
import { useStrategy } from "../../context/StrategyContext";
import { useDispatch, useSelector } from "react-redux";
import { strategyList } from "../../store/slice/strategySlice";

const Strategies = () => {
  const [strategies, setStrategies] = useState([
    // {
    //   title: "Strategy A",
    //   desc: "In a quaint little village nestled between rolling hills and lush forests, life moved at a serene pace. The townspeople, known for their warm hospitality, lived in charming cottages adorned with vibrant gardens. The village square bustled with activity as vendors peddled fresh produce and handmade crafts. Children played joyfully in the cobblestone streets, and the aroma of freshly baked bread wafted from the local bakery. At the heart of the community stood an ancient oak tree, its branches providing shade and solace to those seeking refuge from the sun's embrace. Time seemed to stand still in this idyllic haven, where the simple pleasures of life were treasured, and the bonds of friendship were woven tightly.",
    // },
    // {
    //   title: "Strategy B",
    //   desc: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. but also the leap into electronic typesetting...",
    // },
    // {
    //   title: "Strategy C",
    //   desc: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. but also the leap into electronic typesetting...",
    // },
    // {
    //   title: "Strategy D",
    //   desc: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. but also the leap into electronic typesetting...",
    // },
  ]);
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.auth?.token);
  const reduxData = useSelector((state) => state?.strategy?.data);
  const isAddedOrEdited = useSelector(
    (state) => state?.strategy?.isAddedOrEdited
  );

  useEffect(() => {
    dispatch(strategyList(token));
  }, [isAddedOrEdited === true]);
  useEffect(() => {
    if (reduxData?.length) {
      setStrategies((prev) => reduxData);
    }
  }, [reduxData]);
  const { formStatus } = useStrategy();
  return (
    <>
      <StrategiesBox strategies={strategies} />
      {formStatus === "add" || formStatus === "edit" ? <StrategyForm /> : null }
    </>
  );
};

export default Strategies;

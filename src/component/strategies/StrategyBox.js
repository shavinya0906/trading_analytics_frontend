import React from "react";
import "./Strategies.scss";
import { useState } from "react";
import StrategiesBoxContent from "./StrategyBoxContent";
import { useStrategy } from "../../context/StrategyContext";

const StrategiesBox = ({ strategies }) => {
  const { setFormStatus, formStatus } = useStrategy();
  return (
    <>
      <div className="strategy-box">
        {strategies?.map((el, i) => (
          <StrategiesBoxContent strategy={el} key={el.title} />
        ))}
      </div>
      {formStatus === "none" ? (
        <div className="add-btn" onClick={() => setFormStatus("add")}>
          + Add Strategy
        </div>
      ) : null}
    </>
  );
};

export default StrategiesBox;

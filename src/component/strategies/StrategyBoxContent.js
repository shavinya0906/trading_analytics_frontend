import React from "react";
import "./Strategies.scss";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { useStrategy } from "../../context/StrategyContext";
import { useDispatch } from "react-redux";
import { strategyRemove } from "../../store/slice/strategySlice";

const StrategiesBoxContent = ({ strategy }) => {
  const [showMore, setShowMore] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { setFormData, setFormToggle, setFormStatus } = useStrategy();
  const dispatch = useDispatch();
  const editHandler = () => {
    setFormData({
      strategies_name: strategy.strategies_name,
      strategies_desc: strategy.strategies_desc,
      strategies_Id: strategy.id,
    });
    setFormToggle((prev) => !prev);
    setFormStatus("edit");
  };
  const removeHandler = () => {
    dispatch(strategyRemove({ values: {strategies_Id: strategy.id}}))
  }
  return (
    <div
      className="strategy-card more"
      onMouseLeave={() => setShowOptions(false)}
    >
      {showOptions ? (
        <span className="more-menu">
          <p onClick={editHandler}>Edit</p>
          <p onClick={removeHandler}>Delete</p>
        </span>
      ) : (
        <span className="more-vert" onClick={() => setShowOptions(true)}>
          <FontAwesomeIcon icon={faEllipsisVertical} color="black" />
        </span>
      )}
      <h2>{strategy?.strategies_name}</h2>
      {!showMore ? (
        <>
          <h4>
            {strategy?.strategies_desc?.slice(0, 500)}{" "}
            {strategy?.strategies_desc?.length > 500 && "..."}
          </h4>
          {strategy?.strategies_desc?.length > 500 && (
            <p onClick={() => setShowMore(true)}>Read More</p>
          )}
        </>
      ) : (
        <>
          <h4>{strategy?.strategies_desc}</h4>
          <p onClick={() => setShowMore(false)}>Read Less</p>
        </>
      )}
    </div>
  );
};

export default StrategiesBoxContent;

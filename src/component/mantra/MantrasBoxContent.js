import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { mantraRemove } from "../../store/slice/mantraSlice";

const MantrasBoxContent = ({ mantra }) => {
  const token = useSelector((state) => state.auth.token);
  const [showMore, setShowMore] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const dispatch = useDispatch();
  const removeHandler = () => {
    dispatch(mantraRemove({ token: token, values: { mantras_Id: mantra.id } }));
  };
  return (
    <div
      className="mantra-card more"
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
      {!showMore ? (
        <>
          <h4>
            {mantra?.mantras_desc?.slice(0, 500)}{" "}
            {mantra?.mantras_desc?.length > 500 && "..."}
          </h4>
          {mantra?.mantras_desc?.length > 500 && (
            <p onClick={() => setShowMore(true)}>Read More</p>
          )}
        </>
      ) : (
        <>
          <h4>{mantra?.mantras_desc}</h4>
          <p onClick={() => setShowMore(false)}>Read Less</p>
        </>
      )}
    </div>
  );
};

export default MantrasBoxContent;

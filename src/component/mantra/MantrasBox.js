import React from "react";
import MantrasBoxContent from "./MantrasBoxContent";

const MantrasBox = ({ mantras, showForm }) => {
  return (
    <>
      <div className="mantra-box">
        {mantras.length > 0 &&
          mantras?.map((el, i) => <MantrasBoxContent mantra={el} key={i} />)}
      </div>
      <div
        className="add-btn"
        onClick={() => {
          showForm();
        }}
      >
        + Add Mantra
      </div>
    </>
  );
};

export default MantrasBox;

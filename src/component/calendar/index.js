import React from "react";
import "./calendar.css";
import Calendar from "react-calendar";
import { useState,useEffect } from "react";

const Calendarr = () => {
  const [dateData, setDateData] = useState({});

  const tileClassName = ({ date }) => {
    const currentDate = date.toISOString().split("T")[0];
    const content = dateData[currentDate];

    return content || "";
  };

  const organizeData = (data) => {
    const organized = {};
    data.forEach(entry => {
      organized[entry.date] = entry.profit ? 'profit' : (entry.loss ? 'loss' : 'nodata');
    });
    return organized;
  };


  useEffect(() => {
    // Hardcoded data for testing purposes
    const testData = [
      { date: "2023-12-01", profit: true, loss: false },
      { date: "2023-12-05", profit: false, loss: true },
    ];

    const organizedData = organizeData(testData);
    setDateData(organizedData);
  }, []); // Run only once on component mount

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
      <Calendar
        className="calendarr"
        tileClassName={tileClassName}
        // calendarType="ISO 8601"
      />
    </div>
  );
};

export default Calendarr;

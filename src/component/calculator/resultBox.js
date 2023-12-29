import React,{useState,useEffect} from "react";

const ResultBox = ({ result }) => {
  const [res,setRes]=useState(result);

  useEffect(()=>{
    setRes(result);
  }
  ,[result]);

  return (
    <div className="result-box">
      <div className="result-heading">
        <p>Result</p>
      </div>
      {Object.keys(res).map((key) => {
          return (
            <div className="main-result">
              <p>{key} : </p>
              <p>{res[key]}</p>
            </div>
          );
        })
      }
    </div>
  );
};

export default ResultBox;

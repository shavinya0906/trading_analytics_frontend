import React, { useState,useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ResultBox from "../resultBox";

const RiskReward = () => {
  const inputRef=useRef({
    entry:null,
    target:null,
    stopLoss:null,
  })
  const [result, setResult] = useState({
    "Risk : Reward": 0,
  });
  const onCalculate=()=>{
    const {entry,target,stopLoss}=inputRef.current;
    let riskReward=(target.value-entry.value)/(entry.value-stopLoss.value);
    riskReward=riskReward>0?riskReward:0;
    setResult({
      "Risk : Reward":riskReward.toFixed(2),
    });
  }
  const onResetFields=()=>{
    inputRef.current.entry.value=null;
    inputRef.current.target.value=null;
    inputRef.current.stopLoss.value=null;
    setResult({
      "Risk : Reward":0,
    });
  }
  return (
    <Container>
      <Row>
        <Col sm={8} xs={12} className="calculatorArea">
          <div className="calculatorHeading">
            <p>You can calculate your Risk : Reward</p>
          </div>
          <div className="inputFields">
            <div>
              <p className="fieldsLabel">Entry Price</p>
              <input
                type="text"
                className="customFieldInput"
                placeholder="Rs.0000"
                name="entry"
                ref={(ref) => inputRef.current.entry = ref}
                onChange={(e)=>{
                  inputRef.current.entry.value=e.target.value;
                }}
              />
            </div>
            <div>
              <p className="fieldsLabel">Target</p>
              <input
                type="text"
                className="customFieldInput"
                placeholder="Rs.0000"
                name="target"
                ref={(ref) => inputRef.current.target = ref}
                onChange={(e)=>{
                  inputRef.current.target.value=e.target.value;
                }}
              />
            </div>
            <div>
              <p className="fieldsLabel">Stop Loss</p>
              <input
                type="text"
                className="customFieldInput"
                placeholder="Rs.0000"
                name="stopLoss"
                ref={(ref) => inputRef.current.stopLoss = ref}
                onChange={(e)=>{
                  inputRef.current.stopLoss.value=e.target.value;
                }}
              />
            </div>
          </div>
          <div className="buttons-area">
            <Button variant="outline-primary" className="calculate-button" onClick={onResetFields}>
              Reset
            </Button>
            <Button variant="primary" className="calculate-button" onClick={onCalculate}>
              Calculate
            </Button>
          </div>
        </Col>
        <Col sm={4} xs={12}>
          <ResultBox result={result} />
        </Col>
      </Row>
    </Container>
  );
};

export default RiskReward;

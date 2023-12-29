import React, { useState,useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ResultBox from "../resultBox";

const ProfitAndLoss = () => {
  const inputRef=useRef({
    quantity:null,
    entry:null,
    exit:null,
  });
  const [result, setResult] = useState({
    "Total Profit": 0,
    "Total Loss": 0,
  });
  const onCalculate=()=>{
    const {quantity,entry,exit}=inputRef.current;
    let profit=quantity.value*(exit.value-entry.value);
    let loss=quantity.value*(entry.value-exit.value);
    profit=profit>0?profit:0;
    loss=loss>0?loss:0;
    setResult({
      "Total Profit":profit,
      "Total Loss":loss,
    });
  }

  const onResetFields=()=>{
    inputRef.current.quantity.value=null;
    inputRef.current.entry.value=null;
    inputRef.current.exit.value=null;
    setResult({
      "Total Profit":0,
      "Total Loss":0,
    });
  }
  return (
    <Container>
      <Row>
        <Col sm={8} xs={12} className="calculatorArea">
          <div className="calculatorHeading">
            <p>You can calculate your Profit & Loss</p>
          </div>
          <div className="inputFields">
            <div>
              <p className="fieldsLabel">Quantity</p>
              <input
                type="text"
                className="customFieldInput"
                placeholder="00"
                name="quantity"
                ref={(ref) => inputRef.current.quantity = ref}
                onChange={(e)=>{
                  inputRef.current.quantity.value=e.target.value;
                }}
              />
            </div>
            <div>
              <p className="fieldsLabel">Entry</p>
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
              <p className="fieldsLabel">Exit</p>
              <input
                type="text"
                className="customFieldInput"
                placeholder="Rs.0000"
                name="exit"
                ref={(ref) => inputRef.current.exit = ref}
                onChange={(e)=>{
                  inputRef.current.exit.value=e.target.value;
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

export default ProfitAndLoss;

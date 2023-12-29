import React, { useState,useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ResultBox from "../resultBox";

const PositionSize = () => {
  const inputRef = useRef({
    investment: null,
    risk: null,
    entry: null,
    stopLoss: null,
    target: null,
  });
  const [result, setResult] = useState({
    "Position Size": 0,
    Profit: 0,
    Loss: 0,
  });
  const onResetFields = () => {
    inputRef.current.investment.value = null;
    inputRef.current.risk.value = null;
    inputRef.current.entry.value = null;
    inputRef.current.stopLoss.value = null;
    inputRef.current.target.value = null;
    setResult({
      "Position Size": 0,
      Profit: 0,
      Loss: 0,
    });
  };
  const onCalculate = () => {
    const { investment, risk, entry, stopLoss, target } = inputRef.current;
    let positionSize =
      (investment.value * risk.value) / (entry.value - stopLoss.value);
    let profit = positionSize * (target.value - entry.value);
    let loss = positionSize * (entry.value - target.value);
    positionSize = positionSize > 0 ? positionSize : 0;
    profit = profit > 0 ? profit : 0;
    loss = loss > 0 ? loss : 0;
    setResult({
      "Position Size": positionSize.toFixed(2),
      Profit: profit.toFixed(2),
      Loss: loss.toFixed(2),
    });
  };
  return (
    <Container>
      <Row>
        <Col sm={8} xs={12} className="calculatorArea positionSize">
          <div className="calculatorHeading">
            <p>You can calculate your Position Size</p>
          </div>
          <div className="inputFields">
            <div>
              <p className="fieldsLabel">Investment Value</p>
              <input
                type="text"
                className="customFieldInput"
                placeholder="Rs.0000"
                name="investment"
                ref={(ref) => (inputRef.current.investment = ref)}
                onChange={(e) => {
                  inputRef.current.investment.value = e.target.value;
                }}
              />
            </div>
            <div>
              <p className="fieldsLabel">Risk per Trade</p>
              <input
                type="text"
                className="customFieldInput"
                placeholder="Rs.0000"
                name="risk"
                ref={(ref) => (inputRef.current.risk = ref)}
                onChange={(e) => {
                  inputRef.current.risk.value = e.target.value;
                }}
              />
            </div>
            <div>
              <p className="fieldsLabel">Entry Price</p>
              <input
                type="text"
                className="customFieldInput"
                placeholder="Rs.0000"
                name="entry"
                ref={(ref) => (inputRef.current.entry = ref)}
                onChange={(e) => {
                  inputRef.current.entry.value = e.target.value;
                }}
              />
            </div>
          </div>
          <div className="inputFields position-size-fields">
            <div style={{ marginRight: "120px" }}>
              <p className="fieldsLabel">Stop Loss</p>
              <input
                type="text"
                className="customFieldInput"
                placeholder="Rs.0000"
                name="stopLoss"
                ref={(ref) => (inputRef.current.stopLoss = ref)}
                onChange={(e) => {
                  inputRef.current.stopLoss.value = e.target.value;
                }}
              />
            </div>
            <div>
              <p className="fieldsLabel">Target Price</p>
              <input
                type="text"
                className="customFieldInput"
                placeholder="Rs.0000"
                name="target"
                ref={(ref) => (inputRef.current.target = ref)}
                onChange={(e) => {
                  inputRef.current.target.value = e.target.value;
                }}
              />
            </div>
          </div>
          <div className="buttons-area">
            <Button
              variant="outline-primary"
              className="calculate-button"
              onClick={onResetFields}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              className="calculate-button"
              onClick={onCalculate}
            >
              Calculate
            </Button>
          </div>
        </Col>
        <Col sm={4} xs={12} className="Result">
          <ResultBox result={result} />
        </Col>
      </Row>
    </Container>
  );
};

export default PositionSize;

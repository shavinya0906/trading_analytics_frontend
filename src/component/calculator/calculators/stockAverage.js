import React, { useState,useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ResultBox from "../resultBox";

const StockAverage = () => {
  const inputRef = useRef({
    quantity:null,
    entryPrice:null,
  });

  const [stocks, setStocks] = useState([]); // Array to store stock details
  const [result, setResult] = useState({
    "Total Quantity": 0,
    "Average Price": 0,
    "Total Amount": 0,
  });

  const handleAddClick = () => {
    if (
      stocks.length < 10 &&
      inputRef.current.quantity.value &&
      inputRef.current.entryPrice.value
    ) {
      setStocks([
        ...stocks,
        {
          quantity: inputRef.current.quantity.value,
          entryPrice: inputRef.current.entryPrice.value,
        },
      ]);
    }
  };

  const handleCalculateClick = () => {
    let totalQuantity = 0;
    let totalAmount = 0;
    stocks.forEach((stock) => {
      totalQuantity += Number(stock.quantity);
      totalAmount += Number(stock.quantity) * Number(stock.entryPrice);
    });
    totalQuantity -= stocks[0].quantity;
    totalAmount -= stocks[0].quantity * stocks[0].entryPrice;
    const averagePrice = totalAmount / totalQuantity;
    setResult({
      "Total Quantity": totalQuantity,
      "Average Price": averagePrice.toFixed(2),
      "Total Amount": totalAmount.toFixed(2),
    });
  };

  const handleResetClick = () => {
    inputRef.current.quantity.value = null;
    inputRef.current.entryPrice.value = null;
    setStocks([]);
    setResult({
      "Total Quantity": 0,
      "Average Price": 0,
      "Total Amount": 0,
    });
  };

  return (
    <Container>
      <Row>
        <Col sm={8} xs={12} className="calculatorArea">
          <div className="calculatorHeading">
            <p>You can calculate your Stock Average</p>
          </div>
          <div className="inputFields stock-average">
            <div className="individual-stocks">
              <p className="fieldsLabel">Quantity</p>
              <input
                type="text"
                className="customFieldInput"
                placeholder="00"
                name="quantity"
                ref={(ref) => inputRef.current.quantity = ref}
                onChange={(e) => {
                  inputRef.current.quantity.value = e.target.value;
                }}
              />
              <p className="fieldsLabel">Entry Price</p>
              <input
                type="text"
                className="customFieldInput"
                placeholder="Rs.0000"
                name="entryPrice"
                ref={(ref) => inputRef.current.entryPrice = ref}
                onChange={(e) => {
                  inputRef.current.entryPrice.value = e.target.value;
                }}
              />
            </div>
            <Button variant="outline-primary" style={{marginRight:"30px"}}onClick={handleAddClick}>
              Add
            </Button>
            {stocks.map(
              (stock, index) =>
                  <div key={index} className="individual-stocks">
                    <p className="fieldsLabel">Quantity</p>
                    <input
                      type="text"
                      className="customFieldInput"
                      placeholder="00"
                      value={stock.quantity}
                      disabled={index > 0} // Disable input for added stocks
                    />
                    <p className="fieldsLabel">Entry Price</p>
                    <input
                      type="text"
                      className="customFieldInput"
                      placeholder="Rs.0000"
                      value={stock.entryPrice}
                      disabled={index > 0} // Disable input for added stocks
                    />
                  </div>
            )}
          </div>
          <div className="buttons-area">
            <Button
              variant="outline-primary"
              className="calculate-button"
              onClick={handleResetClick}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              className="calculate-button"
              onClick={handleCalculateClick}
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

export default StockAverage;

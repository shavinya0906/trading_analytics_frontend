import React from "react";

const TradeAccountList = ({ list, setFormStatus }) => {
  return (
    <div className="list-head">
      {list.map((el) => (
        <div key={el?.account_Id}>
          <h3>{el?.account_name}</h3>
          <p>{el?.trading_account}</p>
          <p>{el?.account_email}</p>
          <p>{el?.account_mobile}</p>
          <p>{el?.purpose}</p>
        </div>
      ))}
    <div className="add-btn" onClick={() => setFormStatus('add')}>+ Add New Trading Account</div>
    </div>
  );
};

export default TradeAccountList;

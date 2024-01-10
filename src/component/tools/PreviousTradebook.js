import { useEffect, useState } from "react";

const PreviousTradebook = ({ data }) => {
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  return (
    <div>
      {tableData && tableData.length > 0 && (
        <div style={{maxWidth:"1350px",overflowX:"auto",marginBottom:"20px"}}>
          <table style={{ width: "100%", marginTop: "20px" }}>
            <thead>
              <tr
                style={{
                  height: "60px",
                  background: "#E4E4E4",
                  color: "#9DA2A6",
                  fontWeight: "500",
                  fontSize: "15px",
                  lineHeight: "16.94px",
                }}
              >
                {tableData.length > 0 &&
                  tableData[0].values.map((col, index) => (
                    <th style={{ padding: "0 10px" }} key={index}>
                      {col}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(1).map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    background: rowIndex % 2 === 0 ? "white" : "#F6F6F6",
                    height: "60px",
                  }}
                >
                  {row.values.map((value, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        color: "black",
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "16.94px",
                        padding: "0 12px",
                      }}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PreviousTradebook;

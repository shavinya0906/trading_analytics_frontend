import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';

const PreviousTradebook = ({ data }) => {
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  // const handleCellChange = (rowIndex, colIndex, newValue) => {
  //   const updatedData = tableData.map((row, i) => {
  //     if (i === rowIndex) {
  //       return {
  //         id: row.id,
  //         values: row.values.map((cell, j) =>
  //           j === colIndex ? newValue : cell
  //         ),
  //       };
  //     }
  //     return row;
  //   });

  //   setTableData(updatedData);
  // };

  const handlePaste =async (event, rowIndex, colIndex) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text');

    // Parse pasted Excel data using xlsx library
    const workbook = XLSX.read(pastedData, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Get the parsed data
    const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Update the corresponding cells in the table
    const updatedData = tableData.map((row, i) => {
      if (i === rowIndex) {
        return {
          id: row.id,
          values: row.values.map((cell, j) => (j === colIndex ? parsedData[0][j] : cell)),
        };
      }
      return row;
    });

    setTableData(updatedData);
  };

  return (
    <div>
      {tableData && tableData.length>0 && (
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
                key={row.id}
                style={{
                  background: rowIndex % 2 === 0 ? "white" : "#F6F6F6",
                  height: "60px",
                }}
              >
                {row.values.map((value, colIndex) => (
                  <td
                    key={colIndex}
                    contentEditable
                    // onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.innerText)}
                    onPaste={(e) => handlePaste(e, rowIndex, colIndex)}
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
      )}
    </div>
  );
};

export default PreviousTradebook;

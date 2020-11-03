import React from "react";
import "./styles.css";

import withBorderSelection from "./hoc/withBorderSelection";

export default function App() {
  return (
    <div className="App">
      <NormalTable name="lakhdar">
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td>Firstname</td>
              <td>Lastname</td>
              <td>Age</td>
            </tr>
            <tr>
              <td>Jill</td>
              <td>Smith</td>
              <td>50</td>
            </tr>
            <tr>
              <td>Eve</td>
              <td>Jackson</td>
              <td>94</td>
            </tr>
            <tr>
              <td>John</td>
              <td>Doe</td>
              <td>80</td>
            </tr>
          </tbody>
        </table>
      </NormalTable>
    </div>
  );
}

let NormalTable = ({ children }) => {
  return <div>{children}</div>;
};

NormalTable = withBorderSelection(NormalTable);

/* eslint-disable react/prop-types */
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
import React, { useState } from "react";

const CPaginator = (props) => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const template = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 120, value: 120 },
      ];

      return (
        <React.Fragment>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Items per page:{" "}
          </span>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
          />
        </React.Fragment>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      );
    },
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  return (
    <Paginator
      template={template}
      first={first}
      rows={rows}
      totalRecords={props.totalRecords}
      onPageChange={(e) => onPageChange(e)}
      className="justify-content-end"
    />
  );
};

export default CPaginator;

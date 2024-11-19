/* eslint-disable react/prop-types */

import { Button } from "primereact/button";

const InvestorSubmit = (props) => {
  return (
    <>
      {props?.errorData !== "" ? (
        <div className="border-2 border-dashed surface-border border-round surface-ground font-medium p-2 mt-6">
          <p className="text-center">
            <i
              className="pi pi-times"
              style={{ fontSize: "30px", color: "red" }}
            />
          </p>

          <h3 className="text-center">{props?.errorData}</h3>
        </div>
      ) : (
        <div className="border-2 border-dashed surface-border border-round surface-ground font-medium p-2 mt-6">
          <p className="text-center">
            <i
              className="pi pi-verified"
              style={{ fontSize: "30px", color: "green" }}
            />
          </p>

          <h3 className="text-center">Investor uploaded successfully</h3>
        </div>
      )}
      <div className="flex pt-4 justify-content-between mb-3">
        <Button
          label="Back"
          severity="secondary"
          icon="pi pi-arrow-left"
          // eslint-disable-next-line react/prop-types
          onClick={() => props.back()}
          type="button"
        />
        <div className="flex  justify-content-end gap-2">
          <Button
            label={"Submit"}
            iconPos="right"
            onClick={() => props.handelDialogeClose()}
            type="submit"
          />
        </div>
      </div>
    </>
  );
};

export default InvestorSubmit;

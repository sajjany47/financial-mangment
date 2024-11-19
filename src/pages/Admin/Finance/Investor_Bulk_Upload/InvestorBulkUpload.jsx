/* eslint-disable react/prop-types */
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useRef, useState } from "react";
import InvestorUpload from "./InvestorUpload";
import InvestorPreview from "./InvestorPreview";
import InvestorSubmit from "./InvestorSubmit";

const InvestorBulkUpload = (props) => {
  const stepperRef = useRef(null);
  const [data, setData] = useState([]);
  const [errorData, setErrorData] = useState("");

  const next = () => {
    return stepperRef.current.nextCallback();
  };

  const back = () => {
    return stepperRef.current.prevCallback();
  };

  const getData = (e) => {
    setData(e);
  };

  const getErrorData = (e) => {
    setErrorData(e);
  };

  return (
    <>
      <div className="card flex justify-content-center">
        <Stepper ref={stepperRef} style={{ flexBasis: "75rem" }} activeStep={0}>
          <StepperPanel header="Upload">
            <InvestorUpload
              next={next}
              getData={getData}
              getErrorData={getErrorData}
            />
          </StepperPanel>
          <StepperPanel header="Preview">
            <InvestorPreview
              next={next}
              back={back}
              data={data}
              getErrorData={getErrorData}
            />
          </StepperPanel>
          <StepperPanel header="Submit">
            <InvestorSubmit
              next={next}
              back={back}
              errorData={errorData}
              handelDialogeClose={() => props.handelDialogeClose()}
            />
          </StepperPanel>
        </Stepper>
      </div>
    </>
  );
};

export default InvestorBulkUpload;

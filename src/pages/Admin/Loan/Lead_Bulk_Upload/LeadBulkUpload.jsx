/* eslint-disable react/prop-types */
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useRef, useState } from "react";
import LeadUpload from "./LeadUpload";
import LeadPreview from "./LeadPreview";
import LeadSubmit from "./LeadSubmit";

const LeadBulkUpload = (props) => {
  const stepperRef = useRef(null);
  const [data, setData] = useState([]);
  const [errorData, setErrorData] = useState([]);

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
            <LeadUpload next={next} getData={getData} />
          </StepperPanel>
          <StepperPanel header="Preview">
            <LeadPreview
              next={next}
              back={back}
              data={data}
              getErrorData={getErrorData}
            />
          </StepperPanel>
          <StepperPanel header="Submit">
            <LeadSubmit
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

export default LeadBulkUpload;

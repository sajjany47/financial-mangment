import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useRef } from "react";
import LeadUpload from "./LeadUpload";
import LeadPreview from "./LeadPreview";
import LeadSubmit from "./LeadSubmit";

const LeadBulkUpload = () => {
  const stepperRef = useRef(null);

  const next = () => {
    return stepperRef.current.nextCallback();
  };

  const back = () => {
    return stepperRef.current.prevCallback();
  };
  return (
    <>
      <div className="card flex justify-content-center">
        <Stepper ref={stepperRef} style={{ flexBasis: "75rem" }} activeStep={0}>
          <StepperPanel header="Upload">
            <LeadUpload next={next} />
          </StepperPanel>
          <StepperPanel header="Preview">
            <LeadPreview next={next} back={back} />
          </StepperPanel>
          <StepperPanel header="Submit">
            <LeadSubmit next={next} back={back} />
          </StepperPanel>
        </Stepper>
      </div>
    </>
  );
};

export default LeadBulkUpload;

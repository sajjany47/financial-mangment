import { useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import BasicDetails from "./BasicDetails";
import EducationDetails from "./EducationDetails";
import DocumentDetails from "./DocumentDetails";
import AccountDetails from "./AccountDetails";

const AddUser = () => {
  const stepperRef = useRef(null);

  const next = () => {
    return stepperRef.current.nextCallback();
  };

  const back = () => {
    return stepperRef.current.prevCallback();
  };
  return (
    <div className="card flex justify-content-center">
      <Stepper ref={stepperRef} style={{ flexBasis: "75rem" }}>
        <StepperPanel header="Basic">
          <BasicDetails next={next} />
        </StepperPanel>
        <StepperPanel header="Education & Experience">
          <EducationDetails next={next} back={back} />
        </StepperPanel>
        <StepperPanel header="Document">
          <DocumentDetails next={next} back={back} />
        </StepperPanel>
        <StepperPanel header="Account">
          <AccountDetails next={next} back={back} />
        </StepperPanel>
      </Stepper>
    </div>
  );
};

export default AddUser;

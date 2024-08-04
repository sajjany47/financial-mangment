import { useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import BasicDetails from "./BasicDetails";
import EducationDetails from "./EducationDetails";
import DocumentDetails from "./DocumentDetails";
import AccountDetails from "./AccountDetails";
import { useLocation } from "react-router-dom";

const AddUser = () => {
  const stepperRef = useRef(null);
  const { state } = useLocation();

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
          <BasicDetails next={next} type={state.type} role={state.role} />
        </StepperPanel>
        <StepperPanel header="Education & Experience">
          <EducationDetails next={next} back={back} type={state.type} />
        </StepperPanel>
        <StepperPanel header="Document">
          <DocumentDetails next={next} back={back} type={state.type} />
        </StepperPanel>
        <StepperPanel header="Account">
          <AccountDetails next={next} back={back} type={state.type} />
        </StepperPanel>
      </Stepper>
    </div>
  );
};

export default AddUser;

import { useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import LoanBasic from "./LoanBasic";
import LoanAddress from "./LoanAddress";
import LoanWork from "./LoanWork";
import LoanDocument from "./LoanDocument";
import LoanAccount from "./LoanAccount";

const AddApplication = () => {
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
        <Stepper ref={stepperRef} style={{ flexBasis: "75rem" }}>
          <StepperPanel header="Basic">
            <LoanBasic next={next} />
          </StepperPanel>
          <StepperPanel header="Communication">
            <LoanAddress next={next} back={back} />
          </StepperPanel>

          <StepperPanel header="Work Details">
            <LoanWork next={next} back={back} />
          </StepperPanel>
          <StepperPanel header="Document">
            <LoanDocument next={next} back={back} />
          </StepperPanel>
          <StepperPanel header="Account">
            <LoanAccount next={next} back={back} />
          </StepperPanel>
        </Stepper>
      </div>
    </>
  );
};

export default AddApplication;

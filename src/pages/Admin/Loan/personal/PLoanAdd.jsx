import { useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import PLoanBasic from "./PLoanBasic";
import PLoanAddress from "./PLoanAddress";
import PLoanWork from "./PLoanWork";
import PLoanDocument from "./PLoanDocument";
import PLoanAccount from "./PLoanAccount";

const PLoanAdd = () => {
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
            <PLoanBasic next={next} />
          </StepperPanel>
          <StepperPanel header="Communication">
            <PLoanAddress next={next} back={back} />
          </StepperPanel>

          <StepperPanel header="Work Details">
            <PLoanWork next={next} back={back} />
          </StepperPanel>
          <StepperPanel header="Document">
            <PLoanDocument next={next} back={back} />
          </StepperPanel>
          <StepperPanel header="Account">
            <PLoanAccount next={next} back={back} />
          </StepperPanel>
        </Stepper>
      </div>
    </>
  );
};

export default PLoanAdd;

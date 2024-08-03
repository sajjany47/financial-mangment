import { useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import BasicDetails from "./BasicDetails";
import EducationDetails from "./EducationDetails";
import DocumentDetails from "./DocumentDetails";
import AccountDetails from "./AccountDetails";

const AddCustomer = () => {
  const stepperRef = useRef(null);
  return (
    <div className="card flex justify-content-center">
      <Stepper ref={stepperRef} style={{ flexBasis: "75rem" }}>
        <StepperPanel header="Basic">
          <div className="flex flex-column ">
            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
              <BasicDetails />
            </div>
          </div>
          <div className="flex pt-4 justify-content-end">
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={() => stepperRef.current.nextCallback()}
            />
          </div>
        </StepperPanel>
        <StepperPanel header="Education & Experience">
          <div className="flex flex-column">
            <div className="border-2 border-dashed surface-border border-round surface-ground font-medium">
              <EducationDetails />
            </div>
          </div>
          <div className="flex pt-4 justify-content-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current.prevCallback()}
            />
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={() => stepperRef.current.nextCallback()}
            />
          </div>
        </StepperPanel>
        <StepperPanel header="Document">
          <div className="flex flex-column">
            <div className="border-2 border-dashed surface-border border-round surface-ground  font-medium">
              <DocumentDetails />
            </div>
          </div>
          <div className="flex pt-4 justify-content-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current.prevCallback()}
            />
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={() => stepperRef.current.nextCallback()}
            />
          </div>
        </StepperPanel>
        <StepperPanel header="Account">
          <div className="flex flex-column">
            <div className="border-2 border-dashed surface-border border-round surface-ground  font-medium">
              <AccountDetails />
            </div>
          </div>
          <div className="flex pt-4 justify-content-start">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current.prevCallback()}
            />
          </div>
        </StepperPanel>
      </Stepper>
    </div>
  );
};

export default AddCustomer;

import { useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import PLoanBasic from "./PLoanBasic";
import PLoanAddress from "./PLoanAddress";
import PLoanWork from "./PLoanWork";
import PLoanDocument from "./PLoanDocument";
import PLoanAccount from "./PLoanAccount";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { applicationDetails } from "../LoanService";
import Loader from "../../../../component/Loader";

const PLoanAdd = () => {
  const stepperRef = useRef(null);
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const data = useLocation().state;
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});

  useEffect(() => {
    if (loanDetails.type === "edit") {
      setLoading(true);
      applicationDetails(loanDetails.loanId)
        .then((res) => {
          setDetails(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const next = () => {
    return stepperRef.current.nextCallback();
  };

  const back = () => {
    return stepperRef.current.prevCallback();
  };

  return (
    <>
      {loading && <Loader />}
      <div className="card flex justify-content-center">
        <Stepper
          ref={stepperRef}
          style={{ flexBasis: "75rem" }}
          activeStep={Object.keys(details).length > 0 ? details?.pageIndex : 0}
        >
          <StepperPanel header="Basic">
            <PLoanBasic next={next} loanTypeOption={data.loanTypeOption} />
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

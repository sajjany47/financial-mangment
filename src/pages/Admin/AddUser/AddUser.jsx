import { useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import BasicDetails from "./BasicDetails";
import EducationDetails from "./EducationDetails";
import DocumentDetails from "./DocumentDetails";
import AccountDetails from "./AccountDetails";
import { useSelector } from "react-redux";
import { countryList, getDetails } from "./AddUserService";
import Loader from "../../../component/Loader";

const AddUser = () => {
  const stepperRef = useRef(null);
  const addUserData = useSelector((state) => state.addUser.addUser);
  // const addUserData = searchKey.addUser.addUser;
  const [loading, setLoading] = useState(false);
  const [getUserData, setGetUerData] = useState({});
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    if (addUserData.type === "edit") {
      setLoading(true);
      getDetails(addUserData.id)
        .then((res) => {
          setGetUerData(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    countryList()
      .then((res) => {
        setCountryData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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
          activeStep={
            Object.keys(getUserData).length > 0 ? getUserData?.pageIndex : 0
          }
        >
          <StepperPanel header="Basic">
            <BasicDetails next={next} countryData={countryData} />
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
    </>
  );
};

export default AddUser;

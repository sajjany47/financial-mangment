import { applicationRenderStatus } from "../../../shared/Config";
import LoanList from "./LoanList";

const ApprovedApplication = () => {
  return (
    <div>
      <LoanList
        show={false}
        labelName={"Approved Application List"}
        type={applicationRenderStatus.approved}
      />
    </div>
  );
};

export default ApprovedApplication;

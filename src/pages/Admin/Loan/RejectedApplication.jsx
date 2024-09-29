import { applicationRenderStatus } from "../../../shared/Config";
import LoanList from "./LoanList";

const RejectedApplication = () => {
  return (
    <div>
      <LoanList
        show={false}
        labelName={"Rejected Application List"}
        type={applicationRenderStatus.rejected}
      />
    </div>
  );
};

export default RejectedApplication;

import { applicationRenderStatus } from "../../../shared/Config";
import LoanList from "./LoanList";

const ProgressApplication = () => {
  return (
    <div>
      <LoanList
        show={false}
        labelName={"Progress Application List"}
        type={applicationRenderStatus.inProgress}
      />
    </div>
  );
};

export default ProgressApplication;

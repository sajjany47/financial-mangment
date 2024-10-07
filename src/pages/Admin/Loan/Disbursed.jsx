import { applicationRenderStatus } from "../../../shared/Config";
import LoanList from "./LoanList";

const Disbursed = () => {
  return (
    <div>
      <LoanList
        show={false}
        labelName={"Disbursed Application List"}
        type={applicationRenderStatus.disbursed}
      />
    </div>
  );
};

export default Disbursed;

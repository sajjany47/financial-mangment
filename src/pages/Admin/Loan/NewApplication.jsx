import { applicationRenderStatus } from "../../../shared/Config";
import LoanList from "./LoanList";

const NewApplication = () => {
  return (
    <div>
      <LoanList
        show={true}
        labelName={"Application List"}
        type={applicationRenderStatus.incompleted}
      />
    </div>
  );
};

export default NewApplication;

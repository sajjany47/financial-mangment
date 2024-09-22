import LoanList from "./LoanList";

const ApprovedApplication = () => {
  return (
    <div>
      <LoanList
        show={false}
        labelName={"Approved Application List"}
        type="approved"
      />
    </div>
  );
};

export default ApprovedApplication;

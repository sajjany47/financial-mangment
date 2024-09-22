import LoanList from "./LoanList";

const RejectedApplication = () => {
  return (
    <div>
      <LoanList
        show={false}
        labelName={"Rejected Application List"}
        type="rejected"
      />
    </div>
  );
};

export default RejectedApplication;

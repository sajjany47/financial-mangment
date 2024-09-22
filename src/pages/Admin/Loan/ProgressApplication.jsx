import LoanList from "./LoanList";

const ProgressApplication = () => {
  return (
    <div>
      <LoanList
        show={false}
        labelName={"Progress Application List"}
        type="progress"
      />
    </div>
  );
};

export default ProgressApplication;

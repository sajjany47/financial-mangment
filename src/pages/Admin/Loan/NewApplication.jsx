import LoanList from "./LoanList";

const NewApplication = () => {
  return (
    <div>
      <LoanList show={true} labelName={"Application List"} type="incompleted" />
    </div>
  );
};

export default NewApplication;

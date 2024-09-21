import LoanList from "./LoanList";

const NewApplication = () => {
  return (
    <div>
      <LoanList show={true} labelName={"Application List"} />
    </div>
  );
};

export default NewApplication;

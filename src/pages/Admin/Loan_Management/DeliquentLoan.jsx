import ManagementList from "./ManagementList";

const DeliquentLoan = () => {
  return (
    <div>
      <ManagementList
        labelName={"Delinquent Loan List"}
        type={"delinquentLoan"}
      />
    </div>
  );
};

export default DeliquentLoan;

import { useEffect } from "react";
import { getLoanApplicationView } from "../Loan/LoanService";
import { useParams } from "react-router-dom";

const ApplicationView = () => {
  const id = useParams().id;
  useEffect(() => {
    getLoanApplicationView(id).then((res) => {
      console.log(res.data);
    });
  });
  return <div>ApplicationView</div>;
};

export default ApplicationView;

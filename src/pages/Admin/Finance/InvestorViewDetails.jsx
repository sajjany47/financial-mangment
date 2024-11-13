import { useEffect, useState } from "react";
import { getInvestorDetails } from "./FinanceService";
import { useParams } from "react-router-dom";
import Loader from "../../../component/Loader";

const InvestorViewDetails = () => {
  const id = useParams().id;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getInvestorDetails(id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(data);
  return <>{loading && <Loader />}</>;
};

export default InvestorViewDetails;

/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import Loader from "../../../component/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoan } from "../../../store/reducer/AddLoanReducer";
import { Dialog } from "primereact/dialog";
import { applicationList } from "./LoanService";
import { Dropdown } from "primereact/dropdown";
import { countryList } from "../AddUser/AddUserService";
import { loanTypeGetList } from "../setting/SettingService";

const LoanList = (props) => {
  const dispatch = useDispatch();
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const userDetails = useSelector((state) => state.user.user.data);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectCountry, setSelectCountry] = useState(userDetails.country);
  const [loanTypeOption, setLoanTypeOption] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [actionType, setActionType] = useState("country");

  useEffect(() => {
    countryList()
      .then((res) => {
        setCountryData(
          res.data.map((item) => ({
            ...item,
            label: item.name,
            value: item.id,
          }))
        );
      })
      .catch(() => {});
    getApplicationList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getApplicationList = () => {
    setLoading(true);

    applicationList({ type: props.type })
      .then((res) => {
        setList(res.data);

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">{props.labelName}</span>
        {props.show && (
          <Button
            label="Add Application"
            icon="pi pi-plus"
            onClick={() => {
              // navigate("/application/add");
              dispatch(setAddLoan({ type: "add" }));
              setVisible(true);
            }}
          />
        )}
      </div>
    );
  };
  const actionBodyTemplate = () => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          text
          aria-label="Filter"
          onClick={() => {
            navigate("/employee/edit");
          }}
        />
      </>
    );
  };

  const handelLoanNavigation = (item) => {
    dispatch(
      setAddLoan({
        ...loanDetails,
        loanType: { ...item, country: selectCountry },
      })
    );
    navigate(item.path);
  };

  const handelSubmit = () => {
    setLoading(true);
    loanTypeGetList({ country: selectCountry })
      .then((res) => {
        setLoanTypeOption(res.data);
        setActionType("loanType");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <Loader />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
        <DataTable
          value={list}
          header={header}
          // tableStyle={{ minWidth: "60rem" }}
          dataKey="_id"
          emptyMessage="No data found."
          filterDisplay="row"
        >
          <Column field="applicationNumber" header="Application Number" />
          <Column field="name" header="Name" />
          <Column field="mobile" header="Mobile" />
          <Column field="loanType" header="Type" />
          <Column field="loanAmount" header="Amount" />
          <Column field="loanStatus" header="Status" />
          <Column field="branch" header="Branch" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>

      <Dialog
        header={
          actionType === "loanType" ? "Select Loan Type" : "Select Country"
        }
        visible={visible}
        style={{ width: actionType === "loanType" ? "50vw" : "25vw" }}
        onHide={() => {
          setVisible(false);
          setLoanTypeOption([]);
          setActionType("country");
        }}
      >
        <div className="surface-0">
          <div className="grid">
            {actionType === "loanType" ? (
              <>
                {loanTypeOption.length > 0 ? (
                  loanTypeOption.map((item, index) => {
                    return (
                      <div
                        className="col-12 md:col-3 mb-2 px-3 text-center"
                        key={index}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handelLoanNavigation(item);
                        }}
                      >
                        <span
                          className="p-3 shadow-2 mb-3 inline-block"
                          style={{ borderRadius: "10px" }}
                        >
                          <i
                            className={`pi ${item.icon} text-4xl text-blue-500`}
                          ></i>
                        </span>
                        <div className="text-900 text-xl mb-3 font-medium">
                          {item.name}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 m-2 px-3 text-center">
                    No loan availbale for this country
                  </div>
                )}
              </>
            ) : (
              <>
                {" "}
                <div className="col-12 md:col-12 m-2 ">
                  <Dropdown
                    filter
                    value={selectCountry}
                    onChange={(e) => setSelectCountry(e.value)}
                    options={countryData}
                    placeholder="Select a country"
                    className="w-full md:w-18rem"
                  />
                </div>
                <div className="col-12 md:col-12 m-2 ">
                  <Button
                    label="Submit"
                    className="w-full md:w-18rem"
                    onClick={handelSubmit}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default LoanList;

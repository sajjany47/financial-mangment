import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { cleanObject } from "../../../shared/constant";
import { setSearch } from "../../../store/reducer/searchReducer";
import { DropdownField, InputField } from "../../../component/FieldType";
import { branchList } from "../Branch/BranchService";
import { useEffect, useState } from "react";
import { loanTypeGetList } from "../setting/SettingService";

const LoanSearch = () => {
  const searchKey = useSelector((state) => state?.search?.value);
  const dispatch = useDispatch();
  const [branch, setBranch] = useState([]);
  const [loanTypeOption, setLoanTypeOption] = useState([]);

  useEffect(() => {
    getLoanTypeList();
    getBranchList();
  }, []);

  const getLoanTypeList = () => {
    loanTypeGetList({}).then((res) => {
      setLoanTypeOption(
        res.data.map((item) => ({
          ...item,
          label: item.name,
          value: item._id,
        }))
      );
    });
  };
  const getBranchList = () => {
    branchList({}).then((res) => {
      setBranch(
        res.data.map((item) => ({
          label: `${item.name} (${item.code})`,
          value: item._id,
        }))
      );
    });
  };

  const initialValues = {
    name: "",
    applicationNumber: "",
    mobile: "",
    loanType: "",
    branch: "",
  };

  const handelSubmit = (values) => {
    let data = cleanObject(values);

    dispatch(
      setSearch({
        ...searchKey,
        pageNumber: 1,
        firstPage: 0,
        filterOptions: data,
      })
    );
  };
  return (
    <>
      <Formik onSubmit={handelSubmit} initialValues={initialValues}>
        {({ handleSubmit, resetForm }) => (
          <Form onSubmit={handleSubmit}>
            <div className=" surface-ground flex-auto flex justify-content-center align-items-center font-medium">
              <div
                className="grid p-3 border-2 border-dashed surface-border border-round"
                style={{ backgroundColor: "beige" }}
              >
                <div className="col-12 md:col-3">
                  <Field
                    label="Lead/Application Number"
                    component={InputField}
                    name="applicationNumber"
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field label="Name" component={InputField} name="name" />
                </div>
                <div className="col-12 md:col-3">
                  <Field label="Mobile" component={InputField} name="mobile" />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="Loan Type"
                    component={DropdownField}
                    name="loanType"
                    options={loanTypeOption}
                    filter
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="Branch"
                    component={DropdownField}
                    name="branch"
                    filter
                    options={branch}
                  />
                </div>

                <div className="col-12 md:col-12">
                  <div className="flex pt-4 justify-content-end gap-2">
                    <Button
                      type="button"
                      label={"Reset"}
                      severity="danger"
                      onClick={() => {
                        dispatch(
                          setSearch({
                            ...searchKey,
                            pageNumber: 1,
                            firstPage: 0,
                            filterOptions: {},
                            reset: !searchKey.reset,
                          })
                        );
                        resetForm();
                      }}
                    />
                    <Button type="submit" label={"Search "} />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoanSearch;

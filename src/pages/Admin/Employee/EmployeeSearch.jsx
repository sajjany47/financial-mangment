import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { cleanObject } from "../../../shared/constant";
import { setSearch } from "../../../store/reducer/searchReducer";
import { DropdownField, InputField } from "../../../component/FieldType";
import { ActiveStatus, DropdownPosition } from "../../../shared/Config";

const EmployeeSearch = () => {
  const searchKey = useSelector((state) => state?.search?.value);
  const dispatch = useDispatch();

  const initialValues = {
    name: "",
    position: "",
    branchCode: "",
    employeeId: "",
    username: "",
    isActive: "",
  };

  const handelSubmit = (values) => {
    let data = cleanObject(values);
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty("isActive")) {
      data.isActive = data.isActive === "active" ? true : false;
    }
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
        {({ handleSubmit, setFieldValue, resetForm }) => (
          <Form onSubmit={handleSubmit}>
            <div className=" surface-ground flex-auto flex justify-content-center align-items-center font-medium">
              <div
                className="grid p-3 border-2 border-dashed surface-border border-round"
                style={{ backgroundColor: "beige" }}
              >
                <div className="col-12 md:col-3">
                  <Field label="Name" component={InputField} name="name" />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="Position"
                    component={DropdownField}
                    name="position"
                    options={DropdownPosition}
                    filter
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="Branch Code"
                    component={InputField}
                    name="branchCode"
                    onChange={(e) =>
                      setFieldValue("branchCode", e.target.value.toUpperCase())
                    }
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="Employee ID"
                    component={InputField}
                    name="employeeId"
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="Username"
                    component={InputField}
                    name="username"
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="Status"
                    component={DropdownField}
                    name="isActive"
                    options={ActiveStatus}
                  />
                </div>

                <div className="col-12 md:col-12">
                  {" "}
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

export default EmployeeSearch;

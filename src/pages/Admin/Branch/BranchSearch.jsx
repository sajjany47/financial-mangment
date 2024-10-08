import { Field, Form, Formik } from "formik";
import { DropdownField, InputField } from "../../../component/FieldType";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { city, countryList, state } from "../AddUser/AddUserService";
import { cleanObject } from "../../../shared/constant";
import { ActiveStatus } from "../../../shared/Config";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../../../store/reducer/searchReducer";

const BranchSearch = () => {
  const searchKey = useSelector((state) => state?.search?.value);
  const dispatch = useDispatch();
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const initialValues = {
    name: "",
    code: "",
    state: "",
    country: "",
    city: "",
    pincode: "",
    isActive: "",
  };
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handelSate = (setFieldValue, e) => {
    setStateData([]);
    setCityData([]);
    setFieldValue("state", "");
    setFieldValue("city", "");
    setFieldValue("country", e);
    stateList(e);
  };

  const handelCityList = (setFieldValue, e, value) => {
    setCityData([]);
    setFieldValue("city", "");
    setFieldValue("state", e);
    cityList(value.country, e);
  };

  const stateList = (country) => {
    state(Number(country))
      .then((res) => {
        setStateData(
          res.data.map((item) => ({
            ...item,
            label: item.name,
            value: item.id,
          }))
        );
      })
      .catch(() => {});
  };

  const cityList = (country, state) => {
    city(Number(country), Number(state))
      .then((res) => {
        setCityData(
          res.data.map((item) => ({
            ...item,
            label: item.name,
            value: item.id,
          }))
        );
      })
      .catch(() => {});
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
        {({ handleSubmit, setFieldValue, values, resetForm }) => (
          <Form onSubmit={handleSubmit}>
            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
              <div className="grid p-3">
                <div className="col-12 md:col-3">
                  <Field
                    label="Code"
                    component={InputField}
                    name="code"
                    onChange={(e) =>
                      setFieldValue("code", e.target.value.toUpperCase())
                    }
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field label="Name" component={InputField} name="name" />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="Status"
                    component={DropdownField}
                    name="isActive"
                    options={ActiveStatus}
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="Country"
                    component={DropdownField}
                    name="country"
                    options={countryData}
                    filter
                    onChange={(e) => handelSate(setFieldValue, e.target.value)}
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="State"
                    filter
                    component={DropdownField}
                    name="state"
                    options={stateData}
                    onChange={(e) =>
                      handelCityList(setFieldValue, e.target.value, values)
                    }
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="City"
                    component={DropdownField}
                    name="city"
                    filter
                    options={cityData}
                  />
                </div>

                <div className="col-12 md:col-3">
                  <Field
                    label="Pincode"
                    component={InputField}
                    name="pincode"
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

export default BranchSearch;

import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import {
  DropdownField,
  InputField,
  TextAreaInputField,
} from "../../../component/FieldType";
import * as Yup from "yup";
import { city, countryList, state } from "../AddUser/AddUserService";
import Loader from "../../../component/Loader";
import { createBranch } from "./BranchService";
import Swal from "sweetalert2";

const createBranchSchema = Yup.object().shape({
  _id: Yup.string(),
  name: Yup.string().required("Name is required"),
  country: Yup.object().required("Country is required"),
  state: Yup.object().required("State is required"),
  city: Yup.object().required("City is required"),
  email: Yup.string().required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  address: Yup.string().required("Address is required"),
  pincode: Yup.string().required("Pincode is required"),
  code: Yup.string().required("Code is required"),
});
const Branch = () => {
  const [visible, setVisible] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    countryList()
      .then((res) => {
        setCountryData(res.data);
      })
      .catch(() => {});
  }, []);

  const stateList = (country) => {
    state({ country: country })
      .then((res) => {
        setStateData(res.data);
      })
      .catch(() => {});
  };

  const cityList = (country, state) => {
    city({ country: country, state: state })
      .then((res) => {
        setCityData(res.data);
      })
      .catch(() => {});
  };

  const initialValues = {
    name: "",
    phone: "",
    email: "",
    code: "",
    address: "",
    state: "",
    country: "",
    city: "",
    pincode: "",
  };

  const handelSate = (setFieldValue, e) => {
    setFieldValue("state", "");
    setFieldValue("city", "");
    setFieldValue("country", e.value);
    stateList(e.value.iso2);
  };

  const handelCityList = (setFieldValue, e, value) => {
    setFieldValue("city", "");
    setFieldValue("state", e.value);
    cityList(value.country.iso2, e.value.iso2);
  };

  const handelSubmit = (values) => {
    setLoading(true);
    const reqData = {
      ...values,
      country: values.country.id,
      state: values.state.id,
      city: values.city.id,
    };
    createBranch(reqData).then((res) => {
      Swal.fire({ title: res.message, icon: "success" });
      setLoading(false);
      setVisible(false);
    });
  };
  return (
    <>
      {loading && <Loader />}
      <div className="flex justify-content-end">
        <Button
          label="Add Branch"
          icon="pi pi-plus"
          onClick={() => setVisible(true)}
        />
      </div>

      <Dialog
        header="Add Branch"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          setVisible(false);
        }}
      >
        <Formik
          onSubmit={handelSubmit}
          initialValues={initialValues}
          validationSchema={createBranchSchema}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex flex-column ">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                  <div className="grid p-3">
                    <div className="col-12 md:col-4">
                      <Field label="Name" component={InputField} name="name" />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        label="Phone"
                        component={InputField}
                        name="phone"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Email"
                        component={InputField}
                        name="email"
                      />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        label="Address"
                        component={TextAreaInputField}
                        name="address"
                        rows={2}
                        cols={10}
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Country"
                        component={DropdownField}
                        name="country"
                        optionLabel="name"
                        optionValue="iso2"
                        options={countryData}
                        filter
                        onChange={(e) => handelSate(setFieldValue, e)}
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="State"
                        filter
                        component={DropdownField}
                        name="state"
                        optionLabel="name"
                        optionValue="iso2"
                        options={stateData}
                        onChange={(e) =>
                          handelCityList(setFieldValue, e, values)
                        }
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="City"
                        component={DropdownField}
                        name="city"
                        filter
                        options={cityData}
                        optionLabel="name"
                        optionValue="id"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Pincode"
                        component={InputField}
                        name="pincode"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Code"
                        component={InputField}
                        name="code"
                        onChange={(e) =>
                          setFieldValue("code", e.target.value.toUpperCase())
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex pt-4 justify-content-end gap-2">
                <Button
                  type="button"
                  label={"Cancel"}
                  severity="danger"
                  onClick={() => setVisible(false)}
                />
                <Button type="submit" label={"Submit "} />
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default Branch;

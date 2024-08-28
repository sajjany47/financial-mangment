/* eslint-disable react/prop-types */
import { Field, Form, Formik } from "formik";
import { InputField } from "../../../component/FieldType";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import * as Yup from "yup";
import { ErrorMessage } from "./EducationDetails";
import { findIFSC, getDetails, userUpdate } from "./AddUserService";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../../../component/Loader";
import { setAddUser } from "../../../store/reducer/AddUserReducer";
import { useNavigate } from "react-router-dom";

const AccountDetails = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchKey = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState({});
  const addUserData = searchKey.addUser.addUser;
  const accountDetailSchema = Yup.object().shape({
    bankName: Yup.string().required("Bank name is required"),
    accountNumber: Yup.string().required("Account number is required"),
    // .matches("/^d{9,18}$/", "Enter valid Account number"),
    branchName: Yup.string().required("Branch name is required"),
    ifsc: Yup.string().required("IFSC code is required"),
    passbookImage: Yup.string().required(
      "Passbook Front Page image is required"
    ),
    uanImage: Yup.string().when("uan", {
      is: (val) => val !== "" && val !== undefined,
      then: () => Yup.string().required("UAN image is required"),
    }),
  });
  const initialValues =
    addUserData.type === "add"
      ? {
          accountNumber: "",
          bankName: "",
          branchName: "",
          ifsc: "",
          uan: "",
          passbookImage: "",
          uanImage: "",
          passbookPreview: "",
          uanPreview: "",
        }
      : {
          bankName: employeeData.bankName ? employeeData.bankName : "",
          accountNumber: employeeData.accountNumber
            ? employeeData.accountNumber
            : "",
          branchName: employeeData.branchName ? employeeData.branchName : "",
          ifsc: employeeData.ifsc ? employeeData.ifsc : "",
          passbookImage: employeeData.passbookImage
            ? employeeData.passbookImage
            : "",
          uanImage: employeeData.uanImage ? employeeData.uanImage : "",
          passbookPreview: employeeData.passbookImage
            ? employeeData.passbookImage
            : "",
          uan: employeeData.uan,
          uanPreview: employeeData.uanImage ? employeeData.uanImage : "",
        };

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserDetails = () => {
    setLoading(true);
    getDetails(addUserData.id)
      .then((res) => {
        setEmployeeData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const handelSubmit = (values) => {
    setLoading(true);
    const reqData = {
      accountNumber: values.accountNumber,
      bankName: values.bankName,
      branchName: values.branchName,
      ifsc: values.ifsc,
      uan: values.uan,
      passbookImage: values.passbookImage,
      uanImage: values.uanImage,
      dataType: "account",
      profileRatio:
        employeeData.profileRatio <= 80 ? 80 : employeeData.profileRatio,
      id: employeeData._id,
    };
    userUpdate(reqData)
      .then((res) => {
        setLoading(false);
        Swal.fire({
          title: res.message,
          icon: "success",
        });
        dispatch(
          setAddUser({
            type: "",
            role: "",
            id: "",
            data: "",
          })
        );
        navigate("/employee/list");
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handelIfsc = (e, setFieldValue) => {
    setFieldValue("ifsc", e.target.value.toUpperCase());
    if (e.target.value.length === 11) {
      setLoading(true);
      findIFSC(e.target.value)
        .then((res) => {
          const data = res.data;

          setFieldValue("bankName", data.BANK);
          setFieldValue("branchName", data.BRANCH);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  return (
    <>
      {loading && <Loader />}
      <Formik
        onSubmit={handelSubmit}
        initialValues={initialValues}
        validationSchema={accountDetailSchema}
        enableReinitialize
      >
        {({ handleSubmit, setFieldValue, values, touched, errors }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex flex-column">
              <div className="border-2 border-dashed surface-border border-round surface-ground  font-medium">
                <div className="grid p-3">
                  <div className="col-12 md:col-3">
                    <Field
                      label="IFSC Code"
                      component={InputField}
                      name="ifsc"
                      onChange={(e) => handelIfsc(e, setFieldValue)}
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Bank Name"
                      component={InputField}
                      name="bankName"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Branch Name"
                      component={InputField}
                      name="branchName"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Account Number"
                      component={InputField}
                      name="accountNumber"
                    />
                  </div>

                  <div className="col-12 md:col-3">
                    <Field
                      label="UAN (EPFO)"
                      component={InputField}
                      name="uan"
                    />
                  </div>
                  <div className="col-12">
                    <div className="grid">
                      <div className="col-12 md:col-3">
                        <label
                          htmlFor="passbookImage"
                          className="block  font-medium mb-2 custom-file-upload"
                        >
                          Bank Passbook or statement{" "}
                        </label>
                        <input
                          id="passbookImage"
                          name="passbookImage"
                          type="file"
                          onChange={(e) => {
                            setFieldValue("passbookImage", e.target.files[0]);
                            setFieldValue(
                              "passbookPreview",
                              URL.createObjectURL(e.target.files[0])
                            );
                          }}
                        />
                        {ErrorMessage(errors, `passbookImage`, touched)}
                        <Image
                          src={values.passbookPreview}
                          alt="Image"
                          width="260"
                          height="260"
                        />
                      </div>
                      <div className="col-12 md:col-3">
                        <label
                          htmlFor="uan-upload"
                          className="block  font-medium mb-2 custom-file-upload"
                        >
                          Upload UAN (EPFO) Image{" "}
                        </label>
                        <input
                          id="uan-upload"
                          name="uanImage"
                          type="file"
                          onChange={(e) => {
                            setFieldValue("uanImage", e.target.files[0]);
                            setFieldValue(
                              "uanImagePreviw",
                              URL.createObjectURL(e.target.files[0])
                            );
                          }}
                        />
                        {ErrorMessage(errors, `uanImage`, touched)}
                        <Image
                          src={values.uanImagePreviw}
                          alt="Image"
                          width="260"
                          height="260"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex pt-4 justify-content-between">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => props.back()}
                type="button"
              />
              <Button label="Submit" type="submit" />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AccountDetails;

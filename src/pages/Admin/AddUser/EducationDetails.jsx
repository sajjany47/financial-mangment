/* eslint-disable react/prop-types */
import { Field, Form, Formik, getIn } from "formik";
import { DateField, InputField } from "../../../component/FieldType";
import { Button } from "primereact/button";
import { fresherOrExperience } from "../../../shared/Config";
import { Image } from "primereact/image";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  getDetails,
  userEducationDetailsUpdate,
  userEducationUpdate,
} from "./AddUserService";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../../../component/Loader";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import moment from "moment";

export const ErrorMessage = (errors, name, touched) => {
  return (
    Boolean(getIn(errors, name)) &&
    getIn(touched, name) && (
      <small className="text-red-400 mb-1">{getIn(errors, name)}</small>
    )
  );
};
const EducationDetails = (props) => {
  const addUserData = useSelector((state) => state.addUser.addUser);

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dataType, setDataType] = useState("");
  const [employeeData, setEmployeeData] = useState({});
  const [actionType, setActionType] = useState("");
  const [selectedData, setSelectedData] = useState({});

  const finalSubmitValidation = Yup.object().shape({
    education: Yup.array()
      .of(
        Yup.object().shape({
          boardName: Yup.string().required("Board name is required"),
          passingYear: Yup.string()
            .required("Passing year is required")
            .matches(/^\d{4}$/, "Enter a valid year"),
          marksPercentage: Yup.string()
            .required("Marks percentage is required")
            .matches(
              /^(100(\.0{1,2})?|(\d{1,2})(\.\d{1,2})?)$/,
              "Enter a valid percentage"
            ),
          resultImage: Yup.string().required("Marksheet is required"),
        })
      )
      .min(1, "At least one education detail is required")
      .required("Education details are required"),

    workDetail: Yup.array().when("fresherOrExperience", {
      is: (val) => val === fresherOrExperience.EXPERIENCE,
      then: Yup.array()
        .of(
          Yup.object().shape({
            companyName: Yup.string().required("Company name is required"),
            position: Yup.string().required("Position is required"),
            startingYear: Yup.string().required("Starting year is required"),
            endingYear: Yup.string().required("Ending year is required"),
            experienceLetter: Yup.string().required(
              "Experience Letter is required"
            ),
            relievingLetter: Yup.string().required(
              "Relieving Letter is required"
            ),
            appointmentLetter: Yup.string().required(
              "Appointment Letter is required"
            ),
            salarySlip: Yup.string().required("Salary Slip is required"),
          })
        )
        .required("Work details are required")
        .min(1, "At least one work detail is required"),
      otherwise: () => Yup.array().notRequired(),
    }),
  });

  const educationSchema = Yup.object().shape({
    boardName: Yup.string().required("Board name is required"),
    passingYear: Yup.string()
      .required("Passing year is required")
      .matches(/^\d{4}$/, "Enter a valid year"),
    marksPercentage: Yup.string()
      .required("Marks percentage is required")
      .matches(
        /^(100(\.0{1,2})?|(\d{1,2})(\.\d{1,2})?)$/,
        "Enter a valid percentage"
      ),
    resultImage: Yup.string().required("Marksheet is required"),
  });

  const workSchema = Yup.object().shape({
    workDetail: Yup.array().when("fresherOrExperience", {
      is: (val) => val === fresherOrExperience.EXPERIENCE,
      then: Yup.array()
        .of(
          Yup.object().shape({
            companyName: Yup.string().required("Company name is required"),
            position: Yup.string().required("Position is required"),
            startingYear: Yup.string().required("Starting year is required"),
            endingYear: Yup.string().required("Ending year is required"),
            experienceLetter: Yup.string().required(
              "Experience Letter is required"
            ),
            relievingLetter: Yup.string().required(
              "Relieving Letter is required"
            ),
            appointmentLetter: Yup.string().required(
              "Appointment Letter is required"
            ),
            salarySlip: Yup.string().required("Salary Slip is required"),
          })
        )
        .required("Work details are required")
        .min(1, "At least one work detail is required"),
      otherwise: () => Yup.array().notRequired(),
    }),
  });

  const initialValues =
    dataType === "education"
      ? actionType === "add"
        ? {
            boardName: "",
            passingYear: "",
            marksPercentage: "",
            resultImage: "",
            resultImagePre: "",
          }
        : { ...selectedData, resultImagePre: selectedData.resultImage }
      : actionType === "add"
      ? {
          companyName: "",
          position: "",
          startingYear: "",
          endingYear: "",
          experienceLetter: "",
          relievingLetter: "",
          appointmentLetter: "",
          salarySlip: "",
          experienceLetterPre: "",
          relievingLetterPre: "",
          appointmentLetterPre: "",
          salarySlipPre: "",
        }
      : {
          ...selectedData,
          startingYear: new Date(selectedData.startingYear),
          endingYear: new Date(selectedData.endingYear),
          experienceLetterPre: selectedData.experienceLetter,
          relievingLetterPre: selectedData.relievingLetter,
          appointmentLetterPre: selectedData.appointmentLetter,
          salarySlipPre: selectedData.salarySlip,
        };
  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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
    const reqData =
      dataType === "education"
        ? {
            boardName: values.boardName,
            passingYear: values.passingYear,
            marksPercentage: values.marksPercentage,
            resultImage: values.resultImage,
            actionType: actionType,
            dataType: dataType,
          }
        : {
            companyName: values.companyName,
            position: values.position,
            startingYear: values.startingYear,
            endingYear: values.endingYear,
            experienceLetter: values.experienceLetter,
            relievingLetter: values.relievingLetter,
            appointmentLetter: values.appointmentLetter,
            salarySlip: values.salarySlip,
            actionType: actionType,
            dataType: dataType,
          };

    const finalReqData =
      actionType === "add"
        ? { ...reqData, id: employeeData._id }
        : { ...reqData, productId: selectedData._id };

    userEducationDetailsUpdate(finalReqData)
      .then((res) => {
        setLoading(false);
        Swal.fire({
          title: res.message,
          icon: "success",
        });
        setVisible(false);
        // props.next();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const header = (data) => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">
          {data === "education" ? "Education Details" : "Work Details"}
        </span>
        <Button
          icon="pi pi-plus"
          rounded
          type="button"
          raised
          onClick={() => {
            setDataType(data);
            setVisible(true);
            setActionType("add");
          }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (data, e) => {
    return (
      <Button
        icon="pi pi-pencil"
        rounded
        type="button"
        text
        aria-label="Filter"
        onClick={() => {
          setActionType("edit");
          setSelectedData(data);
          setVisible(true);
          setDataType(e);
        }}
      />
    );
  };

  const finalSubmit = () => {
    userEducationUpdate({
      education: employeeData.education,
      workDetail: employeeData.workDetail,
      dataType: "educationAndWork",
      fresherOrExperience: employeeData.fresherOrExperience,
      profileRatio:
        employeeData.profileRatio <= 60 ? 60 : employeeData.profileRatio,
      id: employeeData._id,
    })
      .then((res) => {
        setLoading(false);
        Swal.fire({
          title: res.message,
          icon: "success",
        });
        props.next();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const startYearTemplate = (value) => {
    return moment(value.startingYear).format("DD MMM, YYYY");
  };

  const endYearTemplate = (value) => {
    return moment(value.endingYear).format("DD MMM, YYYY");
  };

  return (
    <>
      {loading && <Loader />}
      <Formik
        onSubmit={finalSubmit}
        validationSchema={finalSubmitValidation}
        initialValues={{
          education: employeeData?.education ? employeeData.education : [],
          workDetail: employeeData?.workDetail ? employeeData.workDetail : [],
          fresherOrExperience: employeeData.fresherOrExperience,
        }}
        enableReinitialize
      >
        {({ handleSubmit, values, errors, touched }) => (
          <Form onSubmit={handleSubmit}>
            <div className="border-2 border-dashed surface-border border-round surface-ground font-medium">
              <DataTable
                value={values?.education}
                header={() => header("education")}
                tableStyle={{ minWidth: "60rem" }}
              >
                <Column field="boardName" header="Board Name" />
                <Column field="passingYear" header="Passing Year" />
                <Column field="marksPercentage" header="Marks" />
                <Column
                  header="Action"
                  body={(e) => actionBodyTemplate(e, "education")}
                ></Column>
              </DataTable>
              {ErrorMessage(errors, `education`, touched)}
            </div>
            {values.fresherOrExperience === fresherOrExperience.EXPERIENCE && (
              <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
                <DataTable
                  value={values.workDetail}
                  header={() => header("work")}
                  tableStyle={{ minWidth: "60rem" }}
                >
                  <Column field="companyName" header="Institute Name" />
                  <Column field="position" header="Position" />
                  <Column
                    field="startingYear"
                    header="Starting Year"
                    body={startYearTemplate}
                  />
                  <Column
                    field="endingYear"
                    header="Ending Year"
                    body={endYearTemplate}
                  />
                  <Column
                    header="Action"
                    body={(e) => actionBodyTemplate(e, "work")}
                  />
                </DataTable>
                {ErrorMessage(errors, `workDetail`, touched)}
              </div>
            )}

            <div className="flex pt-4 justify-content-between">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                // eslint-disable-next-line react/prop-types
                onClick={() => props.back()}
                type="button"
              />
              <div className="flex  justify-content-end gap-2">
                {addUserData.type === "edit" && (
                  <Button
                    label="Next"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    onClick={() => props.next()}
                    type="button"
                  />
                )}

                <Button
                  label={
                    addUserData.type === "add" ? "Submit & Next" : "Update"
                  }
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  type="submit"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <Dialog
        header={dataType === "education" ? "Education Details" : "Work Details"}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          setVisible(false);
        }}
      >
        <Formik
          onSubmit={handelSubmit}
          initialValues={initialValues}
          validationSchema={
            dataType === "education" ? educationSchema : workSchema
          }
          enableReinitialize
        >
          {({ handleSubmit, values, setFieldValue, touched, errors }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex flex-column">
                <div className="border-2 border-dashed surface-border border-round surface-ground font-medium">
                  <div className="grid p-3">
                    {dataType === "education" ? (
                      <>
                        <div className="col-12 md:col-4">
                          <Field
                            label="Board Name"
                            component={InputField}
                            name={`boardName`}
                          />
                        </div>

                        <div className="col-12 md:col-4">
                          <Field
                            label="Passing Year"
                            component={InputField}
                            name={`passingYear`}
                          />
                        </div>
                        <div className="col-12 md:col-4">
                          <Field
                            label="Marks (%)"
                            component={InputField}
                            name={`marksPercentage`}
                          />
                        </div>

                        <div className="col-12 md:col-4">
                          <label
                            htmlFor={`resultImage`}
                            className="block  font-medium mb-2 custom-file-upload"
                          >
                            <i className="pi pi-upload mr-2" />
                            Markssheet
                          </label>
                          <input
                            id={`resultImage`}
                            name={`resultImage`}
                            type="file"
                            onChange={(e) => {
                              setFieldValue(`resultImage`, e.target.files[0]);
                              setFieldValue(
                                `resultImagePre`,
                                URL.createObjectURL(e.target.files[0])
                              );
                            }}
                          />
                          {ErrorMessage(errors, `resultImage `, touched)}

                          <Image
                            src={values.resultImagePre}
                            alt="Image"
                            width="210"
                            height="180"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-12 md:col-4">
                          <Field
                            label="Institute Name"
                            component={InputField}
                            name={`companyName`}
                          />
                        </div>
                        <div className="col-12 md:col-4">
                          <Field
                            label="Position"
                            component={InputField}
                            name={`position`}
                          />
                        </div>
                        <div className="col-12 md:col-4">
                          <Field
                            label="Starting Year"
                            component={DateField}
                            name={`startingYear`}
                          />
                        </div>
                        <div className="col-12 md:col-4">
                          <Field
                            label="Ending Year"
                            component={DateField}
                            name={`endingYear`}
                          />
                        </div>

                        <div className="col-12 md:col-12">
                          <div className="grid">
                            <div className="col-12 md:col-4">
                              <label
                                htmlFor={`relievingLetter`}
                                className="block  font-medium mb-2 custom-file-upload"
                              >
                                <i className="pi pi-upload mr-2" /> Relieving
                                Letter
                              </label>
                              <input
                                id={`relievingLetter`}
                                name={`relievingLetter`}
                                type="file"
                                onChange={(e) => {
                                  setFieldValue(
                                    `relievingLetter`,
                                    e.target.files[0]
                                  );
                                  setFieldValue(
                                    `relievingLetterPre`,
                                    URL.createObjectURL(e.target.files[0])
                                  );
                                }}
                              />
                              {ErrorMessage(errors, `relievingLetter`, touched)}
                              <Image
                                src={values.relievingLetterPre}
                                alt="Image"
                                width="180"
                                height="180"
                              />
                            </div>
                            <div className="col-12 md:col-4">
                              <label
                                htmlFor={`salarySlip`}
                                className="block  font-medium mb-2 custom-file-upload"
                              >
                                <i className="pi pi-upload mr-2" /> Latest
                                Salary Slip
                              </label>
                              <input
                                id={`salarySlip`}
                                name={`salarySlip`}
                                type="file"
                                onChange={(e) => {
                                  setFieldValue(
                                    `salarySlip`,
                                    e.target.files[0]
                                  );
                                  setFieldValue(
                                    `salarySlipPre`,
                                    URL.createObjectURL(e.target.files[0])
                                  );
                                }}
                              />
                              {ErrorMessage(errors, `salarySlip`, touched)}
                              <Image
                                src={values.salarySlipPre}
                                alt="Image"
                                width="180"
                                height="180"
                              />
                            </div>
                            <div className="col-12 md:col-4">
                              <label
                                htmlFor={`appointmentLetter`}
                                className="block  font-medium mb-2 custom-file-upload"
                              >
                                <i className="pi pi-upload mr-2" />
                                Appointment Letter
                              </label>
                              <input
                                id={`appointmentLetter`}
                                name={`appointmentLetter`}
                                type="file"
                                onChange={(e) => {
                                  setFieldValue(
                                    `appointmentLetter`,
                                    e.target.files[0]
                                  );
                                  setFieldValue(
                                    `appointmentLetterPre`,
                                    URL.createObjectURL(e.target.files[0])
                                  );
                                }}
                              />
                              {ErrorMessage(
                                errors,
                                `appointmentLetter`,
                                touched
                              )}
                              <Image
                                src={values.appointmentLetterPre}
                                alt="Image"
                                width="180"
                                height="180"
                              />
                            </div>

                            <div className="col-12 md:col-4">
                              <label
                                htmlFor={`experienceLetter`}
                                className="block  font-medium mb-2 custom-file-upload"
                              >
                                <i className="pi pi-upload mr-2" />
                                Experience Letter
                              </label>
                              <input
                                id={`experienceLetter`}
                                name={`experienceLetter`}
                                type="file"
                                onChange={(e) => {
                                  setFieldValue(
                                    `experienceLetter`,
                                    e.target.files[0]
                                  );
                                  setFieldValue(
                                    `experienceLetterPre`,
                                    URL.createObjectURL(e.target.files[0])
                                  );
                                }}
                              />
                              {ErrorMessage(
                                errors,
                                `experienceLetter`,
                                touched
                              )}
                              <Image
                                src={values.experienceLetterPre}
                                alt="Image"
                                width="180"
                                height="180"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex pt-4 justify-content-between">
                <Button
                  label="Cancel"
                  severity="secondary"
                  // icon="pi pi-arrow-left"
                  // eslint-disable-next-line react/prop-types
                  onClick={() => setVisible(false)}
                  type="button"
                />

                <Button
                  label={addUserData.type === "add" ? "Submit " : "Update"}
                  // icon="pi pi-arrow-right"
                  iconPos="right"
                  type="submit"
                />
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default EducationDetails;

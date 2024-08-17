/* eslint-disable react/prop-types */
import { Field, Form, Formik, getIn } from "formik";
import { DateField, InputField } from "../../../component/FieldType";
import { Button } from "primereact/button";
import { fresherOrExperience } from "../../../shared/Config";
import { Image } from "primereact/image";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { userEducationUpdate } from "./AddUserService";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Loader from "../../../component/Loader";
import { setAddUser } from "../../../store/reducer/AddUserReducer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";

export const ErrorMessage = (errors, name, touched) => {
  return (
    Boolean(getIn(errors, name)) &&
    getIn(touched, name) && (
      <small className="text-red-400 mb-1">{getIn(errors, name)}</small>
    )
  );
};
const EducationDetails = (props) => {
  const dispatch = useDispatch();
  const searchKey = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dataType, setDataType] = useState("");
  const [employeeData, setEmployeeData] = useState({});
  const [resultImage, setResultImage] = useState("");

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
  const addUserData = searchKey.addUser.addUser;
  const initialValues =
    dataType === "education"
      ? {
          boardName: "",
          passingYear: "",
          marksPercentage: "",
          resultImage: "",
        }
      : {
          companyName: "",
          position: "",
          startingYear: "",
          endingYear: "",
          experienceLetter: "",
          relievingLetter: "",
          appointmentLetter: "",
          salarySlip: "",
        };

  const handelSubmit = (values) => {
    // setLoading(true);
    let formData = new FormData();
    formData("id", "66bf909de0f4dabdb4df05c6");
    formData(
      "education",
      JSON.stringify(
        values.education.map((item) => ({
          boardName: item.boardName,
          passingYear: item.passingYear,
          marksPercentage: item.marksPercentage,
          resultImage: item.resultImage,
        }))
      )
    );
    formData("fresherOrExperience", values.fresherOrExperience);
    if (values.fresherOrExperience === fresherOrExperience.EXPERIENCE) {
      formData(
        "workDetail",
        JSON.stringify(
          values.workDetail.map((item) => ({
            companyName: item.companyName,
            position: item.position,
            startingYear: item.startingYear,
            endingYear: item.endingYear,
            experienceLetter: item.experienceLetter,
            relievingLetter: item.relievingLetter,
            appointmentLetter: item.appointmentLetter,
            salarySlip: item.salarySlip,
          }))
        )
      );
    } else {
      formData("workDetail", null);
    }

    // const reqData = {
    //   id: "66bf909de0f4dabdb4df05c6",
    //   education: values.education.map((item) => ({
    //     boardName: item.boardName,
    //     passingYear: item.passingYear,
    //     marksPercentage: item.marksPercentage,
    //     resultImage: item.resultImage.name,
    //   })),
    //   fresherOrExperience: values.fresherOrExperience,
    //   workDetail:
    //     values.fresherOrExperience === fresherOrExperience.FRESHER
    //       ? null
    //       : values.workDetail.map((item) => ({
    //           companyName: item.companyName,
    //           position: item.position,
    //           startingYear: item.startingYear,
    //           endingYear: item.endingYear,
    //           experienceLetter: item.experienceLetter.name,
    //           relievingLetter: item.relievingLetter.name,
    //           appointmentLetter: item.appointmentLetter.name,
    //           salarySlip: item.salarySlip.name,
    //         })),
    // };

    userEducationUpdate(formData)
      .then((res) => {
        dispatch(
          setAddUser({
            ...searchKey.addUser.addUser,
            id: res.data._id,
            data: res.data,
          })
        );
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

  const header = (data) => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">
          {data === "education" ? "Education Details" : "Work Details"}
        </span>
        <Button
          icon="pi pi-plus"
          rounded
          raised
          onClick={() => {
            setDataType(data);
            setVisible(true);
          }}
        />
      </div>
    );
  };

  const imageBodyTemplate = (product) => {
    return (
      <img
        src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
        alt={product.image}
        className="w-6rem shadow-2 border-round"
      />
    );
  };
  const actionBodyTemplate = (data) => {
    console.log(data);
    return <Button icon="pi pi-pencil" rounded text aria-label="Filter" />;
  };
  return (
    <>
      {loading && <Loader />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium">
        <DataTable
          value={[]}
          header={() => header("education")}
          tableStyle={{ minWidth: "60rem" }}
        >
          <Column field="name" header="Board Name" />
          <Column field="year" header="Passing Year" />
          <Column field="Marks" header="Marks" />
          <Column header="Image" body={imageBodyTemplate}></Column>
          <Column header="Action" body={actionBodyTemplate}></Column>
        </DataTable>
      </div>
      {employeeData.fresherOrExperience === fresherOrExperience.EXPERIENCE && (
        <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
          <DataTable
            value={[]}
            header={() => header("work")}
            tableStyle={{ minWidth: "60rem" }}
          >
            <Column field="name" header="Board Name" />
            <Column field="year" header="Passing Year" />
            <Column field="Marks" header="Marks" />
            <Column header="Image" body={imageBodyTemplate}></Column>
            <Column header="Action" body={actionBodyTemplate}></Column>
          </DataTable>
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
            label={addUserData.type === "add" ? "Submit & Next" : "Update"}
            icon="pi pi-arrow-right"
            iconPos="right"
            type="submit"
          />
        </div>
      </div>

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

                        {values.resultImage === "" ? (
                          <div className="col-12 md:col-12">
                            <label
                              htmlFor={"resultImage"}
                              className="block text-900 font-medium mb-2"
                            >
                              Marksheet Image
                            </label>
                            <FileUpload
                              name="resultImage"
                              customUpload
                              onUpload={(e) =>
                                setFieldValue("resultImage", e.files[0])
                              }
                              multiple
                              accept="image/*"
                              maxFileSize={1000000}
                              emptyTemplate={
                                <p className="m-0">
                                  Drag and drop files to here to upload.
                                </p>
                              }
                            />
                          </div>
                        ) : (
                          <div className="col-12 md:col-3">
                            <Image
                              src={URL.createObjectURL(values.resultImage)}
                              alt="Image"
                              width="180"
                              height="180"
                            />
                          </div>
                        )}
                        <div className="col-12 md:col-3">
                          <Image
                            src={values.imagePreview}
                            alt="Image"
                            width="180"
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

                        <div className="col-12 md:col-4">
                          <label
                            htmlFor={`appointmentLetter`}
                            className="block  font-medium mb-2 custom-file-upload"
                          >
                            Upload Appointment Letter
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
                                `appointmentPreview`,
                                URL.createObjectURL(e.target.files[0])
                              );
                            }}
                          />
                          {ErrorMessage(errors, `appointmentLetter`, touched)}
                          <Image
                            src={values.appointmentPreview}
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
                            Latest Salary Slip
                          </label>
                          <input
                            id={`salarySlip`}
                            name={`salarySlip`}
                            type="file"
                            onChange={(e) => {
                              setFieldValue(`salarySlip`, e.target.files[0]);
                              setFieldValue(
                                `slarySlipPreview`,
                                URL.createObjectURL(e.target.files[0])
                              );
                            }}
                          />
                          {ErrorMessage(errors, `salarySlip`, touched)}
                          <Image
                            src={values.slarySlipPreview}
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
                            Upload Experience Letter
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
                                `experiencePreview`,
                                URL.createObjectURL(e.target.files[0])
                              );
                            }}
                          />
                          {ErrorMessage(errors, `experienceLetter`, touched)}
                          <Image
                            src={values.experiencePreview}
                            alt="Image"
                            width="180"
                            height="180"
                          />
                        </div>
                        <div className="col-12 md:col-4">
                          <label
                            htmlFor={`relievingLetter`}
                            className="block  font-medium mb-2 custom-file-upload"
                          >
                            Upload Relieving Letter
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
                                `relievingPreview`,
                                URL.createObjectURL(e.target.files[0])
                              );
                            }}
                          />
                          {ErrorMessage(errors, `relievingLetter`, touched)}
                          <Image
                            src={values.relievingPreview}
                            alt="Image"
                            width="180"
                            height="180"
                          />
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

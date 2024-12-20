/* eslint-disable react/prop-types */
import { getIn } from "formik";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { MultiSelect } from "primereact/multiselect";
import { InputTextarea } from "primereact/inputtextarea";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { FileUpload } from "primereact/fileupload";

export const InputField = ({ field, form: { touched, errors }, ...props }) => {
  return (
    <div className="flex align-items-start justify-content-center flex-column">
      {props.label && (
        <label htmlFor={field.name} className="block text-900 font-medium mb-2">
          {props.label}{" "}
          {props.requiredlabel === "true" && (
            <span className="text-red-400">*</span>
          )}
        </label>
      )}
      <InputText
        id={field.name}
        {...field}
        {...props}
        // value={field.value ? field.value : ""}
        placeholder={`Enter ${props.label}`}
        style={{ width: "100%" }}
        className={`w-full mb-1 ${props.customStyle}  ${
          Boolean(getIn(errors, field.name)) &&
          getIn(touched, field.name) &&
          "p-invalid"
        }`}
      />
      {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
        <small className="text-red-400 mb-1">{getIn(errors, field.name)}</small>
      )}
    </div>
  );
};

export const UploadField = ({ field, form: { touched, errors }, ...props }) => {
  return (
    <div className="flex align-items-start justify-content-center flex-column">
      {props.label && (
        <label htmlFor={field.name} className="block text-900 font-medium mb-2">
          {props.label}{" "}
          {props.requiredlabel === "true" && (
            <span className="text-red-400">*</span>
          )}
        </label>
      )}
      <FileUpload
        id={field.name}
        {...field}
        {...props}
        accept={props.accept ? props.accept : "image/*,application/pdf"}
        customUpload
        maxFileSize={10000000}
        emptyTemplate={
          <p className="m-0">Drag and drop files to here to upload.</p>
        }
        style={{ width: "100%" }}
        className={`w-full mb-1 ${props.customStyle}  ${
          Boolean(getIn(errors, field.name)) &&
          getIn(touched, field.name) &&
          "p-invalid"
        }`}
      />

      {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
        <small className="text-red-400 mb-1">{getIn(errors, field.name)}</small>
      )}
    </div>
  );
};

export const DropdownField = ({
  field,
  form: { touched, errors },
  ...props
}) => (
  <div className="flex align-items-start justify-content-center flex-column">
    {props.label && (
      <label htmlFor={field.name} className="block text-900 font-medium mb-2">
        {props.label}{" "}
        {props.requiredlabel === "true" && (
          <span className="text-red-400 ">*</span>
        )}
      </label>
    )}
    <Dropdown
      id={field.name}
      {...field}
      {...props}
      style={{ width: "100%" }}
      placeholder={`Select ${props.label}`}
      className={`w-full mb-1 ${props.customStyle} ${
        Boolean(getIn(errors, field.name)) &&
        getIn(touched, field.name) &&
        "p-invalid"
      }`}
    />

    {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
      <small className="text-red-400 mb-1">{getIn(errors, field.name)}</small>
    )}
  </div>
);

export const DateField = ({ field, form: { touched, errors }, ...props }) => (
  <div className="flex align-items-start justify-content-center flex-column">
    <label htmlFor={field.name} className="block text-900 font-medium mb-2">
      {props.label}{" "}
      {props.requiredlabel === "true" && (
        <span className="text-red-400">*</span>
      )}
    </label>
    <Calendar
      id={field.name}
      {...field}
      {...props}
      placeholder={`Select ${props.label}`}
      showIcon
      className={`w-full mb-1 ${props.customStyle} ${
        Boolean(getIn(errors, field.name)) &&
        getIn(touched, field.name) &&
        "p-invalid"
      }`}
    />

    {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
      <small className="text-red-400 mb-1">{getIn(errors, field.name)}</small>
    )}
  </div>
);

export const TimeField = ({ field, form: { touched, errors }, ...props }) => (
  <div className="flex align-items-start justify-content-center flex-column">
    <label htmlFor={field.name} className="block text-900 font-medium mb-2">
      {props.label}{" "}
      {props.requiredlabel === "true" && (
        <span className="text-red-400">*</span>
      )}
    </label>
    <Calendar
      id={field.name}
      {...field}
      {...props}
      placeholder={`Select ${props.label}`}
      showIcon
      timeOnly
      // stepMinute={30}
      icon={() => <i className="pi pi-clock" style={{ fontSize: "20px" }} />}
      className={`w-full mb-1 ${props.customStyle} ${
        Boolean(getIn(errors, field.name)) &&
        getIn(touched, field.name) &&
        "p-invalid"
      }`}
    />

    {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
      <small className="text-red-400 mb-1">{getIn(errors, field.name)}</small>
    )}
  </div>
);

export const RadioField = ({
  field,
  form: { touched, errors, setFieldValue },
  ...props
}) => (
  <div className="flex align-items-start justify-content-center flex-column">
    <label
      style={{ fontWeight: 500 }}
      htmlFor={field.name}
      className="block text-900 font-medium mb-2"
    >
      {props.label}{" "}
      {props.requiredlabel === "true" && (
        <span className="text-red-400">*</span>
      )}
    </label>
    <div className="flex flex-wrap gap-3">
      {props.radiolist.map((item) => {
        return (
          <div className="flex align-items-center" key={item.id}>
            <RadioButton
              {...props}
              {...field}
              {...item}
              inputId={item.id}
              checked={field.value === item.value}
              onChange={(e) => setFieldValue(field.name, e.value)}
            />
            <label htmlFor={item.id} className="ml-2">
              {item.label}
            </label>
          </div>
        );
      })}
    </div>

    {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
      <small className="text-red-400 mb-1">{getIn(errors, field.name)}</small>
    )}
  </div>
);

export const MultiDropdownField = ({
  field,
  form: { touched, errors },
  ...props
}) => (
  <div className="flex align-items-start justify-content-center flex-column">
    <label htmlFor={field.name} className="block text-900 font-medium mb-2">
      {props.label}{" "}
      {props.requiredlabel === "true" && (
        <span className="text-red-400">*</span>
      )}
    </label>
    <MultiSelect
      id={field.name}
      {...field}
      {...props}
      placeholder={`Select ${props.label}`}
      className={`w-full mb-1 ${props.customStyle} ${
        Boolean(getIn(errors, field.name)) &&
        getIn(touched, field.name) &&
        "p-invalid"
      }`}
      // maxSelectedLabels={3}
    />

    {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
      <small className="text-red-400 mb-1">{getIn(errors, field.name)}</small>
    )}
  </div>
);

export const TextAreaInputField = ({
  field,
  form: { touched, errors },
  ...props
}) => (
  <div className="flex align-items-start justify-content-center flex-column">
    <label htmlFor={field.name} className="block text-900 font-medium mb-2">
      {props.label}{" "}
      {props.requiredlabel === "true" && (
        <span className="text-red-400">*</span>
      )}
    </label>
    <InputTextarea
      id={field.name}
      {...field}
      {...props}
      placeholder={`Enter ${props.label}`}
      type="textarea"
      value={field.value ? field.value : ""}
      className={`w-full mb-1 ${props.customStyle} ${
        Boolean(getIn(errors, field.name)) &&
        getIn(touched, field.name) &&
        "p-invalid"
      }`}
    />

    {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
      <small className="text-red-400 mb-1">{getIn(errors, field.name)}</small>
    )}
  </div>
);

export const PasswordFiled = ({
  field,
  form: { touched, errors },
  ...props
}) => (
  <div className="flex align-items-start justify-content-center flex-column">
    {props.label && (
      <label htmlFor={field.name} className="block text-900 font-medium mb-2">
        {props.label}{" "}
        {props.requiredlabel === "true" && (
          <span className="text-red-400">*</span>
        )}
      </label>
    )}

    <Password
      id={field.name}
      {...field}
      {...props}
      placeholder={`Enter ${props.label}`}
      style={{ width: "100%" }}
      value={field.value ? field.value : ""}
      className={`w-full mb-1 ${props.customStyle} ${
        Boolean(getIn(errors, field.name)) &&
        getIn(touched, field.name) &&
        "p-invalid"
      }`}
      toggleMask
    />

    {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
      <small className="text-red-400 mb-1">{getIn(errors, field.name)}</small>
    )}
  </div>
);

export const CheckField = ({ field, form: { touched, errors }, ...props }) => (
  <div className="flex align-items-start justify-content-start flex-row gap-2">
    <Checkbox
      inputId={field.name}
      {...field}
      {...props}
      // onChange={(e) => setFieldValue(field.name, e.checked)}
      checked={field.value}
    />
    <label htmlFor={field.name} className="block text-900 font-medium mb-2">
      {props.label}{" "}
      {props.requiredlabel === "true" && (
        <span className="text-red-400 ">*</span>
      )}
    </label>
    {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
      <small className="text-red-400 mb-1">{getIn(errors, field.name)}</small>
    )}
  </div>
);

export const Currency = (data) => {
  const a = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(data ? data : 0);

  return a;
};

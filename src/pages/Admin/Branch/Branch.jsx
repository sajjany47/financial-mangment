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
import { branchDatatable, createBranch } from "./BranchService";
import Swal from "sweetalert2";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../../../store/reducer/searchReducer";
import { Dropdown } from "primereact/dropdown";
import { capitalizeFirstLetter } from "../../../shared/constant";
import { InputText } from "primereact/inputtext";
import {
  ActiveStatus,
  PAGE_ROW,
  PAGINATOR_DROPDOWN_OPTIONS,
} from "../../../shared/Config";
import { Paginator } from "primereact/paginator";
import { Tag } from "primereact/tag";

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
  const dispatch = useDispatch();
  const searchKey = useSelector((state) => state?.search?.value);
  const [visible, setVisible] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchKey?.page === "branch") {
      dispatch(setSearch({ ...searchKey }));
    } else {
      dispatch(
        setSearch({
          page: "branch",
          filterOptions: {},
          pageNumber: 1,
          firstPage: 0,
          rows: 10,
          sortOrder: 1,
          sortField: "name",
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    countryList()
      .then((res) => {
        setCountryData(res.data);
      })
      .catch(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getEmployeeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);

  const getEmployeeList = () => {
    const filters = searchKey?.filterOptions;
    setLoading(true);
    let reqData = {
      page: searchKey?.pageNumber,
      limit: searchKey?.rows,
      sort:
        searchKey?.sortField && searchKey?.sortOrder
          ? { [searchKey.sortField]: searchKey.sortOrder }
          : { name: 1 },
    };

    if (Object.keys(filters).length > 0) {
      if (filters.code !== "" && filters?.code !== undefined) {
        reqData.code = filters.code;
      }
      if (filters.name !== "" && filters?.name !== undefined) {
        reqData.name = filters.name;
      }
      if (filters.country !== "" && filters?.country !== undefined) {
        reqData.country = filters.country;
      }
      if (filters.state !== "" && filters.state !== undefined) {
        reqData.state = filters.state;
      }
      if (filters.city !== "" && filters.city !== undefined) {
        reqData.city = filters.city;
      }
      if (filters.isActive !== "" && filters.isActive !== undefined) {
        reqData.isActive = filters.isActive === "active" ? true : false;
      }
    }
    branchDatatable(reqData)
      .then((res) => {
        setBranchList(res.data);
        setTotalCount(res.count);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const stateList = (country) => {
    state(country)
      .then((res) => {
        setStateData(res.data);
      })
      .catch(() => {});
  };

  const cityList = (country, state) => {
    city(country, state)
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

  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">{"Branch List"}</span>
        <Button
          label="Add Branch"
          icon="pi pi-plus"
          onClick={() => setVisible(true)}
        />
      </div>
    );
  };
  const actionBodyTemplate = () => {
    return <Button icon="pi pi-pencil" rounded text aria-label="Filter" />;
  };

  const handelSubmit = (values) => {
    setLoading(true);
    const reqData = {
      ...values,
      country: values.country.id,
      state: values.state.id,
      city: values.city.id,
    };
    createBranch(reqData)
      .then((res) => {
        Swal.fire({ title: res.message, icon: "success" });
        setLoading(false);
        setVisible(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const statusItemTemplate = (rowData, type) => {
    return (
      <>
        {type === "isActive" ? (
          <>
            {rowData.value === "active" ? (
              <Tag severity="success" value="Active" rounded />
            ) : (
              <Tag severity="danger" value="Inactive" rounded />
            )}
          </>
        ) : type === "country" ? (
          rowData.name
        ) : (
          ""
        )}
      </>
    );
  };

  const dropdownFilterTemplate = (options) => {
    const filters = searchKey?.filterOptions;

    return (
      <>
        <Dropdown
          value={filters[options.field] || ""}
          onChange={(e) => onFilter(e, options.field)}
          options={
            options.field === "isActive"
              ? ActiveStatus
              : options.field === "country"
              ? countryData
              : []
          }
          // showFilterClear={true}

          showClear={filters[options?.field] !== undefined ? true : false}
          itemTemplate={(e) => statusItemTemplate(e, options.field)}
          placeholder={`${capitalizeFirstLetter(options.field)}`}
        />
      </>
    );
  };

  const inputFilterTemplate = (options) => {
    const filters = searchKey?.filterOptions;

    return (
      <>
        <InputText
          value={filters[options.field] || ""}
          onChange={(e) => onFilter(e, options.field)}
          placeholder={`${capitalizeFirstLetter(options.field)}`}
        />
      </>
    );
  };

  const onFilter = (event, field) => {
    let updatedFilters = { ...searchKey?.filterOptions };
    updatedFilters[field] = event.target.value;
    dispatch(
      setSearch({
        ...searchKey,
        pageNumber: 1,
        firstPage: 0,
        filterOptions: updatedFilters,
      })
    );
  };

  const onPageChange = (event) => {
    dispatch(
      setSearch({
        ...searchKey,
        pageNumber: Number(event.page) + 1,
        firstPage: event.first,
        rows: event.rows,
      })
    );
  };

  const paginatorTemplate = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      return (
        <>
          <span
            className="mx-1"
            style={{
              color: "var(--text-color)",
              userSelect: "none",
            }}
          >
            Items per page:{" "}
          </span>
          <Dropdown
            value={options.value}
            options={PAGINATOR_DROPDOWN_OPTIONS}
            onChange={options.onChange}
          />
        </>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      );
    },
  };

  const onSort = (e) => {
    setLoading(true);
    const { sortField, sortOrder } = e;
    dispatch(
      setSearch({
        ...searchKey,
        sortOrder: sortOrder,
        sortField: sortField,
      })
    );

    setBranchList([]);
  };

  const rowNumberTemplate = (rowData, rowIndex) => {
    return (searchKey.pageNumber - 1) * searchKey.rows + rowIndex.rowIndex + 1;
  };
  return (
    <>
      {loading && <Loader />}

      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
        <DataTable
          value={branchList}
          header={header}
          dataKey="_id"
          emptyMessage="No data found."
          filterDisplay="row"
          onSort={onSort}
          sortOrder={searchKey.sortOrder}
          sortField={searchKey.sortField}
        >
          <Column field="" header="SLNo." body={rowNumberTemplate} />
          <Column
            field="code"
            header="Code"
            sortable
            filter
            showFilterMenu={false}
            filterElement={inputFilterTemplate}
          />
          <Column
            field="name"
            header="Name"
            sortable
            filter
            showFilterMenu={false}
            filterElement={inputFilterTemplate}
          />
          <Column
            field="isActive"
            header="Status"
            sortable
            filter
            showFilterMenu={false}
            filterElement={dropdownFilterTemplate}
          />
          <Column
            field="country"
            header="Country"
            sortable
            filter
            showFilterMenu={false}
            filterElement={dropdownFilterTemplate}
          />
          <Column
            field="state"
            header="state"
            sortable
            filter
            showFilterMenu={false}
            filterElement={dropdownFilterTemplate}
          />
          <Column
            field="city"
            header="City"
            sortable
            filter
            showFilterMenu={false}
            filterElement={dropdownFilterTemplate}
          />
          <Column
            field="phone"
            header="Phone"
            sortable
            filter
            showFilterMenu={false}
            filterElement={inputFilterTemplate}
          />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
        <Paginator
          first={searchKey?.firstPage}
          rows={searchKey?.rows}
          totalRecords={totalCount}
          rowsPerPageOptions={PAGE_ROW}
          template={paginatorTemplate}
          onPageChange={onPageChange}
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

/* eslint-disable no-prototype-builtins */
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
import Loader from "../../../component/Loader";
import { branchDatatable, createBranch, updateBranch } from "./BranchService";
import Swal from "sweetalert2";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useDispatch, useSelector } from "react-redux";
import { Tag } from "primereact/tag";
import BranchSearch from "./BranchSearch";
import CPaginator from "../../../component/CPaginator";
import { setSearch } from "../../../store/reducer/searchReducer";
import { city, countryList, state } from "../Employee/AddUserService";

const createBranchSchema = Yup.object().shape({
  _id: Yup.string(),
  name: Yup.string().required("Name is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
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
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [selectData, setSelectData] = useState({});
  const [searchShow, setSearchShow] = useState(false);

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

  useEffect(() => {
    getBranchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);

  const getBranchList = () => {
    setLoading(true);
    let reqData = {
      page: searchKey?.pageNumber,
      limit: searchKey?.rows,
      sort:
        searchKey.hasOwnProperty("sortField") &&
        searchKey.hasOwnProperty("sortOrder")
          ? { [searchKey.sortField]: searchKey.sortOrder }
          : { name: 1 },
    };

    if (Object.keys(searchKey?.filterOptions).length > 0) {
      reqData = { ...reqData, ...searchKey?.filterOptions };
    }
    branchDatatable(reqData)
      .then((res) => {
        setBranchList(res.data);
        setTotal(res.count);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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

  const initialValues =
    actionType === "add"
      ? {
          name: "",
          phone: "",
          email: "",
          code: "",
          address: "",
          state: "",
          country: "",
          city: "",
          pincode: "",
        }
      : {
          name: selectData.name,
          phone: selectData.phone,
          email: selectData.email,
          code: selectData.code,
          address: selectData.address,
          state: selectData.state,
          country: selectData.country,
          city: selectData.city,
          pincode: selectData.pincode,
        };

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

  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">{"Branch List"}</span>
        <div className="flex gap-2">
          {searchShow ? (
            <Button
              icon="pi pi-times"
              severity="help"
              label="Hide"
              onClick={() => {
                setSearchShow(!searchShow);
              }}
            />
          ) : (
            <Button
              label="Search"
              icon="pi pi-search"
              onClick={() => {
                setSearchShow(!searchShow);
              }}
              severity="secondary"
            />
          )}

          <Button
            label="Add Branch"
            icon="pi pi-plus"
            onClick={() => {
              setVisible(true);
              setActionType("add");
            }}
          />
        </div>
      </div>
    );
  };
  const actionBodyTemplate = (item) => {
    return (
      <Button
        icon="pi pi-pencil"
        rounded
        text
        aria-label="Filter"
        onClick={() => {
          setVisible(true);
          setSelectData(item);
          setActionType("edit");
          stateList(item.country);
          cityList(item.country, item.state);
        }}
      />
    );
  };

  const handelSubmit = (values) => {
    // setLoading(true);
    const countryName = countryData.find((item) => item.id === values.country);
    const stateName = stateData.find((item) => item.id === values.state);
    const cityName = cityData.find((item) => item.id === values.city);

    const reqData = {
      ...values,
      countryName: countryName.name,
      stateName: stateName.name,
      cityName: cityName.name,
    };
    if (actionType === "add") {
      createBranch(reqData)
        .then((res) => {
          Swal.fire({ title: res.message, icon: "success" });
          setLoading(false);
          setVisible(false);
          getBranchList();
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      updateBranch({ ...reqData, _id: selectData._id })
        .then((res) => {
          Swal.fire({ title: res.message, icon: "success" });
          setLoading(false);
          setVisible(false);
          getBranchList();
        })
        .catch(() => {
          setLoading(false);
        });
    }
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

  const statusTemplate = (item) => {
    return (
      <>
        {item.isActive ? (
          <Tag severity="success" value="Active" rounded />
        ) : (
          <Tag severity="danger" value="Inactive" rounded />
        )}
      </>
    );
  };
  return (
    <>
      {loading && <Loader />}

      {searchShow && <BranchSearch />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3 mb-6">
        <DataTable
          value={branchList}
          header={header}
          dataKey="_id"
          emptyMessage="No data found."
          showGridlines
          onSort={onSort}
          sortOrder={searchKey.sortOrder}
          sortField={searchKey.sortField}
        >
          <Column field="" header="SLNo." body={rowNumberTemplate} />
          <Column field="code" header="Code" sortable />
          <Column field="name" header="Name" sortable />
          <Column
            field="isActive"
            header="Status"
            sortable
            body={statusTemplate}
          />
          <Column
            field="countryName"
            header="Country"
            sortable
            sortField="countryName"
          />
          <Column
            field="stateName"
            header="State"
            sortable
            sortField="stateName"
          />
          <Column
            field="cityName"
            header="City"
            sortable
            sortField="cityName"
          />
          <Column
            field="pincode"
            header="Pincode"
            sortable
            sortField="pincode"
          />
          <Column field="phone" header="Phone" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
        <CPaginator totalRecords={total} />
      </div>
      <Dialog
        header={actionType === "add" ? "Add Branch" : "Edit Branch"}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          setVisible(false);
          getBranchList();
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
                        options={countryData}
                        filter
                        onChange={(e) => {
                          handelSate(setFieldValue, e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-12 md:col-4">
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
                    <div className="col-12 md:col-4">
                      <Field
                        label="City"
                        component={DropdownField}
                        name="city"
                        filter
                        options={cityData}
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

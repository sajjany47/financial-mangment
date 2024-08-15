import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAddUser } from "../../../store/reducer/AddUserReducer";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-content-end">
        <Button
          label="Add Employee"
          icon="pi pi-user-plus"
          onClick={() => {
            navigate("/employee/add");
            dispatch(setAddUser({ type: "add", role: "employee" }));
          }}
        />
      </div>
    </>
  );
};

export default EmployeeList;

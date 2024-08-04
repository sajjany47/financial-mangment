import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-content-end">
        <Button
          label="Add Employee"
          icon="pi pi-user-plus"
          onClick={() => navigate("/employee/add", { state: { type: "add" } })}
        />
      </div>
    </>
  );
};

export default EmployeeList;

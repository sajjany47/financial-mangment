import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAddUser } from "../../../store/reducer/AddUserReducer";

const CustomerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-content-end">
        <Button
          label="Add Customer"
          icon="pi pi-user-plus"
          onClick={() => {
            navigate("/customers/add", {
              state: { type: "add", role: "customer" },
            });
            dispatch(setAddUser({ type: "add", role: "customer" }));
          }}
        />
      </div>
    </>
  );
};

export default CustomerList;

import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const CustomerList = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-content-end">
        <Button
          label="Add Customer"
          icon="pi pi-user-plus"
          onClick={() =>
            navigate("/customers/add", {
              state: { type: "add", role: "customer" },
            })
          }
        />
      </div>
    </>
  );
};

export default CustomerList;

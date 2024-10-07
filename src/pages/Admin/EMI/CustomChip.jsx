/* eslint-disable react/prop-types */
import { Chip } from "primereact/chip";

const CustomChip = (props) => {
  return (
    <Chip
      label={`${[props.name]}: ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(props.data ? props.data : 0)}`}
      className="m-2"
    />
  );
};

export default CustomChip;

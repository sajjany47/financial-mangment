import { ProgressSpinner } from "primereact/progressspinner";
const Loader = () => {
  return (
    <div className="loader_spinner">
      <ProgressSpinner
        style={{ width: "40px", height: "40px" }}
        strokeWidth="4"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
      <h3>Loading...</h3>
    </div>
  );
};

export default Loader;

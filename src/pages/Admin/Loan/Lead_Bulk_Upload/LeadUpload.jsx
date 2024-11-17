/* eslint-disable react/prop-types */
import { Button } from "primereact/button";

const LeadUpload = (props) => {
  return (
    <>
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium p-2">
        <div className="flex pt-4 justify-content-end mb-3">
          <Button
            label={"Submit & Next"}
            icon="pi pi-arrow-right"
            iconPos="right"
            onClick={() => props.next()}
            type="submit"
          />
        </div>
      </div>
    </>
  );
};

export default LeadUpload;

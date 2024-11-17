/* eslint-disable react/prop-types */
import { Button } from "primereact/button";

const LeadPreview = (props) => {
  return (
    <>
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium p-2">
        <div className="flex pt-4 justify-content-between mb-3">
          <Button
            label="Back"
            severity="secondary"
            icon="pi pi-arrow-left"
            // eslint-disable-next-line react/prop-types
            onClick={() => props.back()}
            type="button"
          />
          <div className="flex  justify-content-end gap-2">
            <Button
              label={"Submit & Next"}
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={() => props.next()}
              type="submit"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadPreview;

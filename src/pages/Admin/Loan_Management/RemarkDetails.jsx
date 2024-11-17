import { Timeline } from "primereact/timeline";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AgentRemarkDetails } from "./ManageService";
import moment from "moment";

const RemarkDetails = () => {
  const data = useLocation().state.data;
  const [list, setList] = useState([]);

  useEffect(() => {
    AgentRemarkDetails(data._id).then((res) => {
      setList(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {list.length > 0 ? (
        <div className="border-2 border-dashed surface-border border-round surface-ground font-medium  mb-6">
          <Timeline
            value={list}
            opposite={(item) => item.remark}
            content={(item) => (
              <>
                <small className="text-color-secondary">
                  {moment(item.date).format("DD MMM,YYYY HH:mm:ss")}
                </small>
                <br />
                <small className="text-color-secondary">
                  {item.createdBy_name} ({item.createdBy_username})
                </small>
              </>
            )}
            className="mt-3 mb-3"
          />
        </div>
      ) : (
        <div className="text-color-secondary mt-7 text-center">
          No remark available
        </div>
      )}
    </div>
  );
};

export default RemarkDetails;

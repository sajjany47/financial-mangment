import { Tree } from "primereact/tree";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { capitalizeFirstLetter } from "../../../shared/constant";
import { Card } from "primereact/card";

const MenuTreeView = () => {
  const data = useLocation().state.data;
  const [nodes, setNodes] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState({ 0: true, "0-0": true });

  useEffect(() => {
    const modifyData = data?.menu.map((item, index) => ({
      key: `${index}`,
      label: capitalizeFirstLetter(item.name),
      icon: item.icon,
      children: item.childMenu.map((elm, indx) => ({
        key: `${index}-${indx}`,
        label: elm.name,
      })),
    }));

    setNodes(modifyData);

    const initialExpandedKeys = modifyData.reduce((acc, item) => {
      acc[item.key] = true;
      item.children?.forEach((child) => (acc[child.key] = true));
      return acc;
    }, {});
    setExpandedKeys(initialExpandedKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3 mb-6">
        <Card title={capitalizeFirstLetter(data.name)}>
          {" "}
          <Tree
            value={nodes}
            className="w-full "
            filter
            filterMode="lenient"
            filterPlaceholder="Menu Search"
            expandedKeys={expandedKeys}
            onToggle={(e) => setExpandedKeys(e.value)}
          />
        </Card>
      </div>
    </>
  );
};

export default MenuTreeView;

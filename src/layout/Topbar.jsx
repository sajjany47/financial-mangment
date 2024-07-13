import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import { BreadCrumb } from "primereact/breadcrumb";

export default function Topbar() {
  const items = [
    { label: "Electronics" },
    { label: "Computer" },
    { label: "Accessories" },
    { label: "Keyboard" },
    { label: "Wireless" },
  ];
  const home = { icon: "pi pi-home", url: "https://primereact.org" };
  const start = <BreadCrumb model={items} home={home} />;
  const end = (
    <div className="flex align-items-center gap-2">
      <InputText
        placeholder="Search"
        type="text"
        className="w-8rem sm:w-auto"
      />
      <Avatar
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
      />
    </div>
  );

  return (
    <div className="card">
      <Menubar start={start} end={end} />
    </div>
  );
}

import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { BreadCrumb } from "primereact/breadcrumb";
import { Menu } from "primereact/menu";
import { Badge } from "primereact/badge";
import { useRef } from "react";

export default function Topbar() {
  const menuRef = useRef();
  const items = [
    { label: "Electronics" },
    { label: "Computer" },
    { label: "Accessories" },
  ];
  const home = { icon: "pi pi-home", url: "https://primereact.org" };
  const start = <BreadCrumb model={items} home={home} />;
  const end = (
    <div className="flex align-items-center gap-2">
      <h4> Sajjan Yadav</h4>
      <Avatar
        size="large"
        style={{
          backgroundColor: "#2196F3",
          color: "#ffffff",
          cursor: "pointer",
        }}
        onClick={(event) => menuRef.current.toggle(event)}
        aria-controls="popup_menu_left"
        aria-haspopup
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
      />
    </div>
  );

  const itemRenderer = (item) => (
    <div className="p-menuitem-content">
      <a className="flex align-items-center p-menuitem-link">
        <span className={item.icon} />
        <span className="mx-2">{item.label}</span>
        {item.badge && <Badge className="ml-auto" value={item.badge} />}
        {item.shortcut && (
          <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
            {item.shortcut}
          </span>
        )}
      </a>
    </div>
  );

  const menuTemplate = [
    {
      //   label: "Profile",
      items: [
        {
          label: "Settings",
          icon: "pi pi-cog",
          template: itemRenderer,
        },
        {
          label: "Messages",
          icon: "pi pi-inbox",
          badge: 2,
          template: itemRenderer,
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          template: itemRenderer,
        },
      ],
    },
  ];

  return (
    <div className="card">
      <Menubar start={start} end={end} />
      <Menu
        model={menuTemplate}
        popup
        ref={menuRef}
        id="popup_menu_left"
        className="w-full md:w-15rem"
      />
    </div>
  );
}

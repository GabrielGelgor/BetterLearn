import React from "react";
import Menu from "./Menu";

const Sidebar = () => {
  const heading = "BetterLearn";

  return (
    <div>
      <div className="left-top">{heading}</div>
      <Menu />
    </div>
  );
};

export default Sidebar;

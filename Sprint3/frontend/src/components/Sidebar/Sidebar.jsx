import React from "react";

export default function Sidebar({ children }) {
  return (
    <aside>
      <div className="sidebar">{children}</div>
    </aside>
  );
}

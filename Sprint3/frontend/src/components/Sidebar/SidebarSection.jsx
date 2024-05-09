import React from "react";

export default function SidebarSection({ icon, title, active, onClick }) {
  const className = `sideBTN ${active ? "active" : ""}`;
  return (
    <a
      href="index"
      className={className}
      onClick={(e) => {
        e.preventDefault(); // Prevent default anchor click behavior
        onClick(); // Call the onClick handler passed as a prop
      }}
    >
      <span className="material-icons-sharp">{icon}</span>
      <h3>{title}</h3>
    </a>
  );
}

import React from 'react'

export default function Status({children}) {
  let color = "gray";
  switch (children) {
    case "Completed":
      color ="#28A745";
      break;
    case "Not Completed":
    case "Unassigned":
      color = "#DC3545";
      break
    case "Ongoing":
      color = "#FFC107";
    break
    case "Ended":
      color = "#007BFF";
      break
    case "Created in Course":
      color = "#007BFF";
      break
    case "Created in Class":
      color = "#17A2B8";
      break
    case "Upcoming":
      color = "#17A2B8";
      break
    case "Shared":
      color = "#28A745";
      break
      case "Disable Show Result":
        color = "#DC3545";
        break
    case "Not Shared":
      color = "#007BFF";
      break
    default:
      break;
  }
  return (
    <p className={`status-text`} style={{backgroundColor: color}}>{children}</p>
  )
}

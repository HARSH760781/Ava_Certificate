import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AccountCircle,
  Email,
  Phone,
  School,
  MenuBook,
  CalendarToday,
  Badge,
  Apartment,
  Code,
  Numbers,
  YouTube,
} from "@mui/icons-material";
import "./StudentDetails.css";
import { Facebook, LinkedIn, Twitter, Instagram } from "@mui/icons-material";

const StudentDetails = () => {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("id");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const sheet_id = import.meta.env.VITE_APP_SHEET_ID;
  const api_key = import.meta.env.VITE_APP_API_KEY;

  useEffect(() => {
    if (studentId) {
      const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values/Sheet1?key=${api_key}`;

      fetch(sheetUrl)
        .then((response) => response.json())
        .then((data) => {
          if (!data.values || data.values.length < 2) {
            console.error("Invalid or empty data received.");
            setStudentData(null);
            return;
          }

          const headers = data.values[0].map((header) =>
            header.trim().toLowerCase()
          );
          console.log("Headers:", headers);

          const idIndex = headers.indexOf("id");
          if (idIndex === -1) {
            console.error("ID column not found.");
            setStudentData(null);
            return;
          }

          const studentRow = data.values.find(
            (row) => row[idIndex] === studentId
          );
          if (studentRow) {
            const studentObject = headers.reduce((obj, header, index) => {
              let value = studentRow[index] || "N/A";

              // Trim the duration value to extract content inside [ ]
              if (header === "duration") {
                const match = value.match(/\[(.*?)]?$/); // Capture content after `[`
                value = match ? match[1].trim() : value; // Remove `]` if present
              }
              obj[header] = value;
              return obj;
            }, {});
            setStudentData(studentObject);
          } else {
            setStudentData(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setStudentData(null);
        })
        .finally(() => setLoading(false));
    }
  }, [studentId]);

  if (loading)
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p className="loading-text">Fetching Certificate details...</p>
      </div>
    );

  if (!studentData)
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p className="loading-text">
          Certificate details <span style={{ color: "red" }}> Not Found</span>
        </p>
      </div>
    );

  // Icons mapping for normalized field names
  const fieldIcons = {
    id: <Numbers fontSize="small" />,
    name: <AccountCircle fontSize="small" />,
    email: <Email fontSize="small" />,
    mobile: <Phone fontSize="small" />,
    university: <School fontSize="small" />,
    interestdomain: <MenuBook fontSize="small" />,
    course: <MenuBook fontSize="small" />,
    mentor: <Badge fontSize="small" />,
    duration: <CalendarToday fontSize="small" />,
    department: <Apartment fontSize="small" />,
    domain: <Code fontSize="small" />,
  };

  // Order the fields, ensuring "ID" appears first
  const fieldOrder = ["id", "name", "course", "duration", "mentor"];

  return (
    <>
      <div className="student-container">
        <div className="student-card">
          {/* Company Logo */}
          <div className="logo_write">
            <img src={"logo.jpg"} alt="Company Logo" className="company-logo" />
            <span>Ava</span>
            <span>Intern</span>
          </div>

          <h2>🎓 Student Details</h2>
          <table className="student-table">
            <tbody>
              {fieldOrder
                .filter((key) => studentData[key])
                .map((key) => (
                  <tr key={key}>
                    <td className="table-label">
                      {fieldIcons[key]} {key}
                    </td>
                    <td className="table-value">{studentData[key]}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* Social Media Links */}
        </div>
      </div>
      <div style={{ flexGrow: 1 }}></div>

      <div className="social-media">
        <a
          href="https://www.avaintern.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="logo.jpg" alt="Logo" />
          {/* <Facebook fontSize="large" className="social-icon facebook" /> */}
        </a>

        <a
          href="https://www.linkedin.com/company/ava-intern"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedIn fontSize="large" className="social-icon linkedin" />
        </a>
        <a
          href="https://www.youtube.com/@AvaInternEdutechPvt.Ltd."
          target="_blank"
          rel="noopener noreferrer"
        >
          <YouTube fontSize="large" className="social-icon twitter" />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram fontSize="large" className="social-icon instagram" />
        </a>
      </div>
    </>
  );
};

export default StudentDetails;

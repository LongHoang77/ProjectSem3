import React, { useEffect, useState } from "react";
import axios from "axios";

const SeatMap = () => {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:5000/Seat/getseats") // Gọi API
      .then((response) => {
        setSeats(response.data); // Lưu dữ liệu vào state
      })
      .catch((error) => console.error("Error fetching seats:", error));
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 40px)", gap: "5px" }}>
      {seats.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.split(",").map((seat, seatIndex) => (
            <div
              key={seatIndex}
              style={{
                width: "40px",
                height: "40px",
                textAlign: "center",
                lineHeight: "40px",
                border: "1px solid black",
                backgroundColor: seat === "X" ? "red" : "lightgray",
              }}
            >
              {seat}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SeatMap;

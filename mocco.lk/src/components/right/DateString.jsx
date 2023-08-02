import React from "react";

function DateString() {
  const currentDate = new Date();

  // Format options for month and day names
  const monthOptions = { month: "long" };
  const dayOptions = { weekday: "long" };

  // Extracting month, day, and year
  const monthName = currentDate.toLocaleString("en-US", monthOptions);
  const dayName = currentDate.toLocaleString("en-US", dayOptions);
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  return (
    <div>
      <h4>
        {dayName} {day} {monthName}, {year}
      </h4>
    </div>
  );
}

export default DateString;

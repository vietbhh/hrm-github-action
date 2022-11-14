// ** React Imports
import { Fragment, useState } from "react";
import { formatHour } from "@modules/Attendances/common/common";
// ** Styles
import { Input } from "antd";
// ** Components

const ListAttendanceLog = (props) => {
  const {
    // * props
    attendanceLog
    // ** methods
  } = props;

  const [page, setPage] = useState(1);

  // ** render
  return (
    <div className="list-attendance-log">
      {attendanceLog.map((log, index, elements) => {
        if (index % 2 === 0) {
          const nextLog = elements[index + 1];
          return (
            <div
              className="row-attendance-log"
              key={`attendance-list-log-${log.id}`}
            >
              <div className="expand-cell" style={{ width: "180px" }}>
                <Input disabled defaultValue={formatHour(log.clock)} />
              </div>
              <div className="expand-cell" style={{ width: "150px" }}>
                <span>-</span>
              </div>
              <div className="expand-cell" style={{ width: "180px" }}>
                <Input disabled defaultValue={formatHour(nextLog?.clock)} />
              </div>
              <div className="expand-cell" style={{ width: "150px" }}>
                <span>-</span>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default ListAttendanceLog;

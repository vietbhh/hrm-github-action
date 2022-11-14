// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common";
import { useState, useEffect } from "react";
import moment from "moment";
// ** Styles
// ** Components

const BreakTimeAttendance = (props) => {
  const {
    // ** props
    loadingApi,
    attendanceToDay,
    isBreakTime,
    // ** methods
    setIsBreakTime
  } = props;

  const [time, setTime] = useState(new Date());
  const [intervalState, setIntervalState] = useState(null);

  const workScheduleToday = attendanceToDay?.work_schedule;
  const breakTimeFrom = moment(workScheduleToday?.br_time_from, "hh:mm:ss");
  const breakTimeTo = moment(workScheduleToday?.br_time_to, "hh:mm:ss");

  const handleIncreaseTime = () => {
    const intervalTemp = setInterval(() => {
      setTime(new Date());
    }, 1000);
    setIntervalState(intervalTemp);
  };

  // ** effect
  useEffect(() => {
    if (workScheduleToday?.break_time === true) {
      handleIncreaseTime();
      return () => clearInterval(intervalState);
    }
  }, [workScheduleToday?.break_time]);

  useEffect(() => {
    const currentTime = moment(time, "hh:mm:ss");
    if (
      workScheduleToday?.break_time === true &&
      currentTime.diff(breakTimeTo, "seconds") <= 0
    ) {
      if (currentTime.isBetween(breakTimeFrom, breakTimeTo)) {
        setIsBreakTime(true);
      } else if (currentTime.diff(breakTimeTo, "seconds") > 0) {
        clearInterval(intervalState);
      } else {
        setIsBreakTime(false);
      }
    }
  }, [time]);

  // ** render
  const renderTime = () => {
    if (loadingApi === false && workScheduleToday?.break_time === true) {
      return (
        <span>
          {workScheduleToday.br_time_from} - {workScheduleToday.br_time_to}
        </span>
      );
    } else {
      return (
        <span>
          --:-- - --:--
        </span>
      );
    }
  };

  return (
    <div
      className={`break-time-info ${isBreakTime ? "break-time-access" : ""}`}
    >
      <i className="fal fa-mug-hot icon"></i>
      <span className="label">
        {useFormatMessage("modules.attendance.text.break")}
      </span>
      {renderTime()}
    </div>
  );
};

export default BreakTimeAttendance;

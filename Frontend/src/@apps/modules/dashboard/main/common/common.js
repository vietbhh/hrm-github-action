import { useFormatMessage } from "@apps/utility/common";

const convertDateGetDay = (date) => {
  if (date === "" || date === undefined || date === "0000-00-00") return "";
  const d = date.split("-");
  return `${d[2]}`;
};

const convertDateGetMonth = (date) => {
  if (date === "" || date === undefined || date === "0000-00-00") return "";
  const d = date.split("-");
  return `${useFormatMessage("month." + d[1] * 1)}`;
};

const convertTime = (time) => {
  if (time === "" || time === undefined) return "";
  const d = time.split(":");
  return `${d[0]}:${d[1]}`;
};

export { convertDateGetDay, convertDateGetMonth, convertTime };
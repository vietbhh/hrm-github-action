import { forEach } from "lodash";

const getOptionValue = (options, optionName, nameOptionKey) => {
  const option = options[optionName];
  let valueOption = 0;
  forEach(option, (item, key) => {
    if (item.name_option === nameOptionKey) {
      valueOption = item.value;
      return false;
    }
  });
  return parseInt(valueOption);
};

const getOptionLabel = (options, optionName, nameOptionValue) => {
  const option = options[optionName];
  let valueOption = 0;
  forEach(option, (item, key) => {
    if (item.value === nameOptionValue) {
      valueOption = item.label;
      return false;
    }
  });
  return valueOption;
};

const getDaysInMonth = (month, year) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date).getDate());
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const getListMonth = () => {
  return [
    { value: 1, label: "month.1" },
    { value: 2, label: "month.2" },
    { value: 3, label: "month.3" },
    { value: 4, label: "month.4" },
    { value: 5, label: "month.5" },
    { value: 6, label: "month.6" },
    { value: 7, label: "month.7" },
    { value: 8, label: "month.8" },
    { value: 9, label: "month.9" },
    { value: 10, label: "month.10" },
    { value: 11, label: "month.11" },
    { value: 12, label: "month.12" }
  ];
};

const formatViewListText = (label, value, replaceValue) => {
  if (!value) {
    return label;
  }
  return (
    <span>
      {label.split(value).reduce((prev, current, i) => {
        if (!i) {
          return [current];
        }
        return prev.concat(replaceValue, current);
      }, [])}
    </span>
  );
};

export { getOptionValue, getDaysInMonth, getListMonth, formatViewListText, getOptionLabel };

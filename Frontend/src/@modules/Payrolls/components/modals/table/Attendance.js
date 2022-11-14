import { useFormatMessage } from "@apps/utility/common";
import { convertDate, minsToStr } from "@modules/Payrolls/common/common";
import { Table } from "antd";
import { map } from "lodash";
import { Fragment } from "react";

const Attendance = (props) => {
  const { data } = props;

  const drawTable = () => {
    const columns = [
      {
        title: useFormatMessage("modules.payrolls.fields.period"),
        dataIndex: "1",
        key: "1",
        render: (text) => {
          return (
            <>{`${text[0] && convertDate(text[0])} - ${
              text[1] && convertDate(text[1])
            }`}</>
          );
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.actual_work_hours"),
        dataIndex: "2",
        key: "2",
        render: (text) => {
          return <>{minsToStr(text)}</>;
        }
      }
    ];

    const data_table = [
      ...map(data, (value, key) => {
        return {
          key: key,
          1: [value.date_from, value.date_to],
          2: value.attendance
        };
      })
    ];

    return (
      <Table
        className="collapse-body"
        loading={false}
        columns={columns}
        dataSource={data_table}
        pagination={false}
      />
    );
  };

  return <Fragment>{drawTable()}</Fragment>;
};

export default Attendance;

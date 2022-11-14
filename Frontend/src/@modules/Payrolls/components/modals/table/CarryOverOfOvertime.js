import { useFormatMessage } from "@apps/utility/common";
import { minsToStr } from "@modules/Payrolls/common/common";
import { Table } from "antd";
import { map } from "lodash";
import { Fragment } from "react";

const CarryOverOfOvertime = (props) => {
  const { data } = props;

  const drawTable = () => {
    const columns = [
      {
        title: useFormatMessage(
          "modules.payrolls.fields.carry_over_of_overtime"
        ),
        dataIndex: "1",
        key: "1",
        render: (text) => {
          return <>{text && minsToStr(text)}</>;
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.type"),
        dataIndex: "2",
        key: "2",
        render: (text) => {
          return <>{text}</>;
        }
      }
    ];

    const data_table = [
      ...map(data, (value, key) => {
        return {
          key: key,
          1: value.overtime,
          2: value.type
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

export default CarryOverOfOvertime;

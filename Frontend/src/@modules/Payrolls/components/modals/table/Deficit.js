import { useFormatMessage } from "@apps/utility/common";
import {
  convertNumberCurrency,
  minsToStrCeil
} from "@modules/Payrolls/common/common";
import { Table } from "antd";
import { map } from "lodash";
import { Fragment } from "react";

const Deficit = (props) => {
  const { data } = props;

  const drawTable = () => {
    const columns = [
      {
        title: useFormatMessage("modules.payrolls.fields.deficit"),
        dataIndex: "1",
        key: "1",
        render: (text) => {
          return <>-{minsToStrCeil(text)}</>;
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.amount"),
        dataIndex: "2",
        key: "2",
        render: (text) => {
          return <>{convertNumberCurrency(text, true)}</>;
        }
      }
    ];

    const data_table = [
      ...map(data, (value, key) => {
        return {
          key: key,
          1: value.deficit,
          2: value.amount
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

export default Deficit;

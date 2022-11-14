import { useFormatMessage } from "@apps/utility/common";
import { convertDate } from "@modules/Payrolls/common/common";
import { Table } from "antd";
import { map } from "lodash";
import { Fragment } from "react";

const Dependents = (props) => {
  const { data } = props;

  const drawTable = () => {
    const columns = [
      {
        title: useFormatMessage("modules.payrolls.fields.name"),
        dataIndex: "1",
        key: "1",
        render: (text) => {
          return <>{text}</>;
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.relationship"),
        dataIndex: "2",
        key: "2",
        render: (text) => {
          return <>{text && useFormatMessage(text.label)}</>;
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.phone"),
        dataIndex: "3",
        key: "3",
        render: (text) => {
          return <>{text}</>;
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.dob"),
        dataIndex: "4",
        key: "4",
        render: (text) => {
          return <>{text && convertDate(text)}</>;
        }
      }
    ];

    const data_table = [
      ...map(data, (value, key) => {
        return {
          key: key,
          1: value.fullname,
          2: value.relationship,
          3: value.phone,
          4: value.dob
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

export default Dependents;

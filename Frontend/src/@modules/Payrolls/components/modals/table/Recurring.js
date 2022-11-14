import { useFormatMessage } from "@apps/utility/common";
import { convertNumberCurrency } from "@modules/Payrolls/common/common";
import { Table } from "antd";
import { map } from "lodash";
import { Fragment } from "react";

const Recurring = (props) => {
  const { data, total_amount } = props;

  const drawTable = () => {
    const columns = [
      {
        title: useFormatMessage("modules.payrolls.fields.recurring"),
        dataIndex: "1",
        key: "1",
        render: (text) => {
          return <>{text}</>;
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.description"),
        dataIndex: "2",
        key: "2",
        render: (text) => {
          return <>{text}</>;
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.amount"),
        dataIndex: "3",
        key: "3",
        render: (text) => {
          return <>{convertNumberCurrency(text)}</>;
        }
      }
    ];

    const data_table = [
      ...map(data, (value, key) => {
        return {
          key: key,
          1: value.recurring,
          2: value.description,
          3: value.amount
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
        summary={(pageData) => {
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  {useFormatMessage("modules.payrolls.modal.total")}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  {convertNumberCurrency(total_amount)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    );
  };

  return <Fragment>{drawTable()}</Fragment>;
};

export default Recurring;

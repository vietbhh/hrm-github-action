// ** React Imports
import { useFormatMessage } from "@apps/utility/common";
// ** Styles
import { Collapse, Table, Tooltip } from "antd";
// ** Components

const { Panel } = Collapse;

const BoxReadyToCreate = (props) => {
  const {
    // ** props
    fileUploadContent,
    recordReadyToCreate,
    // ** methods
    renderCollapseHeader
  } = props;

  const number = recordReadyToCreate.length;
  const collapseHeader = renderCollapseHeader(
    number,
    "ready_to_create",
    false,
    "green"
  );

  // ** return
  const renderIcon = (record) => {
    if (record?.duplicate === true) {
      return record?.chosen === true ? (
        <Tooltip
          title={useFormatMessage(
            "modules.time_off_import.text.preview_and_import.chosen"
          )}
        >
          <i className="far fa-check-circle chosen-icon" />
        </Tooltip>
      ) : (
        <Tooltip
          title={useFormatMessage(
            "modules.time_off_import.text.preview_and_import.duplicate"
          )}
        >
          <i className="fal fa-copy duplicate-icon" />
        </Tooltip>
      );
    }
    return "";
  };

  const renderContent = () => {
    if (number > 0) {
      const columns = fileUploadContent.header.map((item, index) => {
        if (index === 0) {
          return {
            title: item,
            dataIndex: item,
            key: item,
            render: (text, record) => {
              return (
                <span>
                  {renderIcon(record)} {text}
                </span>
              );
            }
          };
        }
        return {
          title: item,
          dataIndex: item,
          key: item
        };
      });

      const dataSource = recordReadyToCreate.map((item, index) => {
        return {
          key: index,
          ...item
        };
      });

      return (
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      );
    }

    return "";
  };

  return (
    <Collapse defaultActiveKey={["1"]}>
      <Panel header={collapseHeader} key="1">
        <div className="info-ready-to-create">{renderContent()}</div>
      </Panel>
    </Collapse>
  );
};

export default BoxReadyToCreate;

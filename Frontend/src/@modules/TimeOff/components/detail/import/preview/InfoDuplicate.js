// ** React Imports
import { useFormatMessage } from "@apps/utility/common";
// ** Styles
import { Table, Collapse } from "antd";
import { Col, Row } from "reactstrap";
// ** Components
import { ErpRadio } from "@apps/components/common/ErpField";

const { Panel } = Collapse;

const InfoDuplicate = (props) => {
  const {
    // ** props
    fileUploadContent,
    duplicateItem,
    duplicateIndex,
    recordReadyToCreate,
    methods,
    // ** methods
    setRecordContent
  } = props;

  const handleChosenRecordDuplicate = (key) => {
    const newRecordReadyToCreate = recordReadyToCreate.map((item) => {
      if (item?.key_duplicate === duplicateIndex) {
        let chosen = false;
        if (item.key === key) {
          chosen = true;
        }
        return {
          ...item,
          chosen: chosen
        };
      }

      return {
        ...item
      };
    });
    setRecordContent({ recordReadyToCreate: newRecordReadyToCreate });
  };

  // ** render
  const renderHeader = () => {
    return (
      <span>
        {useFormatMessage(
          "modules.time_off_import.text.preview_and_import.duplicate_data_for"
        )}{" "}
        <b>
          {fileUploadContent.header[0]}: {duplicateItem.email}
        </b>{" "}
        -{" "}
        <b>
          {" "}
          {fileUploadContent.header[1]}: {duplicateItem.type}
        </b>
      </span>
    );
  };

  const renderTableContent = () => {
    const columns = [
      {
        title: "",
        dataIndex: "radio",
        key: "radio",
        width: 50,
        render: (cellProps, record) => {
          return (
            <ErpRadio
              id={`rdo-duplicate-item-${record.key}`}
              name={`rdo-duplicate-item-${duplicateIndex}`}
              useForm={methods}
              required={true}
              onChange={() => handleChosenRecordDuplicate(record.key)}
            />
          );
        }
      },
      {
        title: useFormatMessage(
          "modules.time_off_import.text.preview_and_import.row"
        ),
        dataIndex: "row",
        key: "row"
      }
    ];

    fileUploadContent.header.map((item, index) => {
      if (index > 1) {
        columns.push({
          title: item,
          dataIndex: item,
          key: item
        });
      }
    });

    const dataSource = duplicateItem.duplicate_data;

    return (
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    );
  };

  return (
    <Row className="mb-1">
      <Col sm={6}>
        <div className="info-duplicate ms-2">
          <Collapse defaultActiveKey={['1']}>
            <Panel header={renderHeader()} key="1">
              <div className="body-info-duplicate">{renderTableContent()}</div>
            </Panel>
          </Collapse>
        </div>
      </Col>
    </Row>
  );
};

export default InfoDuplicate;

// ** React Imports
import { useFormatMessage } from "@apps/utility/common";
// ** Styles
import { Collapse } from "antd";
import { Alert } from "reactstrap";
// ** Components
import InfoDuplicate from "./InfoDuplicate";

const { Panel } = Collapse;

const BoxDuplicate = (props) => {
  const {
    // ** props
    fileUploadContent,
    recordDuplicate,
    recordReadyToCreate,
    methods,
    // ** methods
    renderCollapseHeader,
    setRecordContent
  } = props;

  const number = recordDuplicate.length;
  const collapseHeader = renderCollapseHeader(
    number,
    "duplicated",
    true,
    "orange"
  );

  // ** render
  const renderInfoDuplicate = () => {
    return (
      <div>
        {recordDuplicate.map((item, index) => {
          return (
            <div key={`duplicate-info-${index}`}>
              <InfoDuplicate
                fileUploadContent={fileUploadContent}
                duplicateItem={item}
                duplicateIndex={index}
                recordReadyToCreate={recordReadyToCreate}
                methods={methods}
                setRecordContent={setRecordContent}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderAlert = () => {
    return (
      <Alert color="warning" className="ms-2 mr-2 pl-50 pr-50 pb-50 pt-50">
        {useFormatMessage(
          "modules.employees.import.preview.warning_duplicated"
        )}
      </Alert>
    );
  };

  return (
    <Collapse defaultActiveKey={["1"]}>
      <Panel header={collapseHeader} key="1">
        <div>{renderInfoDuplicate()}</div>
        <div>{number > 0 && renderAlert()}</div>
      </Panel>
    </Collapse>
  );
};

export default BoxDuplicate;

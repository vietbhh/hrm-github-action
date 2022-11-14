// ** React Imports
// ** Styles
import { Collapse } from "antd";
// ** Components
import InfoRecordSkip from "./InfoRecordSkip";

const { Panel } = Collapse;

const BoxRecordSkip = (props) => {
  const {
    // ** props
    recordSkip,
    // ** methods
    renderCollapseHeader
  } = props;

  const number = Object.keys(recordSkip).length;
  const collapseHeader = renderCollapseHeader(number, "skipped", true, "red");

  // ** render
  return (
    <Collapse defaultActiveKey={["1"]}>
      <Panel header={collapseHeader} key="1">
        <InfoRecordSkip recordSkip={recordSkip} />
      </Panel>
    </Collapse>
  );
};

export default BoxRecordSkip;

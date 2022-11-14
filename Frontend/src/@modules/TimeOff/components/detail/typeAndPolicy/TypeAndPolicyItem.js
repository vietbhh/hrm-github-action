// ** React Imports
import { useFormatMessage } from "@apps/utility/common";
import { defaultModuleApi } from "@apps/utility/moduleApi";
import {  useState } from "react";
// ** Styles
import {
  Card,
  CardBody,
  Button,
  CardHeader
} from "reactstrap";
import {Tag } from "antd";
// ** Components
import TypeAction from "./TypeAction";
import TablePolicy from "./TablePolicy";
import { ErpSwitch } from "@apps/components/common/ErpField";

const TypeAndPolicyItem = (props) => {
  const {
    // ** props
    infoType,
    listPolicy,
    metas,
    moduleName,
    // ** methods
    loadData,
    setAddType,
    setIsEditType,
    setTypeData,
    setIsEditPolicy,
    setPolicyData,
    setIsEditEligibility
  } = props;

  const [activeType, setActiveType] = useState(infoType.active);

  // ** render
  const renderPaidTag = (paidStatus) => {
    if (paidStatus) {
      return (
        <Tag className="paid-tag" color="green">
          {useFormatMessage("modules.time_off_types.app_options.paid.paid")}
        </Tag>
      );
    }
    return (
      <Tag className="paid-tag" color="red">
        {useFormatMessage("modules.time_off_types.app_options.paid.unpaid")}
      </Tag>
    );
  };

  const renderSystemTag = (systemStatus) => {
    if (systemStatus) {
      return (
        <Tag>
          {useFormatMessage("modules.time_off_types.app_options.system_type")}
        </Tag>
      );
    }
  };

  const renderActiveSwitch = () => {
    return (
      <ErpSwitch
        id={`active_type_${infoType.id}`}
        defaultChecked={infoType.active}
        readOnly={false}
        onChange={(e) => {
          defaultModuleApi
            .postSave(
              moduleName,
              {
                id: infoType.id,
                active: e.target.checked
              },
              true
            )
            .then((res) => {
              setActiveType(e.target.checked);
            });
        }}
      />
    );
  };

  return (
    <Card className="type-and-policy-item mt-1">
      <CardHeader>
        <div className="item-header">
          <div className="item-header-left">
            <Button.Ripple className="btn-sm btn-icon me-25" color="primary">
              <i className="far fa-plane-alt"></i>
            </Button.Ripple>
            <span> {infoType.name}</span>
            {renderPaidTag(infoType.paid)}
            {renderSystemTag(infoType.is_system)}
          </div>
          <div className="item-header-right">
            <div className="item-switch">{renderActiveSwitch()}</div>
            <div className="ms-2">
              <TypeAction
                data={infoType}
                activeType={activeType}
                setAddType={setAddType}
                setIsEditType={setIsEditType}
                setTypeData={setTypeData}
                loadData={loadData}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="mt-25">
          <TablePolicy
            listPolicy={listPolicy}
            activeType={activeType}
            setAddType={setAddType}
            setIsEditPolicy={setIsEditPolicy}
            setPolicyData={setPolicyData}
            setIsEditEligibility={setIsEditEligibility}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default TypeAndPolicyItem;

// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common";
import { Fragment, useEffect, useState } from "react";
import { SettingTimeOffApi } from "@modules/TimeOff/common/api";
import notification from "@apps/utility/notification";
// ** Styles
import { Button } from "reactstrap";
import { Space } from "antd";
import { Plus } from "react-feather";
// ** Components
import TypeAndPolicyItem from "./TypeAndPolicyItem";
import AppSpinner from "@apps/components/spinner/AppSpinner";
import { EmptyContent } from "@apps/components/common/EmptyContent";

const TypeAndPolicyContent = (props) => {
  const {
    // ** props
    metas,
    moduleName,
    // ** methods
    setAddType,
    setIsEditType,
    setTypeData,
    setIsEditPolicy,
    setPolicyData,
    setIsEditEligibility
  } = props;

  const [state, setState] = useMergedState({
    loading: false,
    listType: [],
    listPolicy: []
  });

  const [filters, setFilters] = useState({
    status: 0,
    typeName: ""
  });

  const handleAdd = (type) => {
    setIsEditType(false);
    setAddType(type);
  };

  const loadData = () => {
    setState({
      loading: true
    });
    SettingTimeOffApi.getTypeAndPolicy(filters)
      .then((res) => {
        setState({
          loading: false,
          listType: res.data.list_type,
          listPolicy: res.data.list_policy
        });
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.error")
        });
      });
  };

  // ** render
  const renderFilter = () => {
    return <div></div>;
  };

  const renderTypeAndPolicy = () => {
    if (state.listType.length > 0) {
      return state.listType.map((item) => {
        const policyOfType = state.listPolicy.filter((policy) => {
          return policy.type.value === item.id;
        });
        return (
          <div key={`item_${item.id}`}>
            <TypeAndPolicyItem
              infoType={item}
              listPolicy={policyOfType}
              metas={metas}
              moduleName={moduleName}
              loadData={loadData}
              setAddType={setAddType}
              setIsEditType={setIsEditType}
              setTypeData={setTypeData}
              setIsEditPolicy={setIsEditPolicy}
              setPolicyData={setPolicyData}
              setIsEditEligibility={setIsEditEligibility}
            />
          </div>
        );
      });
    } else {
      return (
        <EmptyContent />
      );
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  return (
    <Fragment>
      <div className="time-off-setting-header">
        <h4>{useFormatMessage("modules.time_off.title.type_and_policy")}</h4>
        <div>
          <Space>
            <Button.Ripple color="primary" onClick={() => handleAdd("type")}>
              <Plus size={14} />{" "}
              {useFormatMessage("modules.time_off.buttons.add_type")}
            </Button.Ripple>
          </Space>
        </div>
      </div>
      <div>{renderFilter()}</div>
      <div className="mt-4">
        {!state.loading ? renderTypeAndPolicy() : <AppSpinner />}
      </div>
    </Fragment>
  );
};

export default TypeAndPolicyContent;

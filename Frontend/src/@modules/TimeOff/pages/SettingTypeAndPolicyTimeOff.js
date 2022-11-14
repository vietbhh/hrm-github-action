// ** React Imports
import { useSelector } from "react-redux";
import { useFormatMessage, useMergedState } from "@apps/utility/common";
// ** Styles
// ** Components
import SettingsLayoutTimeOff from "./SettingsLayoutTimeOff";
import AddTypeTimeOff from "../components/detail/typeAndPolicy/AddTypeTimeOff";
import AddPolicyTimeOff from "../components/detail/typeAndPolicy/AddPolicyTimeOff";
import TypeAndPolicyContent from "../components/detail/typeAndPolicy/TypeAndPolicyContent";
import AddEligibility from "../components/detail/eligibility/AddEligibility";

const SettingTypeAndPolicyTimeOff = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    addType: "",
    isEditType: false,
    isEditPolicy: false,
    isEditEligibility: false,
    typeData: {},
    policyData: {},
    loading: true,
    perPage: 15,
    recordsTotal: 0,
    currentPage: 1,
    searchVal: "",
    orderCol: "id",
    orderType: "desc"
  });

  const moduleData = useSelector((state) => state.app.modules.time_off_types);
  const module = moduleData.config;
  const moduleName = module.name;
  const metas = moduleData.metas;
  const options = moduleData.options;
  const optionsModules = useSelector((state) => state.app.optionsModules);

  const modulePolicyData = useSelector(
    (state) => state.app.modules.time_off_policies
  );
  const modulePolicy = modulePolicyData.config;
  const moduleNamePolicy = modulePolicy.name;
  const metasPolicy = modulePolicyData.metas;
  const optionsPolicy = modulePolicyData.options;

  const setAddType = (type) => {
    setState({
      addType: type
    });
  };

  const setIsEditType = (status) => {
    setState({
      isEditType: status
    });
  };

  const setIsEditPolicy = (status) => {
    setState({
      isEditPolicy: status
    });
  };

  const setIsEditEligibility = (status) => {
    setState({
      isEditEligibility: status
    });
  };

  const setTypeData = (data) => {
    setState({
      typeData: data
    });
  };

  const setPolicyData = (data) => {
    setState({
      policyData: data
    });
  };

  // ** render
  const renderContent = () => {
    if (state.addType === "type") {
      return (
        <AddTypeTimeOff
          moduleName={moduleName}
          metas={metas}
          options={options}
          moduleNamePolicy={moduleNamePolicy}
          metasPolicy={metasPolicy}
          optionsPolicy={optionsPolicy}
          optionsModules={optionsModules}
          isEditType={state.isEditType}
          typeData={state.typeData}
          setAddType={setAddType}
        />
      );
    } else if (state.addType === "policy") {
      return (
        <AddPolicyTimeOff
          moduleName={moduleName}
          metas={metas}
          options={options}
          moduleNamePolicy={moduleNamePolicy}
          metasPolicy={metasPolicy}
          optionsPolicy={optionsPolicy}
          optionsModules={optionsModules}
          isEditPolicy={state.isEditPolicy}
          policyData={state.policyData}
          setAddType={setAddType}
        />
      );
    } else if (state.addType === "eligibility_policy") {
      return (
        <AddEligibility
          moduleName={moduleNamePolicy}
          metas={metasPolicy}
          options={optionsPolicy}
          optionsModules={optionsModules}
          policyData={state.policyData}
          isEditEligibility={state.isEditEligibility}
          setAddType={setAddType}
        />
      );
    } else {
      return (
        <TypeAndPolicyContent
          metas={metas}
          moduleName={moduleName}
          setAddType={setAddType}
          setIsEditType={setIsEditType}
          setTypeData={setTypeData}
          setIsEditPolicy={setIsEditPolicy}
          setPolicyData={setPolicyData}
          setIsEditEligibility={setIsEditEligibility}
        />
      );
    }
  };

  return (
    <SettingsLayoutTimeOff setAddType={setAddType}>
      {renderContent()}
    </SettingsLayoutTimeOff>
  );
};

export default SettingTypeAndPolicyTimeOff;

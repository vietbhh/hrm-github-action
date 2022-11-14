// ** React Imports
import AppSpinner from "@apps/components/spinner/AppSpinner";
import { FieldHandle } from "@apps/utility/FieldHandler";
import { useSelector } from "react-redux";
import { useFormatMessage, useMergedState } from "@apps/utility/common";
import { Fragment, useEffect, useState } from "react";
import { SettingTimeOffApi } from "../common/api";
// ** Styles
import {
  Col,
  Row,
  Button
} from "reactstrap";
import {  Plus } from "react-feather";
// ** Components
import GuildPolicy from "../components/detail/typeAndPolicy/GuildPolicy";
import SettingsLayoutTimeOff from "./SettingsLayoutTimeOff";
import HolidayList from "../components/detail/holiday/HolidayList";
import AddHolidayModal from "../components/modals/AddHolidayModal";
import { ErpSelect } from "@apps/components/common/ErpField";
import { EmptyContent } from "@apps/components/common/EmptyContent";
import AddMoreButton from "../components/detail/holiday/AddMoreButton";
import AddHolidayFromCountryModal from "../components/modals/AddHolidayFromCountryModal";

const SettingHolidays = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    addModal: false,
    holidayData: {},
    isEditModal: false,
    addFromCountryModal: false,
    loading: true,
    perPage: 15,
    recordsTotal: 0,
    currentPage: 1,
    searchVal: "",
    orderCol: "id",
    orderType: "desc"
  });

  const moduleData = useSelector((state) => state.app.modules.time_off_holidays);
  const module = moduleData.config;
  const moduleName = module.name;
  const metas = moduleData.metas;
  const options = moduleData.options;
  const optionsModules = useSelector((state) => state.app.optionsModules);

  const currentYear = parseInt(new Date().getFullYear());
  const YearOption = [
    { value: currentYear - 1, label: currentYear - 1 },
    { value: currentYear, label: currentYear },
    { value: currentYear + 1, label: currentYear + 1 }
  ];
  const [defaultOffice] = optionsModules.offices.name;

  const [filters, setFilters] = useState({
    office_id: defaultOffice.value,
    year: currentYear
  });

  const toggleModal = () => {
    setState({
      addModal: !state.addModal
    });
  };

  const setHolidayData = (data) => {
    setState({
      holidayData: data
    });
  };

  const setIsEditModal = (status) => {
    setState({
      isEditModal: status
    });
  };

  const toggleAddFromCountryModal = () => {
    setState({
      addFromCountryModal: !state.addFromCountryModal
    });
  };

  const loadData = () => {
    setState({
      loading: true
    });
    SettingTimeOffApi.getHoliday(filters)
      .then((res) => {
        setState({
          data: res.data.results,
          loading: false
        });
      })
      .catch((err) => {
        setState({
          loading: false
        });
      });
  };

  const handleAddHoliday = () => {
    setIsEditModal(false);
    toggleModal();
  };

  const setOfficeIdFilter = (el) => {
    setFilters({
      ...filters,
      office_id: el.value
    });
  }

  const setYearFilter = (el) => {
    setFilters({
      ...filters,
      year: el.value
    });
  }

  // ** effect
  useEffect(() => {
    loadData();
  }, [filters]);

  // ** render
  const renderFilter = () => {
    return (
      <Fragment>
        <Row className="mt-0">
          <Col sm={4} className="mb-25">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.office_id
              }}
              nolabel
              optionsModules={optionsModules}
              isClearable={false}
              defaultValue={defaultOffice}
              onChange={(el) => setOfficeIdFilter(el)}
            />
          </Col>
          <Col sm={4} className="mb-25">
            <ErpSelect
              options={YearOption}
              name="year"
              nolabel={true}
              isClearable={false}
              label={useFormatMessage("modules.time_off_holidays.fields.year")}
              defaultValue={{ value: currentYear, label: currentYear }}
              onChange={(el) => setYearFilter(el)}
            />
          </Col>
        </Row>
      </Fragment>
    );
  };

  const renderAddMoreButton = () => {
    return (
      <AddMoreButton
        toggleModal={toggleModal}
        toggleAddFromCountryModal={toggleAddFromCountryModal}
      />
    );
  };

  const renderHolidays = () => {
    if (state.data.length > 0) {
      return (
        <HolidayList
          data={state.data}
          loadData={loadData}
          setHolidayData={setHolidayData}
          toggleModal={toggleModal}
          setIsEditModal={setIsEditModal}
        />
      );
    } else {
      return (
        <Fragment>
          <EmptyContent />
          {renderAddMoreButton()}
        </Fragment>
      );
    }
  };

  const renderModal = () => {
    return (
      <AddHolidayModal
        modal={state.addModal}
        moduleName={moduleName}
        metas={metas}
        isEditModal={state.isEditModal}
        filters={filters}
        holidayData={state.holidayData}
        handleModal={toggleModal}
        loadData={loadData}
      />
    );
  };

  const renderAddButton = () => {
    return (
      <div>
        <Button.Ripple color="primary" onClick={() => handleAddHoliday()}>
          <Plus size={14} />{" "}
          {useFormatMessage("modules.time_off.buttons.add_holidays")}
        </Button.Ripple>
      </div>
    );
  };

  const renderAddFromCountryModal = () => {
    return (
      <AddHolidayFromCountryModal
        modal={state.addFromCountryModal}
        filters={filters}
        handleModal={toggleAddFromCountryModal}
        loadData={loadData}
      />
    );
  };

  return (
    <SettingsLayoutTimeOff>
      <Fragment>
        <Row className="mt-2">
          <Col sm={7} className="mb-25">
            <div className="time-off-setting-header mb-2">
              <h4>{useFormatMessage("modules.time_off.title.holidays")}</h4>
              {(!state.loading && state.data.length > 0)  && renderAddButton()}
            </div>
            <div>{renderFilter()}</div>
            <div className="mt-1">{!state.loading ? renderHolidays() : <AppSpinner />}</div>
            {state.addModal && renderModal()}
            {state.addFromCountryModal && renderAddFromCountryModal()}
          </Col>
          <Col sm={5} className="mb-25">
            <GuildPolicy lang="en" />
          </Col>
        </Row>
      </Fragment>
    </SettingsLayoutTimeOff>
  );
};

export default SettingHolidays;

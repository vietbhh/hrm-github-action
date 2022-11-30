// ** React Imports
import { Fragment } from "react";
import { useFormatMessage, useMergedState } from "@apps/utility/common";
import { SettingTimeOffApi } from "@modules/TimeOff/common/api";
import notification from "@apps/utility/notification";
// ** Styles
import {
  Col,
  Row,
  Spinner,
  InputGroup,
  InputGroupText,
  Input,
  Card,
  CardBody,
  Button
} from "reactstrap";
import { Space, Popover } from "antd";
import { Edit3, Trash2 } from "react-feather";
// ** Components

const HolidayAction = (props) => {
  const {
    // ** props
    holiday,
    // ** methods
    loadData,
    setHolidayData,
    toggleModal,
    setIsEditModal
  } = props;

  const [state, setState] = useMergedState({
    showPopup: false
  });

  const handleEditHoliday = () => {
    setHolidayData(holiday);
    setIsEditModal(true);
    toggleModal();
  };

  const handleDeleteHoliday = () => {
    SettingTimeOffApi.removeHoliday(holiday.id)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.delete.success")
        });
        loadData();
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.delete.error")
        });
      });
  };

  const handleVisibleChange = (visible) => {
    setState({
      showPopup: visible
    });
  };

  const handleCancelPopup = () => {
    setState({
      showPopup: false
    });
  }

  // ** render
  const popOverDeleteContent = (
    <div>
      <h6>
        {useFormatMessage(
          "modules.time_off_holidays.text.warning_delete_holiday",
          {
            holiday_name: holiday.name
          }
        )}
      </h6>
      <Space className="mt-2">
        <Button.Ripple
          color="danger"
          size="sm"
          onClick={() => handleDeleteHoliday()}
        >
          {useFormatMessage("modules.time_off_holidays.buttons.delete_holiday")}
        </Button.Ripple>
        <Button.Ripple size="sm" onClick={() => handleCancelPopup()}>
          {useFormatMessage("modules.time_off_holidays.buttons.cancel")}
        </Button.Ripple>
      </Space>
    </div>
  );
  return (
    <Fragment>
      <Space>
        <Button.Ripple
          className="btn-icon"
          color="flat-success"
          size="sm"
          onClick={() => handleEditHoliday()}
        >
          <Edit3 size={15} />
        </Button.Ripple>
        <Popover
          placement="bottomRight"
          content={popOverDeleteContent}
          open={state.showPopup}
          trigger="click"
          onOpenChange={handleVisibleChange}
        >
          <Button.Ripple className="btn-icon" color="flat-danger" size="sm">
            <Trash2 size={15} />
          </Button.Ripple>
        </Popover>
      </Space>
    </Fragment>
  );
};

export default HolidayAction;

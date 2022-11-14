// ** React Imports
import { FormProvider, useForm } from "react-hook-form";
import { useFormatMessage, useMergedState } from "@apps/utility/common";
import { FieldHandle } from "@apps/utility/FieldHandler";
import { SettingTimeOffApi } from "@modules/TimeOff/common/api";
import notification from "@apps/utility/notification";
import { useEffect, useState } from "react";
import { ErpSelect } from "@apps/components/common/ErpField";
// ** Styles
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap";
import { Space } from "antd";
// ** Components
// ** files
import HolidayData from "../../common/holiday";

const AddHolidayFromCountryModal = (props) => {
  const {
    // ** props
    modal,
    filters,
    // ** methods
    handleModal,
    loadData
  } = props;

  const [state, setState] = useMergedState({
    loading: false
  });

  const methods = useForm({
    mode: "onSubmit"
  });
  const { handleSubmit, formState, setValue, getValues, watch } = methods;

  const onSubmit = (values) => {
    setState({
      loading: true
    });
    const dataHolidays = HolidayData[values.country.value];
    values.data = dataHolidays;
    values.office_id = filters.office_id;
    values.year = filters.year;
    values.format_date = true;
    SettingTimeOffApi.postSaveHolidayCountry(values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        });
        handleModal();
        setState({ loading: false });
        loadData();
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.save.error")
        });
        setState({ loading: false });
      });
  };

  const countryOption = [
    { value: "vi", label: "Vietnam" },
    { value: "en", label: "United Kingdom" }
  ];

  const [defaultValue] = countryOption;

  const handleCancelModal = () => {
    handleModal();
  };

  //

  // ** render
  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      className="modal-md"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      d={{ timeout: 100 }}
    >
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.time_off_holidays.title.add_from_country")}
      </ModalHeader>
      <ModalBody>
        <FormProvider {...methods}>
          <ErpSelect
            options={countryOption}
            name="country"
            nolabel={true}
            isClearable={false}
            defaultValue={defaultValue}
            useForm={methods}
          />
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Space>
            <Button
              type="submit"
              color="primary"
              disabled={formState.isSubmitting || formState.isValidating}
            >
              {(formState.isSubmitting || formState.isValidating) && (
                <Spinner size="sm" className="mr-50" />
              )}
              {useFormatMessage("modules.time_off_holidays.buttons.apply")}
            </Button>
            <Button color="flat-danger" onClick={() => handleCancelModal()}>
              {useFormatMessage("button.cancel")}
            </Button>
          </Space>
        </form>
      </ModalFooter>
    </Modal>
  );
};

export default AddHolidayFromCountryModal;

// ** React Imports
import { useFormatMessage } from "@apps/utility/common";
import { useState } from "react";
import { useForm } from "react-hook-form";
// ** Styles
import { Tag, Popover, Space } from "antd";
import { Button } from "reactstrap";
// ** Components
import { ErpSelect } from "@apps/components/common/ErpField";

const PopoverSelectSource = (props) => {
  const {
    // ** props
    sourceOption,
    listCVUpload,
    currentCVContent,
    currentCVIndex,
    // ** methods
    setCurrentCVContent,
    setState
  } = props;

  const methods = useForm();
  const { getValues } = methods;

  const [visible, setVisible] = useState(false);

  const handleOpenPopover = () => {
    setVisible(true);
  };

  const handleClosePopover = () => {
    setVisible(false);
  };

  const handleAddSource = () => {
    const sourceSelected = getValues("source");
    setCurrentCVContent({
      ...currentCVContent,
      source: sourceSelected
    });

    const newListCVUpload = listCVUpload;
    newListCVUpload[currentCVIndex] = {
      ...newListCVUpload[currentCVIndex],
      source: sourceSelected
    };
    setState({
      listCVUpload: newListCVUpload
    });
    handleClosePopover();
  };

  // ** render
  const renderSourceSelect = () => {
    return (
      <div>
        <div className="mb-2">
          <ErpSelect
            name="source"
            options={sourceOption}
            isMulti={true}
            useForm={methods}
          />
        </div>
        <div className="mb-1">
          <Space>
            <Button.Ripple
              size="sm"
              color="primary"
              onClick={() => handleAddSource()}
            >
              {useFormatMessage("app.add")}
            </Button.Ripple>
            <Button.Ripple
              size="sm"
              color="flat-danger"
              onClick={() => handleClosePopover()}
            >
              {useFormatMessage("app.cancel")}
            </Button.Ripple>
          </Space>
        </div>
      </div>
    );
  };

  return (
    <Popover
      placement="rightTop"
      title={useFormatMessage("modules.recruitments.title.add_source")}
      content={renderSourceSelect()}
      open={visible}
      overlayClassName="popover-select-source"
    >
      <Button.Ripple
        size="sm"
        color="flat-primary"
        className="ms-25"
        onClick={() => handleOpenPopover()}
      >
        <i className="far fa-plus" />
      </Button.Ripple>
    </Popover>
  );
};

export default PopoverSelectSource;

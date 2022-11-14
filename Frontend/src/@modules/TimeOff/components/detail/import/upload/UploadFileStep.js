// ** React Imports
import { useFormatMessage } from "@apps/utility/common";
import { useState } from "react";
import { timeoffApi } from "@modules/TimeOff/common/api";
import * as XLSX from "xlsx";
// ** Styles
import { Button, Card, CardBody } from "reactstrap";
import { Space } from "antd";
// ** Components
import DraggerUpload from "./DraggerUpload";
import notification from "@apps/utility/notification";

const UploadFileStep = (props) => {
  const {
    // ** props
    importType,
    fileUpload,
    // ** methods
    setCurrentStep,
    setFileUpload,
    setListFieldImport,
    setListFieldSelect,
    setFileUploadContent
  } = props;

  const [disableNextButton, setDisableNextButton] = useState(true);

  const handleBack = () => {
    setCurrentStep("");
  };

  const handleDownloadSampleFile = () => {
    timeoffApi
      .getSampleFileImport(importType)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Timeoff Balance Template.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.template.not_found")
        });
      });
  };

  const getFileContent = () => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.readAsBinaryString(fileUpload);
      reader.onload = function () {
        const fileData = reader.result;
        const wb = XLSX.read(fileData, { type: "binary" });
        wb.SheetNames.forEach(function (sheetName, index) {
          if (index === 1) {
            const header = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
              header: 1
            })[0];
            const body = XLSX.utils.sheet_to_row_object_array(
              wb.Sheets[sheetName]
            );
            resolve({
              header: header,
              body: body
            });
          }
        });
      };
    });
  };

  const handleNextStep = async () => {
    const fileContent = await getFileContent();
    const data = {
      type: importType,
      file_content: fileContent
    };
    timeoffApi
      .getFieldsImport(data)
      .then((res) => {
        setListFieldImport(res.data.arr_col);
        setListFieldSelect(res.data.arr_field_select);
        setFileUploadContent(fileContent);
        setCurrentStep("map_fields");
      })
      .catch((err) => {
        notification.showError();
        setListFieldImport([]);
        setFileUploadContent({});
      });
  };

  // ** render
  const renderDragger = () => {
    return (
      <DraggerUpload
        fileUpload={fileUpload}
        setFileUpload={setFileUpload}
        setDisableNextButton={setDisableNextButton}
      />
    );
  };

  return (
    <Card className="upload-file">
      <CardBody className="pl-3 pt-3 pb-3">
        <div className="mb-4">
          <div className="mb-2">
            <h5>
              <i className="far fa-cloud-download icon-circle bg-icon-green" />
              {useFormatMessage(
                "modules.time_off_import.title.upload_file_step.select_data"
              )}
            </h5>
          </div>
          <div>
            <p>
              {useFormatMessage(
                "modules.time_off_import.text.upload_file_step.message"
              )}
            </p>
            <Button.Ripple
              size="sm"
              color="primary"
              onClick={() => handleDownloadSampleFile()}
            >
              <i className="far fa-file-download pe-50" />
              {useFormatMessage(
                "modules.time_off_import.buttons.timeoff_balance_template"
              )}
            </Button.Ripple>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-3">
            <h5>
              <i className="far fa-file-upload icon-circle bg-icon-green" />
              {useFormatMessage(
                "modules.time_off_import.title.upload_file_step.upload"
              )}
            </h5>
          </div>
          <div>{renderDragger()}</div>
        </div>
        <div className="mb-0">
          <Space>
            <Button.Ripple color="primary" onClick={() => handleBack()}>
              <i className="fas fa-arrow-left" />{" "}
              {useFormatMessage("modules.time_off_import.buttons.back")}
            </Button.Ripple>
            <Button.Ripple
              color="primary"
              disabled={disableNextButton}
              onClick={() => handleNextStep()}
            >
              {useFormatMessage("modules.time_off_import.buttons.next")}{" "}
              <i className="fas fa-arrow-right" />
            </Button.Ripple>
          </Space>
        </div>
      </CardBody>
    </Card>
  );
};

export default UploadFileStep;

// ** React Imports
import { useFormatMessage } from "@apps/utility/common";
// ** Styles
import { Button, Card, CardBody, CardFooter } from "reactstrap";
// ** Components
import { ErpRadio } from "@apps/components/common/ErpField";

const ImportType = (props) => {
  const {
    // ** props
    importType,
    // ** methods
    setImportType,
    setCurrentStep
  } = props;

  const handleChangeType = (type) => {
    setImportType(type);
  };

  const handleAcceptType = () => {
    setCurrentStep("upload_file");
  };

  // ** render
  return (
    <Card className="import-type">
      <CardBody>
        <h5>
          <i className="far fa-comment-exclamation icon-circle bg-icon-green" />
          {useFormatMessage("modules.time_off_import.title.import_type")}
        </h5>
        <div className="d-flex align-items-center justify-content-between mt-4 import-type-container">
          <Card className="import-type-item">
            <CardBody>
              <div className="d-flex">
                <div>
                  <ErpRadio
                    name="import-type"
                    id="import-type-new"
                    className="me-50"
                    defaultChecked={importType === "set_new_balance"}
                    defaultValue="set_new_balance"
                    onChange={() => handleChangeType("set_new_balance")}
                  />
                </div>
                <div>
                  <h6 className="mb-0">
                    {useFormatMessage(
                      "modules.time_off_import.options.set_new_balance.title"
                    )}
                  </h6>
                  <small>
                    {useFormatMessage(
                      "modules.time_off_import.options.set_new_balance.sub_titlte"
                    )}
                  </small>
                  <p className="mt-1 mb-0">
                    {useFormatMessage(
                      "modules.time_off_import.options.set_new_balance.content"
                    )}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card className="import-type-item">
            <CardBody>
              <div className="d-flex">
                <div>
                  <ErpRadio
                    name="import-type"
                    id="import-type-adjust"
                    className="me-50"
                    defaultChecked={importType === "adjust_existing_balance"}
                    defaultValue="adjust_existing_balance"
                    onChange={() => handleChangeType("adjust_existing_balance")}
                  />
                </div>
                <div>
                  <h6 className="mb-0">
                    {useFormatMessage(
                      "modules.time_off_import.options.adjust_existing_balance.title"
                    )}
                  </h6>
                  <small>
                    {useFormatMessage(
                      "modules.time_off_import.options.adjust_existing_balance.sub_titlte"
                    )}
                  </small>
                  <p className="mt-1 mb-0">
                    {useFormatMessage(
                      "modules.time_off_import.options.adjust_existing_balance.content"
                    )}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="mt-0">
          <Button.Ripple color="primary" onClick={() => handleAcceptType()}>
            {useFormatMessage("modules.time_off_import.buttons.next")}{" "}
            <i className="fas fa-arrow-right" />
          </Button.Ripple>
        </div>
      </CardBody>
    </Card>
  );
};

export default ImportType;

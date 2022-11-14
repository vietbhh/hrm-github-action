// ** React Imports
import { map } from "lodash";
import { useFormatMessage } from "@apps/utility/common";
// ** Styles
import { Space, Collapse } from "antd";
import { Fragment } from "react";
// ** Components

const { Panel } = Collapse;

const InfoRecordSkip = (props) => {
  const {
    // ** props
    recordSkip
    // ** methods
  } = props;

  // ** render
  const renderCollapseHeader = (index, item) => {
    const row = parseInt(index) + 2;
    return (
      <div className="d-flex collapse-header">
        <div className="row ms-1">
          {useFormatMessage(
            "modules.time_off_import.text.preview_and_import.row"
          )}{" "}
          {row}
        </div>
        <div className="email">{item.email}</div>
        <div>
          {Object.keys(item.arr_error).length}{" "}
          {useFormatMessage(
            "modules.time_off_import.text.preview_and_import.error"
          )}
        </div>
      </div>
    );
  };

  const renderError = (itemError) => {
    return (
      <div className="d-flex list-error pl-3">
        <div>
          <span className="error-field">
            {useFormatMessage(
              "modules.time_off_import.text.preview_and_import.field"
            )}{" "}
          </span>
          <span>"{itemError.name}"</span>
        </div>
        <div>
          <span className="error-field">
            {useFormatMessage(
              "modules.time_off_import.text.preview_and_import.upload_file_header"
            )}{" "}
          </span>
          <span>"{itemError.header}"</span>
        </div>
        <div>
          <span className="error-field">
            {useFormatMessage(
              "modules.time_off_import.text.preview_and_import.value"
            )}
          </span>{" "}
          <span>"{itemError.value}"</span>
        </div>
        <div>
          <span>
            {useFormatMessage(
              `modules.time_off_import.text.preview_and_import.${itemError.error}`
            )}
          </span>
        </div>
      </div>
    );
  };

  const renderCollapse = (index, item) => {
    const collapseHeader = renderCollapseHeader(index, item);
    return (
      <Collapse bordered={false}>
        <Panel header={collapseHeader} key="1">
          {map(item.arr_error, (itemError, indexError) => {
            return (
              <div key={`record-skip-error-${indexError}`}>{renderError(itemError)}</div>
            );
          })}
        </Panel>
      </Collapse>
    );
  };

  return (
    <div className="ms-1 info-record-skip">
      {map(recordSkip, (item, index) => {
        return <div key={index} className="mb-2">{renderCollapse(index, item)}</div>;
      })}
    </div>
  );
};

export default InfoRecordSkip;

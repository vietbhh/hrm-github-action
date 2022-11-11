import {
  fieldLabel
} from "@apps/utility/common";
import { isArray } from "@apps/utility/handleData";
import { cellHandle } from "@apps/utility/TableHandler";
import { isEmpty, isNumber, toArray } from "lodash";
import { Fragment } from "react";
import { Col, Row } from "reactstrap";
import DetailAuditDataDefaultModule from "./DetailAuditDataDefaultModule";

const DetailTableDefaultModule = (props) => {
  const { fields, data, module } = props;
  const recordData = data;
  const defaultIcon = "fal fa-angle-double-right";
  const typeBreakLine = [
    "textarea",
    "upload_one",
    "upload_multiple",
    "upload_image"
  ];
  const listFields = isArray(fields) ? fields : toArray(fields);
  return (
    <Fragment>
      <Row>
        {!isEmpty(listFields) &&
          listFields
            .sort((a, b) => {
              if (
                a.field_quick_view_order !== 0 &&
                b.field_quick_view_order !== 0
              )
                return parseFloat(a.field_quick_view_order) >
                  parseFloat(b.field_quick_view_order)
                  ? 1
                  : -1;
              else return a.id > b.id ? 1 : -1;
            })
            .map((field, key) => {
              const moduleName = isNumber(field.module)
                ? module.name
                : field.module;
              const fieldIcon = isEmpty(field.fieldIcon)
                ? defaultIcon
                : field.fieldIcon;
              const fieldBreak = field.field_options?.detail?.break_row;
              return typeBreakLine.includes(field.field_type) ||
                fieldBreak === true ? (
                <Fragment key={key}>
                  <Col sm="12" md="12">
                    <span className="fw-bolder">
                      <i className={fieldIcon}></i>{" "}
                      {fieldLabel(moduleName, field.field)}
                    </span>
                  </Col>
                  <Col sm="12" md="12">
                    <span>
                      {cellHandle(field, recordData, {
                        textarea: { compact: false }
                      })}
                    </span>
                  </Col>
                  {key !== fields.length - 1 && (
                    <Col sm="12" className="px-0">
                      <hr />
                    </Col>
                  )}
                </Fragment>
              ) : (
                <Fragment key={key}>
                  <Col sm="12" md="6">
                    <span className="fw-bolder">
                      <i className={fieldIcon}></i>{" "}
                      {fieldLabel(moduleName, field.field)}
                    </span>
                    <span className="float-end">
                      {cellHandle(field, recordData, {
                        textarea: { compact: false }
                      })}
                    </span>
                  </Col>
                  {key !== fields.length - 1 && (
                    <Col sm="12" className="px-0">
                      <hr />
                    </Col>
                  )}
                </Fragment>
              );
            })}
      </Row>
      <Row>
        <Col className="px-0">
          <hr />
        </Col>
      </Row>
      <Row>
        <Col sm="12" className="text-end">
          <DetailAuditDataDefaultModule data={recordData} />
        </Col>
      </Row>
    </Fragment>
  );
};

export default DetailTableDefaultModule;

import { useFormatMessage } from "@apps/utility/common";
import { Fragment } from "react";
import { Col, Row } from "reactstrap";

const BankInfo = (props) => {
  const { data_employee } = props;
  return (
    <Fragment>
      <Row
        className="employee-payroll-modal collapse-body"
        style={{ marginBottom: "50px", paddingLeft: "10px" }}
      >
        <Col sm={6}>
          <Row>
            <Col sm={5} className="mb-7 color_default">
              {useFormatMessage("modules.payrolls.modal.bank_name")}
            </Col>
            <Col sm={6} className="mb-7 color-black">
              {data_employee && data_employee.bank_name
                ? data_employee.bank_name
                : "-"}
            </Col>
          </Row>
          <Row>
            <Col sm={5} className="mb-7 color_default">
              {useFormatMessage("modules.payrolls.modal.bank_address")}
            </Col>
            <Col sm={6} className="mb-7 color-black">
              {data_employee && data_employee.bank_address
                ? data_employee.bank_address
                : "-"}
            </Col>
          </Row>
        </Col>
        <Col sm={6}>
          <Row>
            <Col sm={5} className="mb-7 color_default">
              {useFormatMessage("modules.payrolls.modal.account_name")}
            </Col>
            <Col sm={6} className="mb-7 color-black">
              {data_employee && data_employee.bank_owner
                ? data_employee.bank_owner
                : "-"}
            </Col>
          </Row>
          <Row>
            <Col sm={5} className="mb-7 color_default">
              {useFormatMessage("modules.payrolls.modal.account_number")}
            </Col>
            <Col sm={6} className="mb-7 color-black">
              {data_employee && data_employee.bank_number
                ? data_employee.bank_number
                : "-"}
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
};

export default BankInfo;

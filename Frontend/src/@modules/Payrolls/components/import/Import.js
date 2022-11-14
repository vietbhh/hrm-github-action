import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Row
} from "reactstrap"

const Import = (props) => {
  const { next, setImportType, import_type } = props
  return (
    <Fragment>
      <Breadcrumbs
        className="team-attendance-breadcrumbs"
        list={[
          {
            title: useFormatMessage("modules.payrolls.title")
          },
          {
            title: useFormatMessage("modules.payrolls.import.title")
          }
        ]}
      />

      <Card className="payroll-import">
        <CardHeader>
          <div className="d-flex flex-wrap w-100">
            <div className="d-flex align-items-center">
              <i className="far fa-arrow-alt-circle-down icon-circle bg-icon-green"></i>
              <span className="instruction-bold">
                {useFormatMessage(
                  "modules.payrolls.import.select_data_to_import"
                )}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Row className="margin-row">
            <Col xs="12" className="box-import mb-1-5">
              <div className="d-flex">
                <Label check className="me-10">
                  <Input
                    type="radio"
                    name="radio1"
                    defaultChecked={import_type === "salary"}
                    onClick={() => {
                      setImportType("salary")
                    }}
                  />
                </Label>
                <div className="d-flex flex-column">
                  <h6 className="size-h6">
                    {useFormatMessage("modules.payrolls.import.fixed_salary")}
                  </h6>
                  <p className="mb-0">
                    {useFormatMessage(
                      "modules.payrolls.import.fixed_salary_text"
                    )}
                  </p>
                </div>
              </div>
            </Col>
            <Col xs="12" className="box-import">
              <div className="d-flex">
                <Label check className="me-10">
                  <Input
                    type="radio"
                    name="radio1"
                    defaultChecked={import_type === "recurring"}
                    onClick={() => {
                      setImportType("recurring")
                    }}
                  />
                </Label>
                <div className="d-flex flex-column">
                  <h6 className="size-h6">
                    {useFormatMessage(
                      "modules.payrolls.import.recurring_payments"
                    )}
                  </h6>
                  <p className="mb-0">
                    {useFormatMessage(
                      "modules.payrolls.import.recurring_payments_text"
                    )}
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Row>
            <Col sm={12}>
              <Button
                color="primary"
                onClick={() => {
                  next()
                }}>
                {useFormatMessage("modules.payrolls.import.button.next")}
                <i className="fas fa-arrow-right ms-7"></i>
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default Import

// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Col, Row } from "reactstrap"
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"

const WaitingPeriodElement = (props) => {
  const {
    // ** props
    moduleName,
    metas,
    options,
    dataForm,
    isEditPolicy,
    methods
    // ** methods
  } = props

  console.log(options)

  // ** render
  return (
    <Fragment>
      <Row className="mt-0">
        <Col sm={3} className="mb-0">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.waiting_period
            }}
            nolabel={false}
            useForm={methods}
            updateData={dataForm?.waiting_period}
          />
        </Col>
        <Col sm={3} className="mb-0 no-label-field">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.waiting_period_unit
            }}
            label=""
            nolabel={false}
            useForm={methods}
            updateData={dataForm?.waiting_period_unit}
            options={options}
            isClearable={false}
          />
        </Col>
        <Col sm={6} className="mb-0 no-label-field">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.waiting_period_type
            }}
            label=""
            nolabel={false}
            useForm={methods}
            updateData={dataForm?.waiting_period_type}
            options={options}
            isClearable={false}
          />
        </Col>
      </Row>
    </Fragment>
  )
}

export default WaitingPeriodElement

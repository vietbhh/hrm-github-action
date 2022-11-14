// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { getOptionValue, getOptionLabel } from "@modules/TimeOff/common/common"
// ** Styles
import {
  Button,
  Col,
  Row,
  Spinner,
  Card,
  CardBody,
  FormGroup
} from "reactstrap"
// ** Components
import { ErpRadio } from "@apps/components/common/ErpField"

const KeepBalanceElement = (props) => {
  const {
    // ** props
    options,
    // ** methods
    methods
  } = props

  const keepBalanceOption = options.keep_balance

  const defaultKeepBalance = getOptionValue(
    options,
    "keep_balance",
    "keepbalance"
  )

  // ** render
  return (
    <div>
      {keepBalanceOption.map((item) => {
        return (
          <Row className="mt-12" key={`keep_balance_${item.value}`}>
            <Card className="duration-allowed-card">
              <CardBody>
                <div className="d-flex align-items-center mb-1">
                  <ErpRadio
                    name="keep_balance"
                    id={`erp_checkbox_keep_balance_${item.value}`}
                    nolabel={true}
                    useForm={methods}
                    defaultValue={item.value}
                    defaultChecked={parseInt(item.value) === defaultKeepBalance}
                    className="me-50"
                  />
                  <span>{useFormatMessage(item.label)}</span>
                </div>
                <p
                  dangerouslySetInnerHTML={{
                    __html: useFormatMessage(
                      `modules.time_off_policies.text.keep_balance_description.${item.name_option}`
                    )
                  }}
                />
              </CardBody>
            </Card>
          </Row>
        )
      })}
    </div>
  )
}

export default KeepBalanceElement

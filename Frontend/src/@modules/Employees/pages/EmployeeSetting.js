// ** React Imports
import { Fragment } from "react"
import { useParams } from "react-router-dom"
import { useFormatMessage } from "@apps/utility/common"
import {
  getNavMenuContract,
  getNavMenuAutoGenerateCode,
  getNavMenuEmployeeType
} from "@modules/Employees/common/common"
// ** Styles
import { Card, CardBody, Row, Col } from "reactstrap"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import NavMenuEmployeeSetting from "../components/detail/employee-setting/custom-field/NavMenuEmployeeSetting"
import TabContentEmployeeSetting from "../components/detail/employee-setting/custom-field/TabContentEmployeeSetting"
import ContractSetting from "../components/detail/employee-setting/contract/ContractSetting"
import EmployeeTypeSetting from "../components/detail/employee-setting/employee-type/EmployeeTypeSetting"
import TabContentAutoGenerateCode from "../components/detail/employee-setting/auto-generate-code/TabContentAutoGenerateCode"

const EmployeeSetting = (props) => {
  const { tab } = useParams()

  // ** render
  const renderTabContent = () => {
    const navContract = getNavMenuContract().map((item) => {
      return item.tab
    })
    const navAutoGenerateCode = getNavMenuAutoGenerateCode().map((item) => {
      return item.tab
    })
    const navEmployeeType = getNavMenuEmployeeType().map((item) => {
      return item.tab
    })

    if (navContract.includes(tab)) {
      return <ContractSetting tab={tab} />
    }

    if (navAutoGenerateCode.includes(tab)) {
      return <TabContentAutoGenerateCode tab={tab} />
    }

    if (navEmployeeType.includes(tab)) {
      console.log("z")
      return <EmployeeTypeSetting tab={tab} />
    }

    return <TabContentEmployeeSetting tab={tab} />
  }

  return (
    <Fragment>
      <Breadcrumbs
        list={[
          {
            title: useFormatMessage("modules.employee_setting.title.employee")
          },
          { title: useFormatMessage("modules.employee_setting.title.setting") }
        ]}
      />
      <Card className="extraWidthLayoutPage employeePage employee-setting">
        <CardBody className="p-md-0">
          <Row className="contentWrapper">
            <Col className="sideBarColumn employeeSidebar">
              <NavMenuEmployeeSetting />
            </Col>
            <Col className="col-md-8 mainContent">
              <Fragment>{renderTabContent()}</Fragment>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default EmployeeSetting

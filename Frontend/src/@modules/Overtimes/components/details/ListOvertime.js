// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Row, Col } from "reactstrap"
import { Space } from "antd"
// ** Components
import OvertimeItem from "./OvertimeItem"

const ListOvertime = (props) => {
  const {
    // ** props
    fromComponent,
    listOvertime,
    // **  methods
    toggleModalAction,
    setActionType,
    setIsEditModal,
    setModalData
  } = props

  // ** render
  const renderComponent = () => {
    return (
      <Row className="mt-2">
        <Col sm={12}>
          <Space direction="vertical" className="w-100">
            <div className="collapse-overtime">
              {listOvertime.map((item, index) => {
                return (
                  <Fragment key={`overtime_item_${index}`}>
                    <OvertimeItem
                      fromComponent={fromComponent}
                      overtime={item}
                      toggleModalAction={toggleModalAction}
                      setActionType={setActionType}
                      setIsEditModal={setIsEditModal}
                      setModalData={setModalData}
                    />
                  </Fragment>
                )
              })}
            </div>
          </Space>
        </Col>
      </Row>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default ListOvertime

// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
import { Button, Card, CardBody, Col, Row } from "reactstrap"
import { Pagination, Space } from "antd"
// ** Components
import { ErpSelect, ErpInput } from "@apps/components/common/ErpField"

const RequestToJoinHeader = (props) => {
  const {
    // ** props
    id,
    loadingPage,
    totalRequestJoin,
    // ** methods
    setFilter,
    setRequestJoins
  } = props

  const [loading, setLoading] = useState(false)

  const handleClickApproveAll = (type) => {
    if (parseInt(totalRequestJoin) === 0) {
      return false 
    }

    setLoading(true)
    const values = {
      [type]: true,
      is_all: true
    }

    workspaceApi
      .update(id, values)
      .then((res) => {
        setLoading(false)
        setRequestJoins([])
      })
      .catch((err) => {
        setLoading(false)
      })
  }

  const handleChangeSelect = (values) => {
    setFilter({
      order: values.value
    })
  }

  const debounceSearch = useRef(
    _.debounce((nextValue) => {
      setFilter({ text: nextValue })
    }, import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY)
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  const options = [
    {
      value: "desc",
      label: useFormatMessage(
        "modules.workspace.display.filter_request_join.select.newest_first"
      )
    },
    {
      value: "asc",
      label: useFormatMessage(
        "modules.workspace.display.filter_request_join.select.oldest_first"
      )
    }
  ]

  // ** render
  return (
    <Card className="header mb-2">
      <CardBody>
        <div className="w-100 d-flex align-items-center justify-content-between mb-1">
          <h6 className="mb-0 title">
            {useFormatMessage(
              "modules.workspace.display.member_request_to_join",
              {
                number: totalRequestJoin
              }
            )}
          </h6>
          <div className="button-section">
            <Space>
              <Button.Ripple
                className="btn-action-primary"
                disabled={loading || loadingPage}
                onClick={() => handleClickApproveAll("approve_join_request")}>
                {useFormatMessage("modules.workspace.buttons.approve_all")}
              </Button.Ripple>
              <Button.Ripple
                className="btn-action-secondary"
                disabled={loading || loadingPage}
                onClick={() => handleClickApproveAll("decline_join_request")}>
                {useFormatMessage("modules.workspace.buttons.decline_all")}
              </Button.Ripple>
            </Space>
          </div>
        </div>
        <div className="filter-section">
          <Row>
            <Col sm="4" className="pe-75 me-0">
              <ErpSelect
                className="select-filter"
                options={options}
                defaultValue={options[0]}
                isClearable={false}
                onChange={(values) => handleChangeSelect(values)}
              />
            </Col>
            <Col sm="8" className="ps-0 ms-0">
              <ErpInput
                placeholder={useFormatMessage(
                  "modules.workspace.text.find_a_member"
                )}
                prepend={<i className="fas fa-search" />}
                className="text-filter"
                onChange={(e) => handleSearchVal(e)}
              />
            </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  )
}

export default RequestToJoinHeader

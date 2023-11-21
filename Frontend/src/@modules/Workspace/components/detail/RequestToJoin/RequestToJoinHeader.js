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
import notification from "@apps/utility/notification"
import { isMobileView } from "../../../common/common"

const RequestToJoinHeader = (props) => {
  const {
    // ** props
    id,
    loadingPage,
    totalRequestJoin,
    // ** methods
    setFilter,
    setRequestJoins,
    setState
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
        setState({
          totalRequestJoin: 0
        })
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
      .catch((err) => {
        setLoading(false)
        notification.showError("notification.save.error")
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
    <Card className="header">
      <CardBody>
        <div className="w-100 d-flex align-items-center justify-content-between">
          <h6 className="mb-0 title">
            {!isMobileView()
              ? useFormatMessage(
                  "modules.workspace.display.member_request_to_join",
                  {
                    number: totalRequestJoin !== 0 ? totalRequestJoin : "No"
                  }
                )
              : useFormatMessage(
                  "modules.workspace.display.mobile_member_request_to_join",
                  {
                    number: totalRequestJoin
                  }
                )}
          </h6>
          <div className="button-section">
            <Space>
              <Button
                className="btn-action-primary"
                color="primary"
                disabled={loading || loadingPage}
                onClick={() => handleClickApproveAll("approve_join_request")}>
                {useFormatMessage("modules.workspace.buttons.approve_all")}
              </Button>
              <Button
                className="btn-action-secondary"
                disabled={loading || loadingPage}
                onClick={() => handleClickApproveAll("decline_join_request")}>
                {useFormatMessage("modules.workspace.buttons.decline_all")}
              </Button>
            </Space>
          </div>
        </div>
        <div className="filter-section">
          <Row>
            <Col xs="6" md="4" className="pe-75 me-0">
              <ErpSelect
                nolabel
                className="select-filter"
                options={options}
                defaultValue={options[0]}
                isClearable={false}
                onChange={(values) => handleChangeSelect(values)}
              />
            </Col>
            <Col xs="6" md="8" className="search-input-member mt-0">
              <ErpInput
                nolabel
                placeholder={useFormatMessage(
                  "modules.workspace.text.find_a_member"
                )}
                prepend={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none">
                    <path
                      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                      stroke="#696760"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 22L20 20"
                      stroke="#696760"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
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

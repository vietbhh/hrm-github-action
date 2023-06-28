// ** React Imports
import { useRef } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Card, CardBody, Nav, NavItem, NavLink } from "reactstrap"
// ** Components
import { ErpInput } from "@apps/components/common/ErpField"
import ListWorkspaceHeader from "./ListWorkspaceHeader"
import TableWorkspace from "./TableWorkspace"

const ListWorkspace = (props) => {
  const {
    // ** props
    loading,
    data,
    totalData,
    filter,
    // ** methods
    setFilter,
    setData
  } = props

  const setTabActive = (type) => {
    setFilter({
      query_type: type
    })
  }

  const debounceSearch = useRef(
    _.debounce((nextValue) => {
      setFilter({
        text: nextValue
      })
    }, import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY)
  ).current

  const handleChangeText = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  // ** render
  return (
    <div className="list-workspace">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <Nav tabs className="mb-2">
            <NavItem>
              <NavLink
                active={filter.query_type === "information"}
                onClick={() => {
                  setTabActive("information")
                }}>
                {useFormatMessage(
                  "modules.workspace.display.workspace_information"
                )}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={filter.query_type === "activity"}
                onClick={() => {
                  setTabActive("activity")
                }}>
                {useFormatMessage(
                  "modules.workspace.display.workspace_activities"
                )}
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <div className="w-25">
          <ErpInput
            prepend={<i className="fas fa-search" />}
            nolabel={true}
            placeholder={useFormatMessage(
              "modules.workspace.text.search_workspace"
            )}
            onChange={(e) => handleChangeText(e)}
          />
        </div>
      </div>
      <Card>
        <CardBody>
          <ListWorkspaceHeader
            data={data}
            filter={filter}
            setFilter={setFilter}
          />
          <TableWorkspace
            loading={loading}
            data={data}
            totalData={totalData}
            filter={filter}
            setFilter={setFilter}
            setData={setData}
          />
        </CardBody>
      </Card>
    </div>
  )
}

export default ListWorkspace

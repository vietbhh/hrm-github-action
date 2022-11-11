import { ErpCheckbox } from "@apps/components/common/ErpField"
import React from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Col, Row, Table } from "reactstrap"
const ModuleGroupPermitFormComponent = (props) => {
  const { groupsPermits, setGroupsPermits } = props
  const [permitSuper, setPermitSuper] = React.useState({})
  const setGroupPermitData = (group, value) => {
    const groupPermit = { ...groupsPermits[group], ...value }
    const newPermits = { ...groupsPermits, [group]: groupPermit }
    setGroupsPermits(newPermits)
  }
  const setSuper = (group, isSuper) => {
    setPermitSuper({ ...permitSuper, [group]: isSuper })
    let tempData = {}
    props.permits.map((item) => {
      tempData = { ...tempData, [item.name]: isSuper }
    })
    const newPermits = { ...groupsPermits, [group]: tempData }
    setGroupsPermits(newPermits)
  }
  return (
    <React.Fragment>
      <Row>
        <Col md="12">
          <PerfectScrollbar>
            <Table striped hover responsive className="w-100">
              <thead>
                <tr>
                  <th />
                  {props.groups.map((group, groupIndex) => {
                    let setChecked = permitSuper[group.id]
                      ? permitSuper[group.id]
                      : false
                    if (!props.updateData && parseInt(group.id) === 1)
                      setChecked = true
                    return (
                      <th key={groupIndex}>
                        {group.name}{" "}
                        <ErpCheckbox
                          id={`group_permit_all_${groupIndex}`}
                          checked={setChecked}
                          onChange={(e) => {
                            setSuper(group.id, e.target.checked)
                          }}
                        />
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {props.permits.map((item, index) => {
                  return (
                    <tr key={`row_${index}`}>
                      <td>{item.name}</td>
                      {props.groups.map((group, groupIndex) => {
                        let setChecked =
                          groupsPermits[group.id] &&
                          groupsPermits[group.id][item.name]
                            ? groupsPermits[group.id][item.name]
                            : false
                        if (!props.updateData && parseInt(group.id) === 1)
                          setChecked = true
                        return (
                          <td key={`col_${index}_${groupIndex}`}>
                            <ErpCheckbox
                              id={`group_permit_${index}_${groupIndex}`}
                              checked={setChecked}
                              onChange={(e) => {
                                setGroupPermitData(group.id, {
                                  [item.name]: e.target.checked
                                })
                              }}
                            />
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </PerfectScrollbar>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default ModuleGroupPermitFormComponent

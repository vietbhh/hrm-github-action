// ** React Imports
import { Fragment, useCallback, useEffect, useState } from "react"
import { ReactSortable } from "react-sortablejs"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
// ** Components
import GroupRuleItem from "./GroupRuleItem"

const ListGroupRule = (props) => {
  const {
    // ** props
    id,
    groupRule,
    isAdminGroup,
    // ** methods
    setGroupRule,
    toggleModalEditGroupRule,
    setEditGroupRuleData
  } = props

  const handleSetAndUpdateGroupRule = (data) => {
    setGroupRule(data)

    workspaceApi
      .sortGroupRule(id, data)
      .then((res) => {})
      .catch((err) => {})
  }

  // ** render
  const renderComponent = () => {
    if (groupRule.length === 0) {
      return ""
    }

    return (
      <div className="list-group-rule">
        <ReactSortable
          handle=".dragIcon"
          className="list-group"
          list={groupRule}
          setList={handleSetAndUpdateGroupRule}
          animation={200}
          delayOnTouchStart={true}
          delay={2}>
          {groupRule.map((item, key, array) => {
            return (
              <GroupRuleItem
                id={id}
                key={`group-rule-tem-${key}`}
                itemGroupRule={item}
                index={key}
                isAdminGroup={isAdminGroup}
                toggleModalEditGroupRule={toggleModalEditGroupRule}
                setEditGroupRuleData={setEditGroupRuleData}
                setGroupRule={setGroupRule}
              />
            )
          })}
        </ReactSortable>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default ListGroupRule

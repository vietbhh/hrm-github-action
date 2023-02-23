// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import GroupRuleItem from "./GroupRuleItem"

const ListGroupRule = (props) => {
  const {
    // ** props
    id,
    isEditable,
    groupRule,
    // ** methods
    setGroupRule
  } = props

  // ** render
  const renderComponent = () => {
    if (groupRule.length === 0) {
      return ""
    }

    return (
      <div className="list-group-rule">
        {groupRule.map((item, key, array) => {
          return (
            <GroupRuleItem
              key={`group-rule-tem-${key}`}
              id={id}
              item={item}
              index={key}
              isEditable={isEditable}
              arrayLength={array.length}
              setGroupRule={setGroupRule}
            />
          )
        })}
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default ListGroupRule

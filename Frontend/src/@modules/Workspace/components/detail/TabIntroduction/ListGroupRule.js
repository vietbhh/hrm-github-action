// ** React Imports
import { Fragment, useCallback } from "react"
import { useDrop } from "react-dnd"
import update from "immutability-helper"
// ** Styles
// ** Components
import GroupRuleItem from "./GroupRuleItem"

const ListGroupRule = (props) => {
  const {
    // ** props
    isEditable,
    groupRule,
    // ** methods
    setGroupRule
  } = props


  const [, drop] = useDrop(() => ({ accept: "card_group_rule" }))

  const handleFindCard = useCallback((id) => {
    const [currentGroupRule] = [...groupRule].filter((item) => {
      return item._id === id
    })

    return {
      currentGroupRule: currentGroupRule,
      index: groupRule.indexOf(currentGroupRule)
    }
  }, [groupRule])

  const handleMoveCard = useCallback((id, atIndex) => {
    const { currentGroupRule, index } = handleFindCard(id, groupRule)
    const result = update(groupRule, {
      $splice: [
        [index, 1],
        [atIndex, 0, currentGroupRule]
      ]
    })
    console.log(result)
    setGroupRule(result, true)
  }, [handleFindCard, groupRule, setGroupRule])

  // ** render
  const renderComponent = () => {
    if (groupRule.length === 0) {
      return ""
    }

    return (
      <div ref={drop} className="list-group-rule">
        {groupRule.map((item, key, array) => {
          return (
            <GroupRuleItem
              key={`group-rule-tem-${key}`}
              itemGroupRule={item}
              index={key}
              groupRule={groupRule}
              isEditable={isEditable}
              arrayLength={array.length}
              setGroupRule={setGroupRule}
              handleFindCard={handleFindCard}
              handleMoveCard={handleMoveCard}
            />
          )
        })}
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default ListGroupRule

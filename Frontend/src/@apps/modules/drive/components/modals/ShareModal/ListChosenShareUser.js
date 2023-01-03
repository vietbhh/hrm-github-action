// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import ChosenShareUserItem from "./ChosenShareUserItem"

const ListChosenShareUser = (props) => {
  const {
    // ** props
    chosenUser,
    methods,
    // ** methods
    setChosenUser
  } = props

  // ** render
  const renderComponent = () => {
    return (
      <Fragment>
        <div className="list-chosen-share-user mt-2">
          <h6 className="mb-1">
            {useFormatMessage("modules.drive.text.chosen_users")}
          </h6>
          {_.map(chosenUser, (item, index) => {
            return (
              <Fragment key={`chosen-share-user-item-${index}`}>
                <ChosenShareUserItem
                  item={item}
                  methods={methods}
                  setChosenUser={setChosenUser}
                />
              </Fragment>
            )
          })}
        </div>
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default ListChosenShareUser

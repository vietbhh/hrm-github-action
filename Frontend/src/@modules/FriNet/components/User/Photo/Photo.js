// ** React Imports
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import MediaTabContent from "@modules/Workspace/components/detail/TabMedia/MediaTabContent"

const Photo = (props) => {
  const {
    // ** props
    identity
    // ** methods
  } = props

  // ** render
  return (
    <Card>
      <CardBody className="p-3 pt-1">
        <MediaTabContent
          id="user"
          customFilter={{
            owner: identity
          }}
          tabId={2}
          mediaTabActive={2}
          pageLength={24}
        />
      </CardBody>
    </Card>
  )
}

export default Photo

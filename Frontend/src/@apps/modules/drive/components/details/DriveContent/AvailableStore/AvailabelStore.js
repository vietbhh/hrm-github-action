// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import UsedCapacity from "./UsedCapacity"

const AvailableStore = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const totalCapacity = 5120

  const mockData = [
    {
      title: "image",
      file_number: 150,
      total_size: 1048
    },
    {
      title: "documents",
      file_number: 23,
      total_size: 1350
    },
    {
      title: "videos",
      file_number: 5,
      total_size: 2012
    },
    {
      title: "other",
      file_number: 1,
      total_size: 590
    }
  ]

  // ** render
  const renderUsedCapacity = () => {
    return <UsedCapacity totalCapacity={totalCapacity} data={mockData} />
  }

  return (
    <Fragment>
      <div className="ps-3">
        <Card>
          <CardBody>
            <div>
              <div>
                <Fragment>{renderUsedCapacity()}</Fragment>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </Fragment>
  )
}

export default AvailableStore

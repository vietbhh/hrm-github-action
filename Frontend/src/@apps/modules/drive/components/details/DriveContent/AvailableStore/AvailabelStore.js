// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import UsedCapacity from "./UsedCapacity"
import FileCapacity from "./FileCapacity/FileCapacity"
import UpgradeStorage from "./UpgradeStorage"

const AvailableStore = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const totalCapacity = 5120

  const mockData = {
    image: {
      title: "images",
      file_number: 150,
      total_size: 1048
    },
    document: {
      title: "documents",
      file_number: 23,
      total_size: 1350
    },
    video: {
      title: "videos",
      file_number: 5,
      total_size: 2012
    },
    other: {
      title: "other",
      file_number: 1,
      total_size: 590
    }
  }

  // ** render
  const renderUsedCapacity = () => {
    return <UsedCapacity totalCapacity={totalCapacity} data={mockData} />
  }

  const renderFileCapacity = () => {
    return <FileCapacity data={mockData} />
  }

  const renderUpgradeStorage = () => {
    return <UpgradeStorage />
  }

  return (
    <Fragment>
      <div className="ps-3">
        <Card className="">
          <CardBody>
            <div>
              <div className="mb-4 used-capacity-container">
                <Fragment>{renderUsedCapacity()}</Fragment>
              </div>
              <div className="mb-5 file-capacity-container">
                <Fragment>{renderFileCapacity()}</Fragment>
              </div>
              <div className="mb-3 upgrade-storage-capacity">
                <Fragment>{renderUpgradeStorage()}</Fragment>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </Fragment>
  )
}

export default AvailableStore

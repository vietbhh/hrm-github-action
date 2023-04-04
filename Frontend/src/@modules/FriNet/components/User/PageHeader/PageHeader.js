// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { userApi } from "@modules/FriNet/common/api"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import CoverImage from "@modules/Workspace/components/detail/CoverImage"
import AvatarBox from "@modules/Employees/components/detail/AvatarBox"

const PageHeader = (props) => {
  const {
    // ** props
    employeeData
    // ** methods
  } = props

  console.log(employeeData)

  // ** render
  return (
    <Card>
      <div className="cover-image-container">
        <CoverImage
          src={employeeData.cover_image?.url}
          dataSave={{ employeeData }}
          saveCoverImageApi={userApi.saveCoverImage}
        />
        <div className="avatar">
          <AvatarBox currentAvatar={employeeData.avatar} />
        </div>
      </div>
      <div className="mt-2 p-2 d-flex justify-content-center user-info-container">
        <h3>{employeeData.full_name}</h3>
      </div>
      <CardBody>
        
      </CardBody>
    </Card>
  )
}

export default PageHeader

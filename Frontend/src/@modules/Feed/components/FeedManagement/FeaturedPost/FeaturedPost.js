// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import Header from "../Common/Header"
import TableFeaturedPost from "./TableFeaturedPost"
import PreviewPostModal from "../../modals/PreviewPostModal"

const FeaturedPost = (props) => {
  const {
    // ** props
    loading,
    filter,
    data,
    workspaceData,
    totalData,
    // ** methods
    setFilter,
    setData
  } = props

  const [state, setState] = useMergedState({
    modalPreview: false,
    dataPreview: {}
  })

  const toggleModalPreview = () => {
    setState({
      modalPreview: !state.modalPreview
    })
  }

  const setDataPreview = (data) => {
    setState({
      dataPreview: data
    })
  }

  const handleChangeDate = (value, type) => {
    setFilter({
      [type]: value
    })
  }

  // ** render
  return (
    <Card>
      <CardBody>
        <Header
          title={useFormatMessage(
            "modules.feed.manage_post.title.featured_post"
          )}
          from={filter.from}
          to={filter.to}
          handleChangeDate={handleChangeDate}
        />
        <TableFeaturedPost
          loading={loading}
          data={data}
          workspaceData={workspaceData}
          totalData={totalData}
          filter={filter}
          setFilter={setFilter}
          setData={setData}
          toggleModalPreview={toggleModalPreview}
          setDataPreview={setDataPreview}
        />
      </CardBody>
      <PreviewPostModal modal={modalPreview} handleModal={toggleModalPreview} />
    </Card>
  )
}

export default FeaturedPost

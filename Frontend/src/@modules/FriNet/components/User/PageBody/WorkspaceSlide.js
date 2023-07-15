// ** React Imports
import { workspaceApi } from "@modules/Workspace/common/api"
import { useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import Carousel from "react-multi-carousel"
// ** Styles
import "react-multi-carousel/lib/styles.css"
// ** Components
import WorkspaceItem from "../../../../Workspace/components/detail/ListWorkSpace/WorkspaceItem"

const WorkspaceSlide = (props) => {
  const {
    // ** props
    employeeData
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    data: []
  })

  const loadData = () => {
    setState({
      loading: true
    })

    workspaceApi
      .getList({
        page: 1,
        limit: 15,
        workspace_type: "managed",
        user_id: employeeData.id
      })
      .then((res) => {
        setState({
          data: res.data.results,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          data: [],
          loading: false
        })
      })
  }

  const images = [
    "https://images.unsplash.com/photo-1549989476-69a92fa57c36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550133730-695473e544be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550167164-1b67c2be3973?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550338861-b7cfeaf8ffd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550223640-23097fc71cb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550353175-a3611868086b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550330039-a54e15ed9d33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549737328-8b9f3252b927?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549833284-6a7df91c1f65?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549985908-597a09ef0a7c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550064824-8f993041ffd3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
  ]

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisible: 0
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      partialVisible: 50
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisible: 30
    }
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [])

  // ** render
  const renderComponent = () => {
    if (state.loading === true) {
      return ""
    }

    return (
      <div className="workspace-list workspace-manage-list">
        <Carousel
          ssr
          partialVisbile
          itemClass="image-item"
          responsive={responsive}
          infinite={true}>
          {state.data.map((item) => {
            return (
              <WorkspaceItem
                key={`workspace-item-${item.id}`}
                workspaceType="manage"
                infoWorkspace={item}
              />
            )
          })}
        </Carousel>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default WorkspaceSlide

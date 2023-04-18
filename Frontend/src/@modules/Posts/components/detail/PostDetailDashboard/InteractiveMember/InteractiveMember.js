// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { postApi } from "@modules/Posts/common/api"
import { useEffect } from "react"
import moment from "moment"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import HeaderComponent from "./HeaderComponent"
import TableComponent from "./TableComponent"

const InteractiveMember = (props) => {
  const {
    // ** props
    idPost
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    data: [],
    totalData: 0,
    filter: {
      page: 0,
      limit: 20,
      from: moment().subtract(1, "month"),
      to: moment(),
      type: "viewers"
    }
  })

  const setFilter = (obj) => {
    setState({
      filter: {
        ...state.filter,
        ...obj
      }
    })
  }

  const loadData = () => {
    setState({
      loading: true
    })

    const params = {
      ...state.filter,
      from: state.filter.from.format("YYYY-MM-DD"),
      to: state.filter.to.format("YYYY-MM-DD")
    }

    postApi
      .getPostInteractiveMember(idPost, params)
      .then((res) => {
        setTimeout(() => {
          setState({
            loading: false,
            data: res.data.data,
            totalData: res.data.total_data
          })
        }, 300)
      })
      .catch({
        loading: false,
        data: [],
        totalData: 0
      })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [state.filter])

  // ** render
  return (
    <Card className="interactive-member-section">
      <CardBody>
        <HeaderComponent filter={state.filter} setFilter={setFilter} />
        <TableComponent
          loading={state.loading}
          data={state.data}
          totalData={state.totalData}
          filter={state.filter}
          setFilter={setFilter}
        />
      </CardBody>
    </Card>
  )
}

export default InteractiveMember

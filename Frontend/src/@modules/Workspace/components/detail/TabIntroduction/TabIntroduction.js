// ** React Imports
import { useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { useParams } from "react-router-dom"
// ** Styles
import { Col, Row } from "reactstrap"
// ** Components
import Introduction from "./Introduction"
import GroupRule from "./GroupRule"
import WorkspaceInfo from "./WorkspaceInfo"
import EditGroupRuleModal from "../../modals/EditGroupRuleModal/EditGroupRuleModal"

const TabIntroduction = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    workspaceInfo: {},
    introduction: "",
    groupRule: [],
    modalEditGroupRule: false
  })

  const { id } = useParams()

  const setIntroduction = (data) => {
    setState({
      introduction: data
    })
  }

  const setGroupRule = (data, reset = false) => {
    if (reset) {
      setState({
        groupRule: data
      })
    } else {
      setState({
        groupRule: [...state.groupRule, data]
      })
    }
  }

  const toggleModalEditGroupRule = () => {
    setState({
      modalEditGroupRule: !state.modalEditGroupRule
    })
  }

  const loadData = () => {
    setState({
      loading: true
    })

    workspaceApi
      .getDetail(id)
      .then((res) => {
        setState({
          workspaceInfo: res.data,
          introduction: res.data?.introduction,
          groupRule:
            res.data?.group_rules === undefined ? [] : res.data?.group_rules,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          workspaceInfo: {},
          introduction: state.introduction,
          groupRule: state.groupRule,
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [])

  // ** render
  return (
    <div className="tab-introduction">
      <Row>
        <Col sm={8} className="col">
          <div>
            <Introduction
              id={id}
              loading={state.loading}
              workspaceInfo={state.workspaceInfo}
              introduction={state.introduction}
              setIntroduction={setIntroduction}
            />
          </div>
          <div>
            <GroupRule
              loading={state.loading}
              workspaceInfo={state.workspaceInfo}
              groupRule={state.groupRule}
              toggleModalEditGroupRule={toggleModalEditGroupRule}
              setGroupRule={setGroupRule}
            />
          </div>
        </Col>
        <Col sm={4} className="col">
          <WorkspaceInfo workspaceInfo={state.workspaceInfo} />
        </Col>
      </Row>

      <EditGroupRuleModal
        id={id}
        modal={state.modalEditGroupRule}
        groupRule={state.groupRule}
        handleModal={toggleModalEditGroupRule}
        setGroupRule={setGroupRule}
      />
    </div>
  )
}

export default TabIntroduction

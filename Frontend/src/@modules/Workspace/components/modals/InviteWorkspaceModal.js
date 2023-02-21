import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import React, { useEffect, useRef } from "react"
import { FormProvider, set, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
import { Radio, Space, Tabs } from "antd"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import "react-perfect-scrollbar/dist/css/styles.css"
import PerfectScrollbar from "react-perfect-scrollbar"
import Avatar from "@apps/modules/download/pages/Avatar"
import { ErpCheckbox, ErpInput } from "@apps/components/common/ErpField"
const InviteWorkspaceModal = (props) => {
  const {
    idCandidate,
    modal,
    handleModal,
    options,
    typeCoppy,
    dataDetail,
    handleDetail
  } = props
  const [state, setState] = useMergedState({
    loading: false,
    page: 1,
    search: "",
    members: [],
    departments: [],
    jobTitles: [],
    recordsTotal: [],
    perPage: 10
  })

  const arrFields = useSelector(
    (state) => state.app.modules["candidates"].metas
  )
  const optionsArr = useSelector(
    (state) => state.app.modules["candidates"].options
  )
  const onSubmit = (values) => {
    //  setState({ loading: true });
    const data = { ...values }
    data.id = idCandidate
    if (typeCoppy) {
      data.isCoppy = true
    }
    const currentJob = dataDetail.recruitment_proposal?.value
    const newJob = data.recruitment_proposal?.value
    if (currentJob === newJob) {
      notification.showError({
        text: useFormatMessage("modules.candidates.text.job_exist_email")
      })
      return
    }

    recruitmentsApi
      .checkExistJob({
        id: idCandidate,
        job: values.recruitment_proposal?.value
      })
      .then((res) => {
        recruitmentsApi
          .saveCandidate(data)
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
            handleModal()
            if (!typeCoppy) {
              dataDetail.recruitment_proposal = data.recruitment_proposal
            }

            setState({
              loading: false
            })
            loadData()
            handleDetail({ id: idCandidate }, true)
          })
          .catch((err) => {
            setState({ loading: false })
            notification.showError({
              text: useFormatMessage("notification.save.error")
            })
          })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("modules.candidates.text.job_exist_email")
        })
      })
  }
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  const renderMember = (data = []) => {
    return data.map((item) => {
      return (
        <Col sm={12} key={item.id}>
          <div className="box-member d-flex">
            <Avatar src={item.avatar} className="me-50" />
            <div className="title">{item.full_name}</div>
            <div className="ms-auto">
              <ErpCheckbox />
            </div>
          </div>
        </Col>
      )
    })
  }
  const itemTab = () => {
    const arr = [
      {
        label: (
          <div className="text-center">
            <i class="fa-solid fa-user-group"></i>
            <p>Member</p>
          </div>
        ),
        key: 1,
        children: (
          <div className="d-flex ">
            <div className="content-select">
              <div className="title-tab-content mb-1">List member</div>
              <Row>
                <Col>
                  <ErpInput
                    nolabel
                    prepend={<i className="fa-regular fa-magnifying-glass"></i>}
                    onChange={(e) => handleFilterText(e.target.value)}
                  />
                </Col>
              </Row>
              <PerfectScrollbar
                onYReachEnd={() => endScrollLoad()}
                style={{
                  maxHeight: "400px",
                  minHeight: "50px"
                }}>
                <Row className="w-100">{renderMember(state.members)}</Row>
              </PerfectScrollbar>
            </div>

            <div className="content-selected">
              <span className="title-tab-content">List selected</span>
            </div>
          </div>
        )
      },
      {
        label: (
          <div className="text-center">
            <i className="fa-duotone fa-sitemap"></i>
            <p>Department</p>
          </div>
        ),
        key: 2,
        children: <div>123123123123</div>
      },
      {
        label: (
          <div className="text-center">
            <i className="fa-light fa-briefcase"></i>
            <p>Job title</p>
          </div>
        ),
        key: 3
      },
      {
        label: (
          <div className="text-center">
            <i className="fa-light fa-file-excel"></i>
            <p>Excel</p>
          </div>
        ),
        key: 4,
        children: "Excel"
      }
    ]
    return arr
  }

  const loadData = (props) => {
    defaultModuleApi.getUsers(props).then((res) => {
      console.log("res", res)
      const members = state.members
      const concat = !props.search
        ? members.concat(res.data.results)
        : res.data.results
      console.log("concat", props)
      setState({
        members: concat,
        page: res.data.page,
        recordsTotal: res.data.recordsTotal,
        perPage: res.data.recordsFiltered,
        ...props
      })
    })
  }
  const endScrollLoad = () => {
    const page = state.page + 1
    console.log("page", state)
    if (state.recordsTotal > state.members.length) {
      loadData({ page: page, search: state.search })
    }
  }

  const typingTimeoutRef = useRef(null)
  const handleFilterText = (e) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      loadData({ search: e, page: 1 })
    }, 500)
  }

  useEffect(() => {
    loadData({ page: state.page, search: state.search })
  }, [])

  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="invite-workspace-modal"
      size="lg"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.candidates.text.assign_job")}
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-1">
            <Col sm={12}>
              <Tabs tabPosition={"left"} items={itemTab()} />
            </Col>
          </Row>
        </ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalFooter>
            <Button
              type="submit"
              color="primary"
              disabled={state.loading}
              className="ms-auto mr-2">
              {state.loading && <Spinner size="sm" className="mr-50 mr-1" />}
              {useFormatMessage("modules.candidates.button.assign")}
            </Button>
            <Button
              className="btn-cancel"
              color="flat-danger"
              onClick={() => handleModal(false)}>
              {useFormatMessage("button.cancel")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default InviteWorkspaceModal

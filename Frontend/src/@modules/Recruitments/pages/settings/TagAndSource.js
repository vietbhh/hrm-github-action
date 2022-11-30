import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import TagSourceModal from "@modules/Recruitments/components/modals/TagSourceModal"
import { Dropdown, Menu, Tabs } from "antd"
import { useEffect } from "react"
import { Button, Col, Row } from "reactstrap"
import { recruitmentsApi } from "../../common/api"
import RecruitmentSettingLayout from "./RecruitmentSettingLayout"
const { TabPane } = Tabs

const TagAndSource = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    listTag: [],
    listSource: [],
    modal: false,
    tab: "tags",
    dataEdit: ""
  })
  const loadData = () => {
    recruitmentsApi.getTagSource().then((res) => {
      setState({ listTag: res.data.tags, listSource: res.data.sources })
    })
  }
  useEffect(() => {
    loadData()
  }, [])

  const items = [
    {
      label: (
        <div onClick={() => setState({ dataEdit: item, modal: true })}>
          {useFormatMessage("button.edit")}
        </div>
      ),
      key: "btn_edit"
    },
    {
      label: (
        <div onClick={() => deleteTS(item.id)}>
          {useFormatMessage("button.delete")}
        </div>
      ),
      key: "btn_delete"
    }
  ]

  const renderCard = (list) => {
    return list.map((item) => {
      return (
        <Col sm={4} key={item.id}>
          <div className="box">
            <div className="tag-name d-flex">
              {item.title}
              <Dropdown
                menu={{ items }}
                placement="bottomRight"
                overlayClassName="drop_workschedule"
                className="ms-auto">
                <Button className="p-50" color="flat-primary">
                  <i className="fa-light fa-ellipsis"></i>
                </Button>
              </Dropdown>
            </div>
            <div className="candidate-total mt-50">
              {item.total}{" "}
              {useFormatMessage("modules.recruitments.text.candidates")}
            </div>
          </div>
        </Col>
      )
    })
  }
  const deleteTS = (idDel) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        defaultModuleApi
          .delete(state.tab, idDel)
          .then((result) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })
            loadData()
          })
          .catch((err) => {
            notification.showError({
              text: err.message
            })
          })
      }
    })
  }
  const handleModal = () => {
    setState({ modal: !state.modal, dataEdit: "" })
  }

  const itemsTab = [
    {
      label: useFormatMessage("modules.recruitments.text.tags"),
      key: "tab-tags",
      children: (
        <Row>
          <Col sm={4}>
            <div className="box box-add" onClick={() => handleModal()}>
              <div>
                <i className="fa-duotone fa-circle-plus"></i>
              </div>
              <div className="mt-50">
                {useFormatMessage("modules.recruitments.text.new_tag")}
              </div>
            </div>
          </Col>
          {renderCard(state.listTag)}
        </Row>
      )
    },
    {
      label: useFormatMessage("modules.recruitments.text.sources"),
      key: "tab-sources",
      children: (
        <Row>
          <Col sm={4}>
            <div className="box box-add" onClick={() => handleModal()}>
              <div>
                <i className="fa-duotone fa-circle-plus"></i>
              </div>
              <div className="mt-50">
                {useFormatMessage("modules.recruitments.text.new_source")}
              </div>
            </div>
          </Col>
          {renderCard(state.listSource)}
        </Row>
      )
    }
  ]
  return (
    <RecruitmentSettingLayout
      breadcrumbs={
        <Breadcrumbs
          list={[
            { title: useFormatMessage("menu.recruitments") },
            {
              title: useFormatMessage("menu.settings")
            },
            { title: useFormatMessage("modules.recruitments.text.tag_n_soure") }
          ]}
        />
      }>
      <Tabs items={itemsTab} />

      <TagSourceModal
        modal={state.modal}
        handleModal={handleModal}
        loadData={loadData}
        tab={state.tab}
        dataEdit={state.dataEdit}
      />
    </RecruitmentSettingLayout>
  )
}

export default TagAndSource

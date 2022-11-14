import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import { FormLoader } from "@apps/components/spinner/FormLoader"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import { useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Button, CardTitle, Col, Row } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { payrollsSettingApi } from "../../common/api"
import CardRecurring from "../../components/settings/CardRecurring"
import PayCyclesLayout from "./PayCyclesLayout"
const Compensation = (props) => {
  // ** Props
  const modules = useSelector((state) => state.app.modules.attendance_setting)
  const module = modules.config
  const moduleName = module.name
  const ability = useContext(AbilityContext)
  const [state, setState] = useMergedState({
    dataList: [],
    isEdit: false,
    dataEdit: {},
    loading: false
  })
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setState({ loading: true })
    payrollsSettingApi.loadRecurring().then((res) => {
      setState({
        dataList: res.data.results
      })
      setState({ loading: false })
    })
  }

  const history = useNavigate()

  const handleEdit = (id) => {
    history("/payrolls/settings/compensation/" + id)
  }

  const handleDelete = (id) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        payrollsSettingApi
          .deleteRecurring(id)
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

  const renderRecurring = () => {
    if (!state.dataList.length) {
      return (
        <Col sm={12}>
          <EmptyContent />
        </Col>
      )
    }
    return state.dataList?.map((item) => {
      return (
        <Col sm={6} key={item.id}>
          <CardRecurring
            item={item}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </Col>
      )
    })
  }

  const addBtn = ability.can("accessPayrollsSetting", "payrolls") ? (
    <Link exact={"true"} to={"/payrolls/settings/compensation/add"}>
      <Button.Ripple color="primary">
        <i className="icpega Actions-Plus"></i> &nbsp;
        <span className="align-self-center">
          {useFormatMessage("modules.recurring.button.add")}
        </span>
      </Button.Ripple>
    </Link>
  ) : (
    ""
  )
  return (
    <>
      <PayCyclesLayout
        breadcrumbs={
          <Breadcrumbs
            list={[
              {
                title: useFormatMessage("menu.payrolls")
              },
              {
                title: useFormatMessage("menu.settings")
              },
              {
                title: useFormatMessage("modules.pay_cycles.text.compensation")
              }
            ]}
            custom={addBtn}
          />
        }>
        <Row>
          <Col sm={12}>
            {!state.isEdit && (
              <CardTitle tag="h4">
                <Button.Ripple
                  tag="span"
                  className="btn-icon rounded-circle "
                  color="primary">
                  <i className="fal fa-recycle"></i>
                </Button.Ripple>{" "}
                <span className="title-card">
                  {useFormatMessage("modules.recurring.title")}
                </span>
              </CardTitle>
            )}
            {state.loading && <FormLoader />}
            {!state.loading && <Row>{!state.loading && renderRecurring()}</Row>}
          </Col>
        </Row>
      </PayCyclesLayout>
    </>
  )
}

export default Compensation

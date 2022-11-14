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
import CardCycle from "../../components/settings/CardCycle"
import PayCyclesLayout from "./PayCyclesLayout"
const Paycles = (props) => {
  // ** Props

  const settings = useSelector((state) => state.auth.settings)
  const canCreate = settings.create_new_pay_cycle
  const modules = useSelector((state) => state.app.modules.attendance_setting)
  const module = modules.config
  const moduleName = module.name
  const ability = useContext(AbilityContext)
  const [state, setState] = useMergedState({
    dataList: [],
    dataEdit: {},
    loading: false
  })

  const history = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setState({ loading: true })
    payrollsSettingApi.loadData().then((res) => {
      setState({
        dataList: res.data.results
      })
      setState({ loading: false })
    })
  }

  const handleEdit = (id) => {
    history("/payrolls/settings/pay-cycles/" + id)
  }
  const handleDelete = (itemDelete) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        payrollsSettingApi
          .delete(itemDelete)
          .then((result) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })
            loadData()
          })
          .catch((err) => {
            SwAlert.showError({
              text: useFormatMessage(
                "modules.pay_cycles.text.employee_in_cycle",
                { number_employee: err.response.data.messages.error }
              ),
              title: useFormatMessage("modules.pay_cycles.text.can_not_delete")
            })
          })
      }
    })
  }
  const renderPayCycles = () => {
    if (!state.dataList.length) {
      return (
        <Col sm={12}>
          <EmptyContent />
        </Col>
      )
    }
    return state.dataList?.map((item) => {
      return (
        <Col sm={12} key={item.id}>
          <CardCycle
            item={item}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            canCreate={canCreate}
          />
        </Col>
      )
    })
  }

  const addBtn =
    ability.can("add", moduleName) && canCreate ? (
      <Link exact={"true"} to={"/payrolls/settings/pay-cycles/add"}>
        <Button.Ripple color="primary">
          <i className="icpega Actions-Plus"></i> &nbsp;
          <span className="align-self-center">
            {useFormatMessage("modules.pay_cycles.button.add")}
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
                title: useFormatMessage("menu.pay_cycles")
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
                  <i className="fal fal fa-sync"></i>
                </Button.Ripple>{" "}
                <span className="title-card">
                  {useFormatMessage("menu.pay_cycles")}
                </span>
              </CardTitle>
            )}

            {state.loading && <FormLoader />}
            {!state.loading && (
              <Row className="mt-1">{!state.loading && renderPayCycles()}</Row>
            )}
          </Col>
        </Row>
      </PayCyclesLayout>
    </>
  )
}

export default Paycles

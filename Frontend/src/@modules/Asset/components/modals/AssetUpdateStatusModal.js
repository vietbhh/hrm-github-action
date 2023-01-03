import { ErpSelect } from "@apps/components/common/ErpField"
import {
  getOptionValue,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { assetApi } from "@modules/Asset/common/api"
import { map } from "lodash-es"
import { useContext, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
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
import { AbilityContext } from "utility/context/Can"
const AssetUpdateStatusModal = (props) => {
  const { modal, dataDetail, handleDetail, loadData } = props
  const ability = useContext(AbilityContext)
  const [state, setState] = useMergedState({
    readOnly: true,
    saving: false,
    loading: false,
    averageStar: 0,
    loadingStar: modal,
    optionStt: [],
    modalAssign: false,
    currentJob: "",
    typeCoppy: false
  })
  const arrFields = useSelector(
    (state) => state.app.modules["asset_history"].metas
  )
  const options = useSelector(
    (state) => state.app.modules["asset_history"].options
  )

  const onSubmitFrm = (values) => {
    values.asset_code = dataDetail?.id
    values.type = getOptionValue(options, "type", "other")
    values.status_current = dataDetail?.asset_status?.value

    assetApi.updateSTT(values).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      handleDetail("")
      loadData()
    })
  }

  const methods = useForm({
    mode: "onSubmit"
  })

  const { handleSubmit, errors, control, register, reset, setValue } = methods

  const cancelUpdate = () => {
    setState({
      readOnly: true,
      saving: false
    })
  }
  const loadStatus = () => {
    defaultModuleApi.getList("asset_status").then((res) => {
      const data = res.data.results
      const arrSTT = []
      map(data, (value, index) => {
        if (
          value?.status_code === "normal" ||
          value?.status_code === "broken" ||
          value?.status_code === "repair"
        ) {
          const obj = {
            value: value?.id,
            label: value?.status_name
          }
          arrSTT.push(obj)
        }
      })
      setState({ optionStt: arrSTT })
    })
  }
  useEffect(() => {
    loadStatus()
  }, [])
  return (
    <>
      <Modal
        isOpen={modal}
        toggle={() => handleDetail("")}
        backdrop={"static"}
        size="sm"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleDetail("")}>
          <span className="title-icon align-self-center">
            <i className="fa-regular fa-circle-info"></i>
          </span>{" "}
          <span className="ms-50">
            {useFormatMessage("modules.asset_lists.title.update_stt")}
          </span>
        </ModalHeader>
        <ModalBody>
          <Row className="mt-2">
            <Col sm={12} className="mb-1">
              <div className="div-tab-content">
                <FormProvider {...methods}>
                  <Row>
                    <Col lg={12} className="mb-1">
                      <ErpSelect
                        options={state?.optionStt}
                        isClearable={false}
                        label={useFormatMessage(
                          "modules.asset_lists.fields.asset_status"
                        )}
                        required
                        useForm={methods}
                        name={"status_change"}
                      />
                      <FieldHandle
                        updateDataId={dataDetail?.id}
                        label={useFormatMessage(
                          "modules.asset_history.fields." +
                            arrFields?.notes?.field
                        )}
                        required
                        fieldData={arrFields.notes}
                        module="notes"
                        useForm={methods}
                        options
                      />
                    </Col>
                    <Col lg={12} className="mb-1">
                      <FieldHandle
                        updateDataId={dataDetail?.id}
                        label={useFormatMessage(
                          "modules.asset_history.fields." +
                            arrFields?.history_image?.field
                        )}
                        fieldData={arrFields.history_image}
                        useForm={methods}
                      />
                    </Col>
                    <Col lg={12} className="mb-1">
                      <FieldHandle
                        updateDataId={dataDetail?.id}
                        label={useFormatMessage(
                          "modules.asset_history.fields." +
                            arrFields?.history_files?.field
                        )}
                        fieldData={arrFields.history_files}
                        useForm={methods}
                      />
                    </Col>
                    <Col sm={12}>
                      <div className="row pt-2">
                        <form
                          className="col-12 text-center"
                          onSubmit={handleSubmit(onSubmitFrm)}>
                          <Button
                            type="submit"
                            color="primary"
                            className="btn-next me-2"
                            disabled={state.saving}>
                            <span className="align-middle d-sm-inline-block d-none">
                              {state.saving && (
                                <Spinner size="sm" className="mr-50" />
                              )}
                              {useFormatMessage("button.save")}
                            </span>
                          </Button>

                          <Button.Ripple
                            type="button"
                            className="btn-cancel"
                            onClick={() => handleDetail("")}
                            disabled={state.saving}>
                            <span className="align-middle d-sm-inline-block d-none">
                              {useFormatMessage("button.cancel")}
                            </span>
                          </Button.Ripple>
                        </form>
                      </div>
                    </Col>
                  </Row>
                </FormProvider>
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </>
  )
}
export default AssetUpdateStatusModal

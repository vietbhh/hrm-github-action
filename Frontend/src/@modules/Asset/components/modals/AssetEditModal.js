import { ErpUserSelect } from "@apps/components/common/ErpField"
import {
  sortFieldsDisplay,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { isArray } from "@apps/utility/handleData"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { assetApi } from "@modules/Asset/common/api"
import { toArray } from "lodash-es"
import moment from "moment"
import { Fragment, useContext } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import {
  Alert,
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
const AssetEditModal = (props) => {
  const {
    modal,
    isDuplicateAsset,
    options,
    dataDetail,
    handleDetail,
    loadData
  } = props
  const ability = useContext(AbilityContext)
  const [state, setState] = useMergedState({
    readOnly: true,
    saving: false,
    loading: false,
    averageStar: 0,
    loadingStar: modal,
    dataReviews: [],
    modalAssign: false,
    currentJob: "",
    typeChange: false
  })
  const arrFields = useSelector(
    (state) => state.app.modules["asset_lists"].metas
  )
  const optionsArr = useSelector(
    (state) => state.app.modules["asset_lists"].options
  )

  const onSubmitFrm = (values) => {
    setState({ saving: true })
    if (dataDetail.id) {
      values.id = dataDetail.id
      values.is_duplicate = isDuplicateAsset
    }
    assetApi.addAsset(values).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      setState({ saving: false })
      handleDetail("")
      loadData()
    })
  }

  const methods = useForm({
    mode: "onSubmit"
  })

  const dataFields = isArray(arrFields) ? arrFields : toArray(arrFields)
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  return (
    <>
      <Modal
        isOpen={modal}
        toggle={() => handleDetail("")}
        backdrop={"static"}
        className="modal-asset"
        size="lg"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleDetail("")}>
          <span className="title-icon align-self-center">
            <i className="fa-regular fa-circle-info"></i>
          </span>{" "}
          <span className="ms-50">
            {dataDetail?.id
              ? isDuplicateAsset
                ? useFormatMessage("modules.asset_lists.title.duplicate")
                : useFormatMessage("modules.asset_lists.title.edit")
              : useFormatMessage("modules.asset_lists.title.new")}
          </span>
        </ModalHeader>
        <ModalBody>
          <Row className="mt-2">
            <Col sm={12} className="mb-1">
              <div className="div-tab-content">
                <FormProvider {...methods}>
                  <Row>
                    {(!dataDetail?.id || isDuplicateAsset) && (
                      <Col lg={6}>
                        <ErpUserSelect
                          label="Owner"
                          name="owner"
                          required
                          readOnly={dataDetail?.id && !isDuplicateAsset}
                          defaultValue={dataDetail?.id && isDuplicateAsset ? dataDetail?.owner : ""}
                          useForm={methods}
                        />
                      </Col>
                    )}

                    {dataFields
                      .filter(
                        (field) => field.field_form_show && field.field_enable
                      )
                      .sort((a, b) => {
                        return sortFieldsDisplay(a, b)
                      })
                      .map((field, key) => {
                        const options = optionsArr
                        const fieldAuth = { ...field }
                        const nameField = field.field
                        let updateDataValue = ""
                        if (
                          (nameField === "asset_code" ||
                            nameField === "asset_status") &&
                          dataDetail?.id
                        ) {
                          return ""
                        }
                        if (nameField === "asset_status") {
                          return ""
                        }
                        if (
                          nameField === "asset_code" ||
                          nameField === "asset_status"
                        ) {
                          fieldAuth.field_readonly = true
                        }
                        if (nameField === "date_created" && !dataDetail?.id) {
                          fieldAuth.field_default_value = moment()
                        }
                        if (nameField === "date_created" && (dataDetail?.id && !isDuplicateAsset)) {
                          fieldAuth.field_readonly = true
                          return ""
                        }
                        if (
                          nameField === "recent_image" &&
                          isDuplicateAsset === true
                        ) {
                          updateDataValue = {}
                        } else {
                          updateDataValue = dataDetail?.[field.field]
                        }

                        const fieldProps = {
                          module: "asset_lists",
                          fieldData: fieldAuth,
                          useForm: methods,
                          options
                        }
                        return (
                          <Col
                            lg={field.field_form_col_size}
                            className="mb-1"
                            key={key}>
                            <Fragment>
                              <FieldHandle
                                updateDataId={dataDetail?.id}
                                label={useFormatMessage(
                                  "modules.asset_lists.fields." + field.field
                                )}
                                updateData={updateDataValue}
                                {...fieldProps}
                              />
                            </Fragment>
                          </Col>
                        )
                      })}
                    {(dataDetail?.id && !isDuplicateAsset) && (
                      <Col sm={12}>
                        <Alert color="warning">
                          {" "}
                          <div className="alert-body">
                            <span>
                              Changing the Asset type will generate a new Asset
                              code
                            </span>
                          </div>
                        </Alert>
                      </Col>
                    )}

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
                                <Spinner size="sm" className="me-50" />
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
export default AssetEditModal

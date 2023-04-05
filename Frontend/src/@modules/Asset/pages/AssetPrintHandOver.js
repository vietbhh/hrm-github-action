import { ErpUserSelect } from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import React, { Fragment } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import "../assets/scss/print_hand_over.scss"
import { assetPrintHandOverApi } from "../common/api"
import notification from "@apps/utility/notification"

const AssetPrintHandOver = () => {
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods

  // ** function
  const onSubmit = (value) => {
    console.log(value)
    const params = { employee: value.employee }
    assetPrintHandOverApi
      .postExportWord(params)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `bien_ban_ban_giao.doc`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
      })
  }

  return (
    <Fragment>
      <Card className="print-hand-over">
        <CardHeader>
          <span className="title">
            {useFormatMessage("menu.asset.asset_print_hand_over")}
          </span>
        </CardHeader>
        <CardBody>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col xs="12" sm="6">
                  <ErpUserSelect
                    isMulti={true}
                    label={useFormatMessage("common.employee")}
                    required
                    useForm={methods}
                    name={"employee"}
                    placeholder={useFormatMessage("common.employee")}
                  />
                </Col>
                <Col xs="12" sm="6">
                  <Button.Ripple
                    type="submit"
                    color="primary"
                    size="sm"
                    className="btn-export-word">
                    {useFormatMessage(
                      "modules.asset.print_hand_over.text.export_word"
                    )}
                  </Button.Ripple>
                </Col>
              </Row>
            </form>
          </FormProvider>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default AssetPrintHandOver

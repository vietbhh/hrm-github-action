// ** React Imports
import { Fragment } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useFormatMessage } from "@apps/utility/common"
// ** node
import { axiosNodeApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import { ErpFileUpload, ErpInput } from "@apps/components/common/ErpField"
import DownloadFile from "../download/pages/DownloadFile"
import Photo from "../download/pages/Photo"

const TestUploadService = (props) => {
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods

  const onSubmit = (values) => {
    axiosNodeApi.post("/test3", serialize(_.cloneDeep(values))).then((res) => {
      console.log(res)
    })

    /*axiosNodeApi.post("/test-copy").then((res) => {
      console.log(res)
    })*/
  }

  const handleClickDownload = () => {
    axiosNodeApi
      .get("/download/file/?name=/feed/post/health.png")
      .then((res) => {
        console.log(res)
      })
  }

  const handleClickCopy = () => {
    axiosNodeApi.post("/test4").then((res) => {})
  }

  // ** render
  return (
    <Fragment>
      <FormProvider {...methods}>
        <ErpInput name="nameInpt" useForm={methods} />
        <ErpFileUpload name="fileTest[]" useForm={methods} multiple />
      </FormProvider>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button type="submit" color="primary" className="me-1">
          {useFormatMessage("app.save")}
        </Button>
        <Button
          type="button"
          color="primary"
          className="me-1"
          onClick={() => handleClickDownload()}>
          Download
        </Button>
        <Button type="button" color="primary" onClick={() => handleClickCopy()}>
          Copy to GCS
        </Button>
        <DownloadFile
          className="align-items-center"
          fileName="matthias_helvar_by_noukette_dbys4l7-fullview--1-.jpg"
          downloadFromStorage={false}
          src="modules/feed/matthias_helvar_by_noukette_dbys4l7-fullview--1-.jpg"
          >
          <Button type="button" color="primary">
            Download File
          </Button>
        </DownloadFile>
      </form>
    </Fragment>
  )
}

export default TestUploadService

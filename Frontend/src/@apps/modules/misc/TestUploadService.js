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
          onClick={() => handleClickDownload()}>
          Download
        </Button>
        <DownloadFile
          className="align-items-center"
          fileName="health.png"
          src="feed/post/health.png">
          <Button type="button" color="primary">
            Download File
          </Button>
        </DownloadFile>
      </form>
    </Fragment>
  )
}

export default TestUploadService

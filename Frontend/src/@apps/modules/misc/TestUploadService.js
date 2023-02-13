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

const TestUploadService = (props) => {
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods

  const onSubmit = (values) => {
    axiosNodeApi.post("/test3", serialize(_.cloneDeep(values))).then((res) => {
      console.log(res)
    })
  }

  const handleClickDownload = () => {
    axiosNodeApi
      .post("/test3/download", {
        filePath:
          "feed/post/17632020_1526765197334119_8163469679471153797_o.jpg"
      })
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
          fileName="17632020_1526765197334119_8163469679471153797_o.jpg"
          src="feed/post/17632020_1526765197334119_8163469679471153797_o.jpg">
          <Button type="button" color="primary">
            Download File
          </Button>
        </DownloadFile>
      </form>
    </Fragment>
  )
}

export default TestUploadService

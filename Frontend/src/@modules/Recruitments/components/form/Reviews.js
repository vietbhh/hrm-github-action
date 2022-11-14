import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { validateFile } from "@apps/utility/validate"
import { isEmpty } from "lodash"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux"
import { Badge, Button, Col, Spinner } from "reactstrap"
import { AbilityContext } from "utility/context/Can"

const Reviews = (props) => {
  const {
    options,
    dataDetail,
    idEdit,
    contentEdit,
    starEdit,
    CancelEdit,
    loadData,
    files
  } = props
  const module = "candidate_reviews"
  const ability = useContext(AbilityContext)
  const [state, setState] = useMergedState({
    readOnly: true,
    saving: false,
    rating: starEdit || 0,
    dataReviews: [],
    files: [],
    countRate: 0,
    inputRV: ""
  })
  const ratingChanged = (newRating) => {
    setState({ rating: newRating })
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods
  const onSubmit = (values) => {
    if (state.rating === 0)
      return notification.showError({
        text: useFormatMessage(
          "modules.candidate_reviews.notification.not_rating"
        )
      })
    setState({
      saving: true
    })
    values.files = state.files
    values.rating = state.rating
    values.candidate_id = dataDetail.id
    if (idEdit) {
      values.id = idEdit
    }

    defaultModuleApi
      .postSave(module, values)
      .then((res) => {
        notification.showSuccess(useFormatMessage("notification.save.success"))
        reset()
        loadData()
        if (idEdit) CancelEdit()
        setState({
          saving: false,
          files: [],
          rating: 0
        })
      })
      .catch((err) => {
        setState({
          saving: false
        })
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }

  const fieldReviews = {
    module: "candidate_reviews",
    fieldData: useSelector(
      (state) => state.app.modules["candidate_reviews"].metas.reviews
    ),
    options,
    useForm: methods
  }
  const inputFiles = useRef()

  const selectFiles = (e) => {
    if (inputFiles.current) {
      inputFiles.current.click()
    }
  }

  const handleFiles = (file) => {
    if (validateFile(file)) {
      const result = Object.keys(file).map((key) => file[key])
      const stateFiles = result
      const arrCC = stateFiles.concat(state.files)
      setState({ files: arrCC })
    }
  }
  const deleteFile = (i) => {
    const result = Object.keys(state.files).map((key) => state.files[key])
    result.splice(i, 1)
    setState({ files: result })
  }
  const RenderFilesTamj = (props) => {
    const { dataFiles } = props
    return (
      <Fragment>
        {!isEmpty(dataFiles) &&
          Object.keys(dataFiles).map((keyName, i) => {
            const files = dataFiles[i]
            return (
              <Fragment key={keyName}>
                <Badge color="light-secondary" className="mt-50 ms-1 file-name">
                  {files.name ? files.name : files}
                  <i
                    className="fad fa-times-circle"
                    onClick={() => deleteFile(i)}></i>
                </Badge>
              </Fragment>
            )
          })}
      </Fragment>
    )
  }

  useEffect(() => {
    if (idEdit) {
      const arrF = []
      files.map((e) => {
        arrF.push(e.fileName)
      })
      setState({ files: arrF })
    }
  }, [idEdit])
  return (
    <Fragment>
      {ability.can("add", module) && (
        <form className="row form-reviews" onSubmit={handleSubmit(onSubmit)}>
          <Col sm={12}>
            <Fragment>
              <FieldHandle
                nolabel
                rows="4"
                label={useFormatMessage(
                  "modules.candidates.fields.candidate_note"
                )}
                {...fieldReviews}
                placeholder="...."
                updateData={!isEmpty(contentEdit) ? contentEdit : ""}
              />
            </Fragment>
          </Col>
          <input
            id="files"
            name="files"
            type="file"
            ref={inputFiles}
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="d-none"
          />

          <Col sm="12" className="d-flex">
            <h4>
              {useFormatMessage("modules.candidate_reviews.fields.rating")}
            </h4>
            <div className="ms-2">
              <ReactStars
                className="ms-2"
                isHalf={true}
                size={20}
                value={state.rating}
                key={"startAdd_" + Math.random()}
                onChange={ratingChanged}
                emptyIcon={<i className="far fa-star" />}
                halfIcon={<i className="fa fa-star-half-alt" />}
                filledIcon={<i className="fa fa-star" />}
                color="#f9d324"
                activeColor="#f9d324"
              />
            </div>

            <Button.Ripple
              type="submit"
              color="primary"
              className="btn-next me-1 ms-auto"
              disabled={false}>
              <span className="align-middle d-sm-inline-block d-none">
                {state.saving && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("button.save")}
              </span>
            </Button.Ripple>
            {contentEdit && (
              <Button.Ripple
                type="button"
                className="btn-cancel"
                onClick={CancelEdit}>
                <span className="align-middle d-sm-inline-block d-none">
                  {useFormatMessage("button.cancel")}
                </span>
              </Button.Ripple>
            )}
            <Button.Ripple
              type="button"
              className="btn-next ms-auto"
              onClick={selectFiles}>
              <span className="align-middle d-sm-inline-block d-none">
                {useFormatMessage("file.fileSelect")}
              </span>
            </Button.Ripple>
          </Col>
          <Col sm="12" className="d-flex justify-content-end">
            <RenderFilesTamj dataFiles={state.files} />
          </Col>
        </form>
      )}
    </Fragment>
  )
}

export default Reviews

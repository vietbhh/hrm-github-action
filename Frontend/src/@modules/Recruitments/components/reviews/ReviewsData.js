import { FormHorizontalLoader } from "@apps/components/spinner/FormLoader"
import Avatar from "@apps/modules/download/pages/Avatar"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"
import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { isEmpty } from "lodash"
import { Fragment } from "react"
import ReactStars from "react-rating-stars-component"
import { Badge, Button, Col } from "reactstrap"
import Reviews from "../form/Reviews"
import SwAlert from "@apps/utility/SwAlert"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { useSelector } from "react-redux"
const ReviewsData = (props) => {
  const { dataReviews, loading, idEdit, loadData } = props
  const userData = useSelector((state) => state.auth.userData)
  const [state, setState] = useMergedState({
    idEdit: 0
  })

  if (loading) {
    return <FormHorizontalLoader rows={4} />
  }
  const RenderFiles = (props) => {
    const { dataFiles } = props
    return (
      <Fragment>
        {!isEmpty(dataFiles) &&
          dataFiles.map((field, key) => {
            return (
              <Fragment key={`file_` + key}>
                <Badge color="light-secondary" className="mt-50 ms-1">
                  <DownloadFile fileName={field.fileName} src={field.url}>
                    <i className="far fa-paperclip"></i> {field.fileName}
                  </DownloadFile>
                </Badge>
              </Fragment>
            )
          })}
      </Fragment>
    )
  }
  const CancelEdit = () => {
    setState({ idEdit: 0 })
  }
  const deleteReview = (idDelete) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        defaultModuleApi
          .delete("candidate_reviews", idDelete)
          .then((result) => {
            loadData()
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })
          })
          .catch((err) => {
            notification.showError({
              text: err.message
            })
          })
      }
    })
  }
  return (
    <Fragment>
      {!isEmpty(dataReviews) &&
        dataReviews.map((field, key) => {
          const starValue = field.rating * 1 || 0
          let Ele
          const idCandidate = { id: field.candidate_id.value }
          const ownerRV = field.owner.value
          if (state.idEdit && state.idEdit === field.id) {
            Ele = (
              <Reviews
                loadData={loadData}
                dataDetail={idCandidate}
                idEdit={field.id}
                contentEdit={field.reviews}
                starEdit={starValue}
                files={field.files}
                CancelEdit={CancelEdit}
              />
            )
          } else {
            Ele = (
              <div key={`reviews` + field.id}>
                <div className="content-review">{field.reviews}</div>
                <div className="files-review mt-1">
                  <RenderFiles dataFiles={field.files} />
                </div>
                <div className="bottom-review mt-1">
                  {timeDifference(field.created_at)}
                  {ownerRV === userData.id && (
                    <>
                      <Button.Ripple
                        color="flat-secondary"
                        className="ms-1"
                        onClick={() => {
                          setState({ idEdit: field.id })
                        }}>
                        {useFormatMessage("button.edit")}
                      </Button.Ripple>
                      <Button.Ripple
                        color="flat-secondary"
                        onClick={() => deleteReview(field.id)}>
                        {useFormatMessage("button.delete")}
                      </Button.Ripple>
                    </>
                  )}
                </div>
              </div>
            )
          }
          return (
            <Fragment key={key}>
              <Col md={12}>
                <div className="reviewer mt-2">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle">
                      <Avatar className="avatar-review rounded-circle" />
                    </div>
                    <div className="name-review ms-1">
                      {field.created_by.label}
                    </div>
                    <div className="rating-review ms-1">
                      <ReactStars
                        className="ms-2"
                        isHalf={true}
                        value={starValue}
                        key={Math.random()}
                        edit={false}
                        size={12}
                        emptyIcon={<i className="far fa-star" />}
                        halfIcon={<i className="fa fa-star-half-alt" />}
                        filledIcon={<i className="fa fa-star" />}
                        color="#f9d324"
                        activeColor="#f9d324"
                      />
                    </div>
                  </div>
                  {Ele}
                  <hr />
                </div>
              </Col>
            </Fragment>
          )
        })}
    </Fragment>
  )
}

export default ReviewsData

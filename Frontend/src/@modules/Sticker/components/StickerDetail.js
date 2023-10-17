import { Row, Col, Grid } from "rsuite"
import { CheckCircleTwoTone } from "@ant-design/icons"
import PhotoPublic from "@apps/modules/download/pages/PhotoPublic"
import { Fragment, useEffect } from "react"
import classNames from "classnames"
import StickerModalFooter from "./modals/StickerModalFooter"
import { stickerApi } from "../common/api"
import notification from "@apps/utility/notification"
import { useFormatMessage } from "@apps/utility/common"

export default function StickerDetail({ state, setState, onDelete }) {
  const handleChangeStickerDefault = (stickerId, id) => {
    stickerApi.updateStatus(stickerId, id).then((data) => {
      const newStickerList = [...state.stickerList]

      const stickerChange = state.stickerList.find((item) => {
        return item.id == data.data.id
      })

      newStickerList.splice(newStickerList.indexOf(stickerChange), 1, data.data)

      setState({
        stickerDetail: data.data,
        stickerList: newStickerList
      })

      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
    })
  }
  return (
    <Fragment>
      <div className="sticker-images" id={state.stickerDetail.id}>
        <Grid fluid>
          <Row>
            {state.stickerDetail.list.map((item, index) => (
              <Col key={"img-sticker" + index} lg={8} xs={24}>
                <div>
                  {item.default === true && (
                    <CheckCircleTwoTone
                      twoToneColor="#52c41a"
                      className="sticker-icon-detail"
                      style={{ zIndex: 1 }}
                    />
                  )}
                  {state.stickerDetail.name !== "sticker_default" ? (
                    <PhotoPublic
                      className="img-sticker"
                      src={item.url}
                      defaultPhoto="/"
                      onClick={() =>
                        handleChangeStickerDefault(
                          state.stickerDetail.id,
                          item._id
                        )
                      }
                    />
                  ) : (
                    <img className="img-sticker" src={item.url} />
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Grid>
      </div>
      <div
        className={classNames({
          "sticker-row-submit":
            state?.stickerEdit || state?.stickerDetail ? true : false
        })}>
        <StickerModalFooter
          state={state}
          onDelete={onDelete}
          setState={setState}
        />
      </div>
    </Fragment>
  )
}

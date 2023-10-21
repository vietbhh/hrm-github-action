import { useCallback, useEffect, useState } from "react"
import { Row, Col, Button, Grid } from "rsuite"
import { ErpInput } from "@apps/components/common/ErpField"
import "../assets/scss/sticker.scss"
import stickerDefault from "../common/stickerDefault"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import PhotoPublic from "@apps/modules/download/pages/PhotoPublic"
import { stickerApi } from "../common/api"
import StickerModal from "../components/modals/StickerModal"
import { CheckCircleTwoTone, CheckOutlined } from "@ant-design/icons"
import { Empty, Pagination } from "antd"

export default function Sticker() {
  const [state, setState] = useMergedState({
    stickerList: [stickerDefault],
    stickerEdit: null,
    stickerDetail: null,
    search: null,
    page: 1,
    perPage: 9,
    total: 0,
    modalMode: "" // createOrUpdate, detail
  })
  const [openModal, setOpenModal] = useState(false)

  const handleModalOk = () => {
    setOpenModal(false)
  }

  const handleModalCancel = () => {
    setOpenModal(false)
    setState({
      stickerEdit: null,
      stickerDetail: null
    })
  }

  const handleSetStickerDefault = (sticker) => {
    stickerApi
      .updateStatus(sticker.id)
      .then(() => {
        const newStickerList = state.stickerList.map((item) => {
          if (item.id === sticker.id) {
            return {
              ...item,
              default: !item.default
            }
          }

          return item
        })

        setState({
          stickerList: newStickerList
        })
      })
      .catch((error) => {
        throw error
      })
  }

  const onCreate = () => {
    setOpenModal(true)
    setState({
      modalMode: "createOrUpdate"
    })
  }

  const onDetail = (item) => {
    setOpenModal(true)
    setState({
      stickerDetail: !state?.stickerDetail ? item : state?.stickerDetail,
      modalMode: "detail"
    })
  }

  const onChangePage = (page) => {
    setState({
      page: page
    })
  }

  const onSearch = (search) => {
    if (state.page !== 1) {
      setState({
        page: 1
      })
    }
    setState({ search })
  }

  const getData = async () => {
    const result = await stickerApi.list(state.search, state.page)
    let newStickers = result.data.data
    let newTotal = result.data.total

    if (!state.search) {
      newTotal++
    }

    if (
      (Math.ceil(newTotal / state.perPage) === state.page && !state.search) ||
      stickerDefault.label.includes(state?.search)
    ) {
      newStickers = newStickers.concat([stickerDefault])
    }

    setState({
      stickerList: newStickers,
      total: newTotal
    })
  }

  const renderStickerIcon = useCallback((item, name) => {
    return name !== stickerDefault.name ? (
      <PhotoPublic className="img-sticker" src={item.url} defaultPhoto="/" />
    ) : (
      <img className="img-sticker" src={item.url} />
    )
  }, [])

  const renderStickersIcon = useCallback((item, index) => {
    const stickerIconDefault = item.list.find((item) => item.default)
    const stickerIconList = item.list.filter((item) => !item.default)

    let iconDefault =
      item.default === true ? (
        <CheckCircleTwoTone
          twoToneColor="#52c41a"
          className="icon-success"
          onClick={
            item.name !== stickerDefault.name
              ? () => handleSetStickerDefault(item)
              : () => {}
          }
        />
      ) : (
        <CheckOutlined
          className="icon-set-default"
          onClick={() => handleSetStickerDefault(item)}
        />
      )

    return (
      <Col className="sticker-collection" key={"collection-" + index} xs={24}>
        <div className="sticker-collection-header position-absolute top-0 end-0">
          <p className="text">{iconDefault}</p>
        </div>
        <div onClick={() => onDetail(item)}>
          <div className="sticker-collection-header">
            <p className="text">
              <span>
                {item.name !== stickerDefault.name ? item.name : item.label}
              </span>
              {/* {iconDefault} */}
            </p>
          </div>
          <div className="sticker-images">
            <Row>
              <Col lg={8}>
                {item.name !== stickerDefault.name ? (
                  <PhotoPublic
                    src={stickerIconDefault.url}
                    width={96.8}
                    height={96.8}
                    defaultPhoto="/"
                  />
                ) : (
                  <img
                    src={stickerIconDefault.url}
                    width={96.8}
                    height={96.8}
                  />
                )}
              </Col>
              <Col lg={16}>
                <Row>
                  {stickerIconList.map((subItem, index) => {
                    if (index > 5) {
                      return
                    }
                    // show max 6 items sticker
                    return (
                      <Col key={"img-sticker" + index}>
                        {renderStickerIcon(subItem, item.name)}
                      </Col>
                    )
                  })}
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    )
  })

  useEffect(() => {
    getData()
  }, [state.search, state.page])

  return (
    <div id="sticker">
      {openModal && (
        <StickerModal
          open={openModal}
          handleOk={handleModalOk}
          handleCancel={handleModalCancel}
          state={state}
          setState={setState}
          getData={getData}
        />
      )}
      <section className="header">
        <Grid fluid>
          <Row>
            <Col lg={19} xs={24} className="search p-0">
              <ErpInput
                type="text"
                placeholder={useFormatMessage(
                  "modules.sticker.list.placeholder.sticker_find"
                )}
                className="search_post_pending"
                onChange={(e) => onSearch(e.target.value)}
                prepend={<i className="fa-regular fa-magnifying-glass"></i>}
              />
            </Col>
            <Col lg={5} xs={24} className="col-btn p-0">
              <Button
                appearance="primary"
                className="sticker-btn-create"
                onClick={onCreate}>
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11 4.58333V17.4167"
                    stroke="#32434F"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.5835 11H17.4168"
                    stroke="#32434F"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text">
                  {useFormatMessage("modules.sticker.list.button.create")}
                </span>
              </Button>
            </Col>
          </Row>
        </Grid>
      </section>

      <section className="sticker-content">
        {state.stickerList.length !== 0 && (
          <>
            <Grid fluid>
              <Row>
                {state.stickerList.map((item, index) =>
                  renderStickersIcon(item, index)
                )}
              </Row>
            </Grid>
            <>
              {state.total > state.perPage && (
                <Pagination
                  current={state.page}
                  onChange={onChangePage}
                  total={state.total}
                  defaultPageSize={state.perPage}
                />
              )}
            </>
          </>
        )}
        {state.stickerList.length === 0 && <Empty />}
      </section>
    </div>
  )
}

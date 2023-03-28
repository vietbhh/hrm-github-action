import React, { Fragment } from "react"
import image_1 from "@modules/Feed/assets/images/background-feed/1.png"
import image_2 from "@modules/Feed/assets/images/background-feed/2.png"
import image_3 from "@modules/Feed/assets/images/background-feed/3.png"
import image_4 from "@modules/Feed/assets/images/background-feed/4.png"
import image_5 from "@modules/Feed/assets/images/background-feed/5.png"
import image_6 from "@modules/Feed/assets/images/background-feed/6.png"
import image_7 from "@modules/Feed/assets/images/background-feed/7.png"
import image_8 from "@modules/Feed/assets/images/background-feed/8.png"
import image_9 from "@modules/Feed/assets/images/background-feed/9.png"
import image_10 from "@modules/Feed/assets/images/background-feed/10.png"
import image_11 from "@modules/Feed/assets/images/background-feed/11.png"
import image_12 from "@modules/Feed/assets/images/background-feed/12.png"
import image_13 from "@modules/Feed/assets/images/background-feed/13.png"
import image_14 from "@modules/Feed/assets/images/background-feed/14.png"
import image_15 from "@modules/Feed/assets/images/background-feed/15.png"
import image_16 from "@modules/Feed/assets/images/background-feed/16.png"
import image_17 from "@modules/Feed/assets/images/background-feed/17.png"
import image_18 from "@modules/Feed/assets/images/background-feed/18.png"
import image_19 from "@modules/Feed/assets/images/background-feed/19.png"
import image_20 from "@modules/Feed/assets/images/background-feed/20.png"
import image_21 from "@modules/Feed/assets/images/background-feed/21.png"
import image_22 from "@modules/Feed/assets/images/background-feed/22.png"
import image_23 from "@modules/Feed/assets/images/background-feed/23.png"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import classNames from "classnames"
import { Modal, ModalBody } from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"

const ChooseBackground = (props) => {
  const { backgroundImage, setBackgroundImage, showChooseBackgroundImage } =
    props
  const [state, setState] = useMergedState({
    modalChooseBackground: false
  })

  const arrImage = [
    image_1,
    image_2,
    image_3,
    image_4,
    image_5,
    image_6,
    image_7,
    image_8,
    image_9,
    image_10,
    image_11,
    image_12,
    image_13,
    image_14,
    image_15,
    image_16,
    image_17,
    image_18,
    image_19,
    image_20,
    image_21,
    image_22,
    image_23
  ]

  // ** function
  const toggleModalChooseBackground = () => {
    setState({ modalChooseBackground: !state.modalChooseBackground })
  }

  return (
    <Fragment>
      <div
        className={classNames("div-choose-background", {
          "d-none": !showChooseBackgroundImage
        })}>
        <div
          onClick={() => setBackgroundImage("")}
          className={classNames("item item-default", {
            "item-active": backgroundImage === ""
          })}></div>

        <div
          onClick={() => setBackgroundImage(image_1)}
          className={classNames("item", {
            "item-active": backgroundImage === image_1
          })}
          style={{ backgroundImage: `url("${image_1}")` }}></div>

        <div
          onClick={() => setBackgroundImage(image_2)}
          className={classNames("item", {
            "item-active": backgroundImage === image_2
          })}
          style={{ backgroundImage: `url("${image_2}")` }}></div>

        <div
          onClick={() => setBackgroundImage(image_3)}
          className={classNames("item", {
            "item-active": backgroundImage === image_3
          })}
          style={{ backgroundImage: `url("${image_3}")` }}></div>

        <div
          onClick={() => setBackgroundImage(image_4)}
          className={classNames("item", {
            "item-active": backgroundImage === image_4
          })}
          style={{ backgroundImage: `url("${image_4}")` }}></div>

        <div
          onClick={() => setBackgroundImage(image_5)}
          className={classNames("item", {
            "item-active": backgroundImage === image_5
          })}
          style={{ backgroundImage: `url("${image_5}")` }}></div>

        <div
          onClick={() => setBackgroundImage(image_6)}
          className={classNames("item", {
            "item-active": backgroundImage === image_6
          })}
          style={{ backgroundImage: `url("${image_6}")` }}></div>

        <div
          onClick={() => setBackgroundImage(image_7)}
          className={classNames("item", {
            "item-active": backgroundImage === image_7
          })}
          style={{ backgroundImage: `url("${image_7}")` }}></div>

        <div
          onClick={() => setBackgroundImage(image_8)}
          className={classNames("item", {
            "item-active": backgroundImage === image_8
          })}
          style={{ backgroundImage: `url("${image_8}")` }}></div>

        <div
          onClick={() => setBackgroundImage(image_9)}
          className={classNames("item", {
            "item-active": backgroundImage === image_9
          })}
          style={{ backgroundImage: `url("${image_9}")` }}></div>

        <div
          onClick={() => setBackgroundImage(image_10)}
          className={classNames("item", {
            "item-active": backgroundImage === image_10
          })}
          style={{ backgroundImage: `url("${image_10}")` }}></div>

        <div className="item" onClick={() => toggleModalChooseBackground()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 28 28"
            fill="none">
            <g filter="url(#filter0_d)">
              <rect x="2" y="1" width="24" height="24" rx="4" fill="#E7E7E7" />
              <rect x="6" y="5" width="7" height="7" rx="1" fill="#808080" />
              <rect x="6" y="14" width="7" height="7" rx="1" fill="#808080" />
              <rect x="15" y="5" width="7" height="7" rx="1" fill="#808080" />
              <rect x="15" y="14" width="7" height="7" rx="1" fill="#808080" />
            </g>
            <defs>
              <filter
                id="filter0_d"
                x="0"
                y="0"
                width="28"
                height="28"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy="1" />
                <feGaussianBlur stdDeviation="1" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      <Modal
        isOpen={state.modalChooseBackground}
        toggle={() => toggleModalChooseBackground()}
        className="modal-dialog-centered feed modal-create-post modal-choose-background"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
        backdrop={"static"}>
        <ModalBody>
          <div className="body-header">
            <button
              className="btn-icon"
              onClick={() => toggleModalChooseBackground()}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <span className="text-title">
              {useFormatMessage(
                "modules.feed.create_post.text.choose_a_background"
              )}
            </span>
          </div>
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            <div className="body-content">
              {_.map(arrImage, (value) => {
                return (
                  <div
                    className={classNames("item-background-wrapper", {
                      "item-background-wrapper__active":
                        backgroundImage === value
                    })}
                    style={{ backgroundImage: `url("${value}")` }}
                    onClick={() => {
                      setBackgroundImage(value)
                      toggleModalChooseBackground()
                    }}></div>
                )
              })}
            </div>
          </PerfectScrollbar>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default ChooseBackground

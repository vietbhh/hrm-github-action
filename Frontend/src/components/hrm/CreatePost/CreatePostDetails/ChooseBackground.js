import React, { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import classNames from "classnames"
import { Modal, ModalBody } from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"
import { arrImage } from "@modules/Feed/common/common"

const ChooseBackground = (props) => {
  const { backgroundImage, setBackgroundImage, showChooseBackgroundImage } =
    props
  const [state, setState] = useMergedState({
    modalChooseBackground: false
  })

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
          onClick={() => setBackgroundImage(null)}
          className={classNames("item item-default", {
            "item-active": backgroundImage === null
          })}></div>

        {_.map(
          _.filter(arrImage, (item, key) => {
            return key < 10
          }),
          (value, index) => {
            return (
              <div
                key={index}
                onClick={() => setBackgroundImage(value.image)}
                className={classNames("item", {
                  "item-active": backgroundImage === index + 1
                })}
                style={{ backgroundImage: `url("${value.image}")` }}></div>
            )
          }
        )}

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
              {_.map(arrImage, (value, index) => {
                return (
                  <div
                    key={index}
                    className={classNames("item-background-wrapper", {
                      "item-background-wrapper__active":
                        backgroundImage === index + 1
                    })}
                    style={{ backgroundImage: `url("${value.image}")` }}
                    onClick={() => {
                      toggleModalChooseBackground()
                      setBackgroundImage(value.image)
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

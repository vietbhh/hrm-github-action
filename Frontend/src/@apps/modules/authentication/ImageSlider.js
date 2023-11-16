// ** React Imports
import { useRTL } from "@hooks/useRTL"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import "@styles/react/libs/swiper/swiper.scss"
// ** Components
import SwiperCore, { Grid, Lazy, Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"

// ** Init Swiper Functions
SwiperCore.use([Grid, Pagination, Lazy])

const ImageSlider = (props) => {
  const {
    // ** props
    logo
    // ** methods
  } = props

  const [isRtl] = useRTL()

  const params = {
    slidesPerView: 1,
    pagination: {
      clickable: true
    },
    
  }

  // ** render
  return (
    <div className="slide-image-section">
      <div className="swiper-content">
        <Swiper {...params} dir={isRtl ? "rtl" : "ltr"}>
          <SwiperSlide>
            <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="907"
                height="749"
                viewBox="0 0 907 749"
                fill="none">
                <rect
                  y="-0.00195312"
                  width="907"
                  height="748.665"
                  fill="url(#pattern0)"
                />
                <defs>
                  <pattern
                    id="pattern0"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1">
                    <use
                      xlinkHref="#image0_1436_42031"
                      transform="matrix(0.00068912 0 0 0.000833333 -0.0222709 0)"
                    />
                  </pattern>
                  <image
                    id="image0_1436_42031"
                    width="1600"
                    height="1200"
                  />
                </defs>
              </svg>
              <div className="text-center text-description">
                <h4>
                  {useFormatMessage(
                    "auth.swipe_auth.connect_with_your_company"
                  )}
                </h4>
                <p>{useFormatMessage("auth.swipe_auth.everything_you_need")}</p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  )
}

export default ImageSlider
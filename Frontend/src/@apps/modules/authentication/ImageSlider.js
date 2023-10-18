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
    breakpoints: {
      1024: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      640: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  }

  // ** render
  return (
    <div className="slide-image-section">
      <Swiper {...params} dir={isRtl ? "rtl" : "ltr"}>
        <SwiperSlide>
          <div>
            <img src={logo} className="img3D" />
            <div className="text-center text-description">
                <h4>{useFormatMessage("auth.swipe_auth.connect_with_your_company")}</h4>
                <p>{useFormatMessage("auth.swipe_auth.everything_you_need")}</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default ImageSlider

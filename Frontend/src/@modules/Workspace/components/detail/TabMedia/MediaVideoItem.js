// ** React Imports
// ** Styles
// ** Components

const MediaVideoItem = (props) => {
  const {
    // ** props
    mediaItem
    // ** methods
  } = props

  // ** render
  return (
    <div className="w-100 d-flex align-items-center justify-content-center p-50 ">
      <div className="w-100 position-relative">
        <img
          src="https://cdn-thumb-image-2.gapowork.vn/140x140/smart/a97d9f8f-0ad8-4f1e-8954-4f9110e02d0d/matthias_helvar_by_noukette_dbys4l7-fullview _1.jpeg"
          className="w-100 h-100 rounded"
        />
      </div>
      <div className="position-absolute top-50 start-50 translate-middle">
        <svg
          width="24"
          height="26"
          viewBox="0 0 24 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.08917 3.81094C1.30809 1.14929 4.14466 -0.467073 6.57042 0.650053C12.0022 3.15151 17.1827 6.31443 21.8796 10.0157C23.8101 11.5369 23.8101 14.463 21.8796 15.9842C17.1827 19.6855 12.0022 22.8484 6.57042 25.3498C4.14466 26.467 1.30809 24.8506 1.08917 22.189L0.87276 19.5579C0.513768 15.1933 0.513767 10.8066 0.87276 6.44201L1.08917 3.81094Z"
            fill="white"></path>
        </svg>
      </div>
      <div className="position-absolute bottom-0 end-0">
        <p className="pe-1 text-white">00:14</p>
      </div>
    </div>
  )
}

export default MediaVideoItem

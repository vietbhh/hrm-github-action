import SquareLoader from "./SquareLoader"
import loadingWhite from "@/assets/friday/loading_white.gif"
const AppSpinner = (props) => {
  return (
    <div className="fallback-spinner app-loader">
      {/* <SquareLoader type="grow" color="primary" {...props} /> */}
      <img src={loadingWhite} style={{
        width : "90px"
      }} />
    </div>
  )
}

export default AppSpinner

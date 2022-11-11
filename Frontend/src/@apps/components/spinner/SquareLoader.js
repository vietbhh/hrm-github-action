import classnames from "classnames"
const SquareLoader = ({ className }) => {
  return (
    <div className={classnames("d-flex justify-content-center", className)}>
      <div className="loadingio-spinner-square-60uqfeoo2je">
        <div className="ldio-rj858gisq2k">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      {/* <div className="loadingio-spinner-typing-4fe72ej7er">
        <div className="ldio-1p3kme0irte">
          <div
            style={{
              left: "24.3px",
              background: "#00b4eb",
              animationDelay: "-0.6s"
            }}></div>
          <div
            style={{
              left: "40.5px",
              background: "#79c145",
              animationDelay: "-0.44999999999999996s"
            }}></div>
          <div
            style={{
              left: "56.7px",
              background: "#fdc013",
              animationDelay: "-0.3s"
            }}></div>
          <div
            style={{
              left: "72.9px",
              background: "#f15b25",
              animationDelay: "-0.15s"
            }}></div>
        </div>
      </div> */}
    </div>
  )
}
export default SquareLoader

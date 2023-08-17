const loadingIcon = (
  <div className="lds-ring">
    <div></div>
    <div></div>
  </div>
)

const CircleSpinner = (props) => {
  return props.center ? (
    <div className="text-center">{loadingIcon}</div>
  ) : (
    loadingIcon
  )
}
export default CircleSpinner

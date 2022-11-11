import SquareLoader from "./SquareLoader"

const DefaultSpinner = (props) => {
  return props.center ? (
    <div className="text-center">
      <SquareLoader type="grow" color="primary" {...props} />
    </div>
  ) : (
    <SquareLoader type="grow" color="primary" {...props} />
  )
}
export default DefaultSpinner

// ** React Imports
// ** Styles
// ** Components
import TotalPaymentChart from "./TotalPaymentChart"

const TotalPayment = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  // ** render
  return (
    <div className="total-payment">
      <div className="mb-1">
        <p className="money">$178k</p>
      </div>
      <div className="d-flex align-items-center pb-1 mb-1 total-payment-time">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="52px"
            height="36px"
            viewBox="0 0 52 36"
            enableBackground="new 0 0 52 36"
            xmlSpace="preserve">
            {" "}
            <image
              id="image0"
              width="52"
              height="36"
              x="0"
              y="0"
              href="data:image/png;base64,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"
            />
          </svg>
        </div>
        <div className="">
          <p className="total-payment-time-text mb-0">Total Payment on August, 2022</p>
        </div>
      </div>
      <div className="chart">
        <TotalPaymentChart />
      </div>
    </div>
  )
}

export default TotalPayment

// ** React Imports
// ** Styles
// ** Components

const OverviewTemplate = (props) => {
  const {
    // ** props
    icon,
    iconBackground,
    title,
    number,
    rate,
    isGrow,
    description,
    additionalClassName
    // ** methods
  } = props

  // ** render
  const renderRate = () => {
    return (
      <div className={`d-flex align-items-center justify-content-center rate ${isGrow ? "rate-green" : "rate-red"}`}>
        <div
          className={`rate-icon d-flex align-items-center justify-content-center me-50`}>
          {isGrow ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="9px"
              height="6px"
              viewBox="0 0 9 6"
              enableBackground="new 0 0 9 6"
              xmlSpace="preserve">
              {" "}
              <image
                id="image0"
                width="9"
                height="6"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAQAAAC7znxOAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnARELCwWNm1p1AAAAR0lEQVQI113LQQ3AIBAF0ZGAk5VQ CdRZJSABKUhYCZUwPSwH0jn9vOTDkVN9azY7gGFqwVIvwzScBcNumkadlgPAZwN48+sDjDcrLZ8l lQkAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDEtMTdUMTA6MTE6MDUrMDE6MDDBnmWWAAAAJXRF WHRkYXRlOm1vZGlmeQAyMDIzLTAxLTE3VDEwOjExOjA1KzAxOjAwsMPdKgAAAABJRU5ErkJggg=="
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="10px"
              height="6px"
              viewBox="0 0 10 6"
              enableBackground="new 0 0 10 6"
              xmlSpace="preserve">
              {" "}
              <image
                id="image0"
                width="10"
                height="6"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAQAAABQ+cdNAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnARELCzTcRVpPAAAATUlEQVQI113NUQ2DQBRE0UkVVAIO Xh2tBCQgZSW0TlbCSqiEwweBBObzZJIbpfLYK8lPJRZf78uVqUzDuPNfT3TDqp28HB8d2y3gA9oO fNcrnwE8HQoAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDEtMTdUMTA6MTE6NTIrMDE6MDBM2VV8 AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTAxLTE3VDEwOjExOjUyKzAxOjAwPYTtwAAAAABJRU5E rkJggg=="
              />
            </svg>
          )}
        </div>
        <div className="rate-number">{Math.round(rate * 100) / 100}%</div>
      </div>
    )
  }

  return (
    <div className={`employee-overview-item ${additionalClassName} p-50`}>
      <div className="d-flex mb-2 title">
        <div className={`me-75 d-flex align-items-center justify-content-center title-icons title-icon-background-${iconBackground}`}>{icon}</div>
        <div>
          <p className="mb-0 title-text">{title}</p>
        </div>
      </div>
      <div className="d-flex align-items-end justify-content-between mb-1 pt-50">
        <div>
          <p className="mb-0 me-50 number">{number}</p>
        </div>
        <div>{renderRate()}</div>
      </div>
      <div className="mb-1">
        <p className="mb-0 description">{description}</p>
      </div>
      <div>
        <div className="overview-footer">
            <div className="overview-progress"></div>
        </div>
      </div>
    </div>
  )
}

export default OverviewTemplate

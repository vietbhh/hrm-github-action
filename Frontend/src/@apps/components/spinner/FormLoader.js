import ContentLoader from "react-content-loader"
import { Fragment } from "react"
import DefaultSpinner from "./DefaultSpinner"
export const FormLoader = (props) => {
  return <DefaultSpinner {...props} />
}
export const FormHorizontalLoader = (props) => {
  const { rows } = props
  let y_row_1 = 16,
    y_row_2 = 35,
    y_row_3 = 15,
    y_row_4 = 16,
    y_row_5 = 35,
    y_row_6 = 15
  return (
    <ContentLoader
      height="200"
      width="100%"
      viewBox="0 0 900 200"
      preserveAspectRatio="none"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb">
      {[...Array(parseInt(rows))].map((item, index) => {
        if (index > 0) {
          y_row_1 += 40
          y_row_2 += 40
          y_row_3 += 40
          y_row_4 += 40
          y_row_5 += 40
          y_row_6 += 40
        }
        return (
          <Fragment key={index}>
            <rect x="0" y={y_row_1} rx="4" ry="4" width="120" height="10" />
            <rect x="0" y={y_row_2} rx="4" ry="4" width="60" height="10" />
            <rect x="135" y={y_row_3} rx="3" ry="3" width="280" height="30" />
            <rect x="470" y={y_row_4} rx="4" ry="4" width="120" height="10" />
            <rect x="470" y={y_row_5} rx="4" ry="4" width="60" height="10" />
            <rect x="605" y={y_row_6} rx="3" ry="3" width="280" height="30" />
          </Fragment>
        )
      })}
    </ContentLoader>
  )
}

export const FormHorizontalRequestLoader = (props) => {
  const { rows } = props
  return (
    <ContentLoader
      width="100%"
      height={200}
      speed={2}
      viewBox="0 0 900 300"
      preserveAspectRatio="none"
      backgroundColor="#f5f5f5"
      foregroundColor="#dbdbdb"
      {...props}>
      <rect x="10" y="8" rx="33" ry="3" width="3" height="288" />
      {/* Y left */}
      <rect x="10" y="289" rx="3" ry="3" width="427" height="6" />
      {/* X botton */}
      <rect x="435" y="8" rx="3" ry="3" width="3" height="288" />
      {/* Y right */}
      <rect x="10" y="8" rx="3" ry="3" width="427" height="6" /> {/* X top */}
      <rect x="40" y="70" rx="0" ry="0" width="360" height="30" />
      <rect x="40" y="140" rx="0" ry="0" width="360" height="30" />
      <rect x="40" y="210" rx="0" ry="0" width="360" height="30" />
      <rect x="470" y="8" rx="33" ry="3" width="3" height="288" />
      {/* Y left */}
      <rect x="470" y="289" rx="3" ry="3" width="427" height="6" />
      {/* X botton */}
      <rect x="895" y="8" rx="3" ry="3" width="3" height="288" />
      {/* Y right */}
      <rect x="470" y="8" rx="3" ry="3" width="427" height="6" /> {/* X top */}
      <rect x="500" y="70" rx="0" ry="0" width="360" height="30" />
      <rect x="500" y="140" rx="0" ry="0" width="360" height="30" />
      <rect x="500" y="210" rx="0" ry="0" width="360" height="30" />
    </ContentLoader>
  )
}

// ** React Imports
// ** Styles
// ** Components

const OverviewItem = (props) => {
  const {
    // ** props
    loading,
    title,
    description,
    number,
    className
    // ** methods
  } = props

  // ** render
  return (
    <div className={`p-1 overview-item ${className}`}>
      <div className="mb-1">
        <h6 className="title">{title}</h6>
      </div>
      <div className="mb-2">
        <p className="number">{loading ? "" : number}</p>
      </div>
      <div>
        <p className="description">{description}</p>
      </div>
    </div>
  )
}

export default OverviewItem

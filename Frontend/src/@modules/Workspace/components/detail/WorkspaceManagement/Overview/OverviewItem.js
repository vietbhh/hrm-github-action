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
      <div className="mb-2">
        <h6 className="title">{title}</h6>
        <p className="description">{description}</p>
      </div>
      <div>
        <p className="number">{loading ? "" : number}</p>
      </div>
    </div>
  )
}

export default OverviewItem

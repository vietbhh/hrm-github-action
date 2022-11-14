const Viewtype = (data) => {
    const { viewGrid, setState } = data
    const handleViewType = () => {
        setState({ viewGrid: !viewGrid })
    }

    return (

        <div className="col-sm-1">
            <div className="data-view">
                <div className={"type-view view-list" + (!viewGrid ? " active" : "")} onClick={() => handleViewType('list')}>
                    <span className="icpega Feed-List"></span>
                </div>
                <div className={"type-view view-grid" + (viewGrid ? " active" : "")} onClick={() => handleViewType('grid')}>
                    <span className="icpega Grid-Menu"></span>
                </div>
            </div>
        </div>
    )
}
export default Viewtype
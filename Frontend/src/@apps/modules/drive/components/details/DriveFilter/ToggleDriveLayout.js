// ** React Imports
import { Fragment } from "react"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import { setFilter } from "@apps/modules/drive/common/reducer/drive"
// ** Styles
// ** Components

const ToggleDriveLayout = (props) => {
  const {
    // ** props
    filter
    // ** methods
  } = props

  const dispatch = useDispatch()

  const handleChangeFilterLayout = (layout) => {
    const newFilter = { ...filter, layout: layout }
    dispatch(setFilter(newFilter))
  }

  // ** render
  const renderListItem = () => {
    if (filter.layout === "list") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="20px"
          height="20px"
          viewBox="0 0 20 20"
          enableBackground="new 0 0 20 20"
          xmlSpace="preserve">
          {" "}
          <image
            id="image0"
            width="20"
            height="20"
            x="0"
            y="0"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfmDAMCChA/UDxQAAAAoElEQVQoz8WSsRHCQAwEVx5yngr8 HUBHTwemE5fgcQd04BagAt4V+KngCOzUehKGTaTg5qTRyQBALbvYvDVKWuSxqAMDvciM+450RDuh KCk5MnSV1DZ8yS+EBbi4mjPwBjSpxgC2XpLoOM7crTSgUFlPVtY6VEdPgIKk3jXsJYWGADzc0U/g +MdkDpZVuMnTJLLNgLrq46YtGVDcN7QM8AFxdrc2T86a2gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAy Mi0xMi0wM1QwMjoxMDoxNiswMDowMBR/eRgAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTItMDNU MDI6MTA6MTYrMDA6MDBlIsGkAAAAAElFTkSuQmCC"
          />
        </svg>
      )
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        width="20px"
        height="20px"
        viewBox="0 0 20 20"
        enableBackground="new 0 0 20 20"
        xmlSpace="preserve">
        {" "}
        <image
          id="image0"
          width="20"
          height="20"
          x="0"
          y="0"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAXVBMVEUAAAApKTEoKzApLTEn LDAoLTEoLDEoLTIpLDEpLTIoMDAoKzMwMDApKzInKzIgMDApLDEoLTIoLjMoLDIgIDAoLjAoKzIn LTIpLTIpLTInLjMqLTIoKDgpLTL////MgIZWAAAAHXRSTlMAH1/vb9+/YM/vIF8Qj48Qv59ffxBf n4+P32/vIKyTBoUAAAABYktHRB5yCiArAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5gwD BBceIwkB+QAAAGVJREFUGNO1jzkSgDAMAwWBhHBf4fb/v4kzVKJl2HItj2wASAhEUiOEyVTm1hGF B0qpQDhJvspaGpatdEAvL4Y4GifCaRBzYJnG4PJet9CilYs2LfrjI/giEHbXyXHyReezeREqbgM9 EO4tIQq9AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTEyLTAzVDAzOjIzOjMwKzAxOjAwInUovQAA ACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0xMi0wM1QwMzoyMzozMCswMTowMFMokAEAAAAASUVORK5C YII="
        />
      </svg>
    )
  }

  const renderGridItem = () => {
    if (filter.layout === "grid") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="20px"
          height="20px"
          viewBox="0 0 20 20"
          enableBackground="new 0 0 20 20"
          xmlSpace="preserve">
          {" "}
          <image
            id="image0"
            width="20"
            height="20"
            x="0"
            y="0"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfmDAMFDiB4qt99AAAAsUlEQVQoz9WSwQ3CMAxFXxB3vEG7 ASO0G7AKnaAjhJEYASZoNmiY4HNIBFWpJTjyTrH0Eju2AwDIOLDNI+RFpEkeczH21Rww58WVONPQ fsiZxFSOAUCRM5DJK9Ew4BKGUl8nKWoztUyjpK4EUcJFplkRdoCRfDFkMlbEr/gXMWPbXay0dRDq JI1uw6Ok/ocRhnqz5+gsxT1c4b09iYbbZoWNbLG6GuVzgldqUOt9OiSAJxxSey2UkQs7AAAAJXRF WHRkYXRlOmNyZWF0ZQAyMDIyLTEyLTAzVDA0OjE0OjMyKzAxOjAws6dCtAAAACV0RVh0ZGF0ZTpt b2RpZnkAMjAyMi0xMi0wM1QwNDoxNDozMiswMTowMML6+ggAAAAASUVORK5CYII="
          />
        </svg>
      )
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        width="20px"
        height="20px"
        viewBox="0 0 20 20"
        enableBackground="new 0 0 20 20"
        xmlSpace="preserve">
        {" "}
        <image
          id="image0"
          width="20"
          height="20"
          x="0"
          y="0"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaVBMVEUAAAAgIDApKTEoLTEp LTIpLTMoLTInLTQoLTEpLDAnKzIoKzIpLTAqLTIpLjIpKzInLTIgMDAoLDIpLTIwMDAoLTIpLTIo LDAoLDQpLTEpLTEpLjMoLTMoKDAoLjAqLTQoKDgpLTL///8vSX/zAAAAIXRSTlMAEB/f71BgTz9v j5+P79+PjxB/jxCf339A799vnyBfTyDTki+aAAAAAWJLR0QiXWVcrAAAAAlwSFlzAAALEwAACxMB AJqcGAAAAAd0SU1FB+YMAwQaCGJzyuUAAACBSURBVBjTvdBRDoIwEATQqVYFBN2CYBEV5/6XtJaN LhfwfTTpZJpuFgDcxnBYbGl4DXd746BhUVZHVZXFktVkc1INec49SsBXaPnpdoR18ZLOfliFGPp/ hp0Pq5CSh7+6X+RqRuTpOd7UyFxM4iR3JVPUJ4+npT+0dsmctfqy0v0NE9gP0Ey12A8AAAAldEVY dGRhdGU6Y3JlYXRlADIwMjItMTItMDNUMDM6MjY6MDgrMDE6MDB5PKp9AAAAJXRFWHRkYXRlOm1v ZGlmeQAyMDIyLTEyLTAzVDAzOjI2OjA4KzAxOjAwCGESwQAAAABJRU5ErkJggg=="
        />
      </svg>
    )
  }

  return (
    <Fragment>
      <div className="d-flex align-items-center toggle-drive-layout">
        <div
          className={`d-flex align-items-center justify-content-center toggle-drive-layout-item ${
            filter.layout === "list" ? "active" : ""
          }`}
          onClick={() => handleChangeFilterLayout("list")}>
          <Fragment>{renderListItem()}</Fragment>
        </div>
        <div
          className={`d-flex align-items-center justify-content-center toggle-drive-layout-item ${
            filter.layout === "grid" ? "active" : ""
          }`}
          onClick={() => handleChangeFilterLayout("grid")}>
          <Fragment>{renderGridItem()}</Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default ToggleDriveLayout

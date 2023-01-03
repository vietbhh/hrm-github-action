// ** React Imports
import { Fragment, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { driveApi } from "@apps/modules/drive/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"

// ** Core Layout Import
// !Do not remove the Layout impo rt
import Layout from "./components/vertical/Layout"

// ** Menu Items Array
import menuDrive from "../@apps/modules/drive/components/details/LeftMenu/menuDrive"

// ** import component
import Navbar2 from "./components/custom/Navbar2"
import NewFiles from "../@apps/modules/drive/components/details/LeftMenu/NewFiles"
import ShareFileAndFolderDriveModal from "../@apps/modules/drive/components/modals/ShareModal/ShareFileAndFolderDriveModal"

// ** redux
import { useSelector, useDispatch } from "react-redux"
import { setListFolder } from "@apps/modules/drive/common/reducer/drive"

const DriveLayout = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    menuData: []
  })

  const driveState = useSelector((state) => state.drive)
  const { listFolder } = driveState

  const dispatch = useDispatch()

  const myFolderMenu = [
    {
      id: "my_files",
      title: "menu.drive.my_file",
      type: "dropdown",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          enableBackground="new 0 0 24 24"
          xmlSpace="preserve">
          {" "}
          <image
            id="image0"
            width="24"
            height="24"
            x="0"
            y="0"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAclBMVEUAAAAoLTEnKzInLDIo LDEnLTAoLDAqLTIqLjMpLTMpLTInLTIgMDAwMDApLDEpLTIpKTEpLTIoMDApLDIpLDMqLTAoLTEp LDEoLTMoLjMnLTImKzEoLDQqKjUpKzIgIDApLTAoLDIpLTEpLTMpLTL///9/S/UcAAAAJHRSTlMA P4+vv09/78+/348QEM/vH48gr89P37+/X68vQDCPEI9/768ZyXs7AAAAAWJLR0QlwwHJDwAAAAlw SFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+YMAgkpCCZ8W+MAAACZSURBVCjPpZHbFoIgEEVByaRR 0MpuUmae///GgmWpYD7UfplhNjBcGFuAR7EQIl759QTrVEq5gWc4KLMxV7qYiBJ9stVqInb7d1bh IGyziLvh8fSZc5aWFEg8MezO50WuaV4wdfkiXO13UfMXdSgqOIpwhbFc/2o+PKJ3wVJngQC5j7p5 5eYOY2MLKDFCPdD2B6VOjujIsAWej/EMPRPJGl8AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMTIt MDJUMDg6NDE6MDgrMDE6MDA69FV1AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTEyLTAyVDA4OjQx OjA4KzAxOjAwS6ntyQAAAABJRU5ErkJggg=="
          />
        </svg>
      ),
      children: []
    }
  ]

  const getMyFolder = () => {
    setState({
      loading: true
    })

    driveApi
      .getMyFolder()
      .then((res) => {
        setState({
          loading: false
        })
        dispatch(setListFolder(res.data.list_folder))
      })
      .catch((err) => {
        myFolderMenu[0]["children"] = []
        setState({
          loading: false
        })
        dispatch(setListFolder([]))
      })
  }

  listFolder.map((item) => {
    myFolderMenu[0]["children"].push({
      id: `menu-my-file-${item.id}`,
      title: item.name,
      type: "item",
      action: "access",
      icon: "",
      navLink: `/drive/folder/${item.id}`,
      exactActive: true
    })
  })

  // ** effect
  useEffect(() => {
    getMyFolder()
  }, [])

  // ** render
  const renderShareFileAndFolderDriveModal = () => {
    return <ShareFileAndFolderDriveModal />
  }

  const renderComponent = () => {
    if (state.loading) {
      return ""
    }

    return (
      <Layout
        menuData={[...myFolderMenu, ...menuDrive]}
        navbar={(navProps) => <Navbar2 {...navProps} />}
        outerCustomMenuComponent={(customProps) => (
          <NewFiles {...customProps} />
        )}
        className="navbar-2 drive-page"
        fixedSidebar={true}
        {...props}>
        <Outlet />

        <Fragment>{renderShareFileAndFolderDriveModal()}</Fragment>
      </Layout>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default DriveLayout

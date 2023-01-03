import { lazy } from "react"

const Drive = lazy(() => import("@apps/modules/drive/pages/Drive"))
const MyFileDrive = lazy(() => import("@apps/modules/drive/pages/MyFileDrive"))
const FolderDrive = lazy(() => import("@apps/modules/drive/pages/FolderDrive"))

const DriveRoutes = [
  {
    path: "/drive",
    element: <Drive />,
    meta: {
      action: "login",
      resource: "app",
      layout: "drive"
    }
  },
  {
    path: "/drive/my-file",
    element: <MyFileDrive />,
    meta: {
      action: "login",
      resource: "app",
      layout: "drive"
    }
  },
  {
    path: "/drive/folder/:id",
    element: <FolderDrive />,
    meta: {
      action: "login",
      resource: "app",
      layout: "drive"
    }
  }
]

export default DriveRoutes

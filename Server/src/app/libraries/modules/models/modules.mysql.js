import { DataTypes } from "sequelize"
import appModelMysql from "../../../models/app.mysql.js"

const modulesModel = appModelMysql(
  "modules",
  {
    name: {
      type: DataTypes.TEXT
    },
    tableName: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.ENUM(["default", "extend"])
    },
    layout: {
      type: DataTypes.ENUM(["default", "withSidebar", "custom"])
    },
    fullWidth: {
      type: DataTypes.ENUM(["no", "yes"])
    },
    icon: {
      type: DataTypes.TEXT
    },
    moduleIcon: {
      type: DataTypes.TEXT
    },
    add_mode: {
      type: DataTypes.ENUM(["quick", "full", "only_quick", "only_full"])
    },
    update_mode: {
      type: DataTypes.ENUM(["quick", "full", "only_quick", "only_full"])
    },
    view_mode: {
      type: DataTypes.ENUM(["quick", "full", "only_quick", "only_full"])
    },
    sidebar_menu: {
      type: DataTypes.TEXT
    },
    options: {
      type: DataTypes.TEXT("long")
    }
  },
  {
    underscored: false
  }
)

const getModule = async (module) => {
  const moduleInfo = await modulesModel.findOne({
    attributes: [
      "name",
      "tableName",
      "type",
      "layout",
      "fullWidth",
      "icon",
      "moduleIcon",
      "add_mode",
      "update_mode",
      "view_mode",
      "sidebar_menu",
      "options"
    ],
    where: {
      name: module
    }
  })
  
  return moduleInfo
}

export { modulesModel, getModule }

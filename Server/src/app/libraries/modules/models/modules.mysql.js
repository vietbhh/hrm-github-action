import { DataTypes } from "sequelize"
import appModelMysql from "../../../models/app.mysql.js"

const modulesModel = appModelMysql(
  "modules",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
      "id",
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
  if(!moduleInfo) throw new Error("MODULE_NOT_FOUND")
  return moduleInfo
}

export { modulesModel, getModule }

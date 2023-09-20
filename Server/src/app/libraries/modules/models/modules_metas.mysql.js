import coreModelMysql from "#app/models/core.mysql.js"
import { isNumber, isString } from "lodash-es"
import { DataTypes } from "sequelize"
import { getModule } from "./modules.mysql.js"

const modulesMetasModel = coreModelMysql(
  "modules_metas",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    module: {
      type: DataTypes.INTEGER
    },
    field: {
      type: DataTypes.STRING
    },
    field_enable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    field_type: {
      type: DataTypes.ENUM([
        "text",
        "textarea",
        "number_int",
        "number_dec",
        "date",
        "datetime",
        "time",
        "select_option",
        "select_module",
        "checkbox",
        "checkbox_module",
        "radio",
        "radio_module",
        "switch",
        "upload_one",
        "upload_multiple",
        "upload_image"
      ]),
      defaultValue: "text"
    },
    field_select_field_show: {
      type: DataTypes.STRING
    },
    field_select_module: {
      type: DataTypes.STRING
    },
    field_icon_type: {
      type: DataTypes.ENUM(["no_icon", "icon_left", "icon_right"]),
      defaultValue: "no_icon"
    },
    field_table_width: {
      type: DataTypes.INTEGER
    },
    field_table_sortable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    field_table_width: {
      type: DataTypes.INTEGER,
      defaultValue: 3
    },
    field_form_require: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    field_form_unique: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    field_default_value: {
      type: DataTypes.STRING
    },
    field_readonly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    field_table_show: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    field_form_show: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    field_quick_form_show: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    field_quick_view_show: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    field_detail_show: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    field_filter_show: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    field_form_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    field_table_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    field_quick_view_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    field_detail_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    field_filter_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    field_options_values: {
      type: DataTypes.TEXT()
    },
    field_validate_rules: {
      type: DataTypes.TEXT()
    },
    field_options: {
      type: DataTypes.TEXT()
    }
  },
  {
    underscored: false,
    timestamps: false
  }
)

const getModuleMetas = async (module) => {
  let moduleId = module
  if (isString(module)) {
    const moduleData = await getModule(module)
    if (moduleData) moduleId = moduleData.id
    else throw new Error("MODULE_NOT_FOUND")
  }
  const moduleInfo = await modulesMetasModel.findAll({
    where: {
      module: moduleId
    }
  })

  return moduleInfo
}

export { modulesMetasModel, getModuleMetas }

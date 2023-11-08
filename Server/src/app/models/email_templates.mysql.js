import { DataTypes, Op, where } from "sequelize"
import coreModelMysql from "./core.mysql.js"
import { forEach } from "lodash-es"

const emailTemplatesModel = coreModelMysql("email_templates", {
  name: {
    type: DataTypes.STRING
  },
  source: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  subject: {
    type: DataTypes.STRING
  },
  content: {
    type: DataTypes.TEXT
  },
  isLock: {
    type: DataTypes.TINYINT
  }
}, {
  underscored: false,
  timestamps: false
})

const handleGetTemplates = async (where = {}, returnAsOption = false) => {
  const condition =
    Object.keys(where).length > 0
      ? {
          where: {
            ...where
          }
        }
      : null
  const templates = await emailTemplatesModel.findAll(condition)
  const result = []

  if (templates) {
    forEach(templates, (item, key) => {
      const pushItem = { ...item.dataValues }
      pushItem["isLock"] = parseInt(item.isLock) === 1
      if (returnAsOption) {
        pushItem = {
          ...pushItem,
          value: item._id,
          label: item.name
        }
      }

      result.push(pushItem)
    })
  }

  return result
}

const getTemplateDetail = async (id) => {
  const template = await emailTemplatesModel.findOne({
    where: {
      id: id
    }
  })

  if (template) {
    const newTemplate = {
      ...template.dataValues,
      isLock: parseInt(template.isLock) === 1
    }

    return newTemplate
  }

  return {}
}

const handleSaveTemplate = async (data) => {
  const saveResult = await emailTemplatesModel.create(data)
  return saveResult
}

const handleDeleteTemplate = async (id) => {
  const deleteResult = await emailTemplatesModel.destroy({
    where: {
      id: id
    }
  })

  return deleteResult
}

export {
  emailTemplatesModel,
  handleGetTemplates,
  getTemplateDetail,
  handleSaveTemplate,
  handleDeleteTemplate
}

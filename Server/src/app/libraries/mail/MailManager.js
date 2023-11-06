import { getSetting } from "#app/services/settings.js"
import { createTransport } from "nodemailer"
import { isEmpty, isArray, forEach } from "lodash-es"
import dayjs from "dayjs"
import { emailModel } from "#app/models/email.mysql.js"
import { Op } from "sequelize"
import {
  getTemplateDetail,
  handleGetTemplates,
  handleSaveTemplate,
  handleDeleteTemplate
} from "#app/models/email_templates.mysql.js"

const send = async (
  userId,
  subject,
  to,
  content,
  cc = null,
  bcc = null,
  attachments = [],
  overrideConfig = {},
  timer = null,
  idMail = null
) => {
  if (isEmpty(to)) {
    return false
  }

  const host = await getSetting("SMTPHost")
  const port = await getSetting("SMTPPort")
  const user = await getSetting("SMTPUser")
  const pass = await getSetting("SMTPPass")

  if (isEmpty(host) || isEmpty(user) || isEmpty(pass)) {
    return false
  }

  const config = {
    service: "gmail",
    port: port,
    host: host,
    secure: parseInt(port) === 465,
    secureConnection: false,
    auth: {
      user: user,
      pass: pass
    },
    tls: {
      rejectUnAuthorized: true
    },
    ...overrideConfig
  }

  const transporter = createTransport({
    ...config
  })

  let timeExpected = timer
  let timeReal = ""
  let respond = ""
  let result = true
  let status = "pending"

  if (isEmpty(timer)) {
    timeExpected = dayjs().format("YYYY-MM-DD HH:mm:ss")
    const sendInfo = await transporter.sendMail({
      from: user,
      to: to,
      subject: subject,
      text: "",
      html: content,
      cc: cc,
      bcc: bcc
    })

    if (sendInfo) {
      result = true
      status = "success"
      respond = sendInfo.messageId
      timeReal = dayjs().format("YYYY-MM-DD HH:mm:ss")
    } else {
      result = false
      status = "failed"
    }
  }

  

  if (idMail === null) {
    const log = {
      from: user,
      config: JSON.stringify(config),
      to: isArray(to) ? to.join(";", to) : to,
      cc: isArray(cc) ? cc.join(";", cc) : cc,
      bcc: isArray(to) ? bcc.join(";", bcc) : bcc,
      subject: subject,
      content: content,
      attachments: isArray(attachments)
        ? attachments.join(";", attachments)
        : attachments,
      status: status,
      respond: isArray(respond) ? JSON.stringify(respond) : respond,
      time_expected: timeExpected,
      time_real: timeReal
    }
    await emailModel.create(log, {
      __user: userId
    })
  } else {
    await emailModel.update({
      status: status,
      respond: isArray(respond) ? JSON.stringify(respond) : respond,
      time_real: timeReal
    }, {
      where: {
        id: idMail
      }
    })
  }
  

  return result
}

const getTemplates = async (condition = {}, returnAsOption = false) => {
  if (condition["_id"] === undefined) {
    const detail = await getTemplateDetail(condition["_id"])
    return detail
  }

  const list = await handleGetTemplates(condition, returnAsOption)
  return list
}

const saveTemplate = async (data) => {
  const saveResult = await handleSaveTemplate(data)

  return saveResult
}

const deleteTemplate = async (id) => {
  const deleteResult = await handleDeleteTemplate(id)

  return deleteResult
}

export { send, getTemplates, saveTemplate, deleteTemplate }

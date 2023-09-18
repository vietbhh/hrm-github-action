import { getOptionValue } from "#app/helpers/appOptionsHelper.js"
import { moduleModel } from "#app/libraries/modules/Modules.js"
import { Op } from "sequelize"
import { _saveWorkspace } from "../../workspace/controllers/workspace.js"

const addWorkgroupForDepartment = async (req, res, next) => {
  const id = req.params.id
  const model = await moduleModel("departments")
  const department = await model.findOne({
    attributes: ["id", "name", "custom_fields", "line_manager"],
    where: {
      id
    }
  })

  if (!department) return res.fail("department_not_found")
  const customFields = department?.custom_fields
    ? JSON.parse(department?.custom_fields)
    : {}

  if (!customFields.workgroup_id) {
    try {
      const employeesModel = await moduleModel("employees")
      const departmentEmployees = await employeesModel.findAll({
        attributes: ["id"],
        where: {
          department_id: department.id,
          status: {
            [Op.ne]: await getOptionValue("employees", "status", "resigned")
          },
          account_status: await getOptionValue(
            "employees",
            "account_status",
            "activated"
          )
        }
      })
      const members = []
      let admin = []
      if (department.line_manager) {
        admin = [department.line_manager]
      } else {
        members.push(1)
        admin.push(1)
      }

      for (const item of departmentEmployees) {
        members.push(item.id)
      }
      //create workgroup
      const dataSave = {
        name: department.name,
        description: "General workgroup of " + department.name,
        type: "private",
        mode: "hidden",
        membership_approval: "approver",
        system: true
      }
      const workgroup = await _saveWorkspace(
        dataSave,
        true,
        members,
        admin,
        req.__user
      )
      await department.update(
        {
          custom_fields: JSON.stringify({
            ...customFields,
            workgroup_id: workgroup._id
          })
        },
        {
          __user: req.__user
        }
      )
    } catch (err) {
      return res.fail("unable_create_workgroup")
    }
    //update workgroupid
    return res.respond("workgroup_created")
  } else {
    return res.fail("department_already_has_workgroup")
  }
}

export { addWorkgroupForDepartment }

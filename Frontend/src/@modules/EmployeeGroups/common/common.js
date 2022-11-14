import { useFormatMessage } from "@apps/utility/common"

export const getOperatorOption = () => {
    return {
        date: [
          {
            value: "after",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.date.after"
            )
          },
          {
            value: "after_or_euqal",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.date.after_or_euqal"
            )
          },
          {
            value: "before",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.date.before"
            )
          },
          {
            value: "before_or_equal",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.date.before_or_equal"
            )
          },
          {
            value: "is",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.date.is"
            )
          },
          {
            value: "is_not",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.date.is_not"
            )
          }
        ],
        text: [
          {
            value: "contain",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.text.contain"
            )
          },
          {
            value: "does_not_contain",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.text.does_not_contain"
            )
          },
          {
            value: "is",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.text.is"
            )
          },
          {
            value: "is_not",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.text.is_not"
            )
          },
          {
            value: "start_with",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.text.start_with"
            )
          }
        ],
        selectModule: [
          {
            value: "is",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.select_module.is"
            )
          },
          {
            value: "is_not",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.select_module.is_not"
            )
          }
        ],
        selectOption: [
          {
            value: "is",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.select_module.is"
            )
          },
          {
            value: "is_not",
            label: useFormatMessage(
              "modules.employee_groups.filters.operator.select_module.is_not"
            )
          }
        ]
      }
}
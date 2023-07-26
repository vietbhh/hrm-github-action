import badge1 from "../assets/images/badge/badge1.png"
import badge2 from "../assets/images/badge/badge2.png"
import badge3 from "../assets/images/badge/badge3.png"
import badge4 from "../assets/images/badge/badge4.png"
import badge5 from "../assets/images/badge/badge5.png"
import badge6 from "../assets/images/badge/badge6.png"
import badge7 from "../assets/images/badge/badge7.png"
import badge8 from "../assets/images/badge/badge8.png"
import badge9 from "../assets/images/badge/badge9.png"
import badge10 from "../assets/images/badge/badge10.png"
import badge11 from "../assets/images/badge/badge11.png"
import badge12 from "../assets/images/badge/badge12.png"
import badge13 from "../assets/images/badge/badge13.png"
import badge14 from "../assets/images/badge/badge14.png"
import badge15 from "../assets/images/badge/badge15.png"
import badge16 from "../assets/images/badge/badge16.png"
import { useFormatMessage } from "@apps/utility/common"
import { isEmpty } from "lodash"

export const getTabId = (tabText) => {
  if (tabText === "timeline" || tabText === undefined) {
    return 1
  } else if (tabText === "introduction") {
    return 2
  } else if (tabText === "workspace") {
    return 3
  } else if (tabText === "photo") {
    return 4
  } else if (tabText === "achievement") {
    return 5
  }

  return ""
}

export const listBadge = {
  badge1: badge1,
  badge2: badge2,
  badge3: badge3,
  badge4: badge4,
  badge5: badge5,
  badge6: badge6,
  badge7: badge7,
  badge8: badge8,
  badge9: badge9,
  badge10: badge10,
  badge11: badge11,
  badge12: badge12,
  badge13: badge13,
  badge14: badge14,
  badge15: badge15,
  badge16: badge16
}

export const getBadgeFromKey = (key) => {
  return listBadge?.[key] || ""
}

export const convertNumberOfDays = (numDay) => {
  if (numDay === null || numDay === undefined) {
    return ""
  }

  if (numDay === 0) {
    return useFormatMessage("modules.employees.text.few_while_ago")
  }
  
  if (numDay < 30) {
    return numDay + " " + useFormatMessage("common.days")
  }

  const month = numDay / 30
  if (month < 12) {
    return Math.floor(month) + " " + useFormatMessage("common.months")
  }

  const year = month / 12
  return Math.floor(year) + " " + useFormatMessage("common.years")
}

export const isJson = (str) => {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

import { isEmpty } from "lodash-es";

export const canUpdateData = (ability, module, userId, row) => {
  let canUpdate = false;
  if (ability.can("updateAll", module)) canUpdate = true;
  else {
    if (
      ability.can("update", module) &&
      !isEmpty(row.owner) &&
      (row.owner.value === userId ||
        (!isEmpty(row.update_permissions) &&
          row.update_permissions.some((viewPer) => viewPer.value === userId)))
    ) {
      canUpdate = true;
    }
  }
  return canUpdate;
};

export const canDeleteData = (ability, module, userId, row) => {
  let canDelete = false;
  //just owner or who have delete all permissions can delete record
  if (ability.can("deleteAll", module)) canDelete = true;
  else {
    if (
      ability.can("delete", module) &&
      !isEmpty(row.owner) &&
      row.owner.value === userId
    ) {
      canDelete = true;
    }
  }
  return canDelete;
};

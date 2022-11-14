<?php

namespace HRM\Modules\EmployeeGroups\Libraries\EmployeeGroups;

use HRM\Modules\Employees\Models\EmployeesModel;

class EmployeeGroups
{
    private $matchCriteriaTypeOption = '';
    private $specificEmployeeTypeOption = '';

    public function __construct()
    {
        helper('app_select_option');
        $this->matchCriteriaTypeOption = getOptionValue('setting_groups', 'type', 'match_criteria');
        $this->specificEmployeeTypeOption = getOptionValue('setting_groups', 'type', 'specific_employee');
    }

    // ** common function
    /**
     * Our configuration instance.
     *
     * @param employeeId employee id (int)
     *     */
    public function autoAddEmployeeToGroup($employeeId)
    {
        $modules = \Config\Services::modules();
        // get info employee
        $modelEmployee = new EmployeesModel();
        $infoEmployee  = $modelEmployee->asArray()->find($employeeId);

        if (!$infoEmployee) {
            return;
        }

        // get list group active
        $modules->setModule('groups');
        $model = $modules->model;
        $listGroup = $model
            ->asArray()
            ->select([
                'groups.id',
                'groups.name',
                'm_setting_groups.id as setting_group_id',
                'm_setting_groups.type',
                'm_setting_groups.condition',
                'm_setting_groups.auto_add_remove_employee'
            ])
            ->join('m_setting_groups', 'groups.id = m_setting_groups.group', 'inner')
            ->where('auto_add_remove_employee', 1)
            ->findAll();
        $arrValidGroup = [];
        foreach ($listGroup as $rowGroup) {
            $condition = json_decode($rowGroup['condition'], true);
            $listEmployee = [];
            if ($rowGroup['type'] == $this->matchCriteriaTypeOption) {
                $arrMeetAllCondition = $condition['meet_all'];
                $arrMeetAnyCondition = $condition['meet_any'];
                $arrExceptEmployee = $condition['except_employee'];

                if ($this->_checkIsEmptyCondition($arrMeetAllCondition) && $this->_checkIsEmptyCondition($arrMeetAnyCondition) && $this->_checkIsEmptyArray($arrExceptEmployee)) {
                    $listEmployee = [];
                } else {

                    $builder = $modelEmployee
                        ->exceptResigned()
                        ->select([
                            'id',
                            'full_name',
                            'avatar',
                            'email'
                        ]);
                    $builder = $this->_getBuilderCondition($builder, $arrMeetAllCondition, $arrMeetAnyCondition);
                    $listEmployee = $builder->findAll();
                    if (!$this->_checkIsEmptyArray($arrExceptEmployee)) {
                        foreach ($arrExceptEmployee as $rowExceptEmployee) {
                            foreach ($listEmployee as $keyEmployee => $rowEmployee) {
                                if ($rowEmployee['id'] === $rowExceptEmployee) {
                                    unset($listEmployee[$keyEmployee]);
                                }
                            }
                        }
                        $listEmployee = array_values($listEmployee);
                    }
                    $listEmployee =  array_column($listEmployee, 'id');
                }
            } else if ($rowGroup['type'] == $this->specificEmployeeTypeOption) {
                $arrSpecificEmployee = $condition['specific_employee'];
                $listEmployee =  $arrSpecificEmployee;
            }

            if (count($listEmployee) > 0 && in_array($employeeId, $listEmployee)) {
                $arrValidGroup[] = $rowGroup['id'];
            }
        }

        //get list employee group
        $modules->setModule('employee_groups');
        $modelEmployeeGroups =  $modules->model;
        if (count($arrValidGroup) > 0) {
            $listEmployeeGroup = $modelEmployeeGroups->asArray()->whereIn('group', $arrValidGroup)->findAll();

            foreach ($arrValidGroup as $key => $row) {
                foreach ($listEmployeeGroup as $rowEmployeeGroup) {
                    if ($rowEmployeeGroup['id'] == $employeeId && $rowEmployeeGroup['group'] == $row) {
                        continue 2;
                    }
                }

                $dataInsert = [
                    'employee' =>  $employeeId,
                    'group' => $row
                ];
                $modelEmployeeGroups->setAllowedFields(array_keys($dataInsert));
                $modelEmployeeGroups->save($dataInsert);
            }
        }
    }

    // ** support function
    public function _getBuilderCondition($builder, $arrMeetAllCondition, $arrMeetAnyCondition)
    {
        $builderTemp = $builder;

        if (!$this->_checkIsEmptyCondition($arrMeetAllCondition)) {
            $builderTemp->groupStart();
            foreach ($arrMeetAllCondition as $key => $row) {
                if ($row['field'] != "") {
                    $fieldOperator = $this->_convertOperator($row['operator']);
                    $field = $row['field']['field'];
                    $value = $row['value'];
                    if ($fieldOperator == '') {
                        continue;
                    }

                    if ($value == '') {
                        continue;
                    }

                    if ($row['operator'] == 'contain') {
                        $builderTemp->like($field, $value, 'both');
                    } else if ($row['operator'] == 'does_not_contain') {
                        $builderTemp->notLike($field, $value);
                    } else if ($row['operator'] == 'start_with') {
                        $builderTemp->like($field, $value, 'after');
                    } else if ($row['operator'] == 'is') {
                        $builderTemp->where($field, $value);
                    } else if ($row['operator'] == 'is_not') {
                        $builderTemp->where($field . '!=', $value);
                    } else {
                        $builderTemp->where($field . ' ' . $fieldOperator, $value);
                    }
                }
            }
            $builderTemp->groupEnd();
        }

        if (!$this->_checkIsEmptyCondition($arrMeetAnyCondition)) {
            $builderTemp->groupStart();
            foreach ($arrMeetAnyCondition as $key => $row) {
                if ($row['field'] != "") {
                    $fieldOperator = $this->_convertOperator($row['operator']);
                    $field = $row['field']['field'];
                    $value = $row['value'];
                    if ($fieldOperator == '') {
                        continue;
                    }

                    if ($value == '') {
                        continue;
                    }

                    if ($row['operator'] == 'contain') {
                        $builderTemp->orLike($field, $value, 'both');
                    } else if ($row['operator'] == 'does_not_contain') {
                        $builderTemp->orNotLike($field, $value);
                    } else if ($row['operator'] == 'start_with') {
                        $builderTemp->orLike($field, $value, 'after');
                    } else if ($row['operator'] == 'is') {
                        $builderTemp->orWhere($field, $value);
                    } else if ($row['operator'] == 'is_not') {
                        $builderTemp->orWhere($field . '!=', $value);
                    } else {
                        $builderTemp->orWhere($field . ' ' . $fieldOperator, $value);
                    }
                }
            }
            $builderTemp->groupEnd();
        }

        return $builderTemp;
    }

    public function _checkIsEmptyCondition($arrCondition)
    {
        $isEmpty = true;
        foreach ($arrCondition as $key => $row) {
            if ($row['field'] != '' && $row['operator'] != '' && $row['value'] != '') {
                $isEmpty = false;
                break;
            }
        }

        return $isEmpty;
    }

    public function _checkIsEmptyArray($array)
    {
        $array = array_filter($array);
        if (count($array) == 0) {
            return true;
        }

        $isEmpty = true;
        foreach ($array as $row) {
            if (is_array($row) && count($row) > 0) {
                $isEmpty = $this->_checkIsEmptyArray($row);
            } else if ($row != '' && strlen(trim($row)) > 0) {
                $isEmpty = false;
                break;
            }
        }

        return $isEmpty;
    }

    private function _convertOperator($operator)
    {
        switch ($operator) {
            case 'after':
                return '>';
                break;
            case 'after_or_equal':
                return '>=';
                break;
            case 'before':
                return '<';
                break;
            case 'before_or_equal':
                return '<=';
                break;
            case 'is':
                return '=';
                break;
            case 'is_not':
                return '!=';
                break;
            case 'contain':
                return 'contain';
                break;
            case 'does_not_contain':
                return 'does_not_contain';
                break;
            case 'start_with':
                return 'start_with';
                break;
            default:
                return '';
                break;
        }
    }
}

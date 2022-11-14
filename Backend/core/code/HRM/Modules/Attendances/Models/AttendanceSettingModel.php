<?php

namespace HRM\Modules\Attendances\Models;

use App\Models\AppModel;

class AttendanceSettingModel extends AppModel
{
	protected $table = 'm_attendance_setting';
	protected $primaryKey = 'id';
	protected $useAutoIncrement = true;
	protected $returnType = 'array';
	protected $useSoftDeletes = false;
	protected $allowedFields = [];
	protected $useTimestamps = false;
	protected $createdField = 'created_at';
	protected $updatedField = 'updated_at';
	protected $deletedField = 'deleted_at';

}
<?php

namespace HRM\Modules\TimeOff\Models;

use App\Models\AppModel;

class TimeOffHolidaysModel extends AppModel
{
	protected $table = 'm_time_off_holidays';
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
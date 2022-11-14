<?php

namespace HRM\Modules\Attendances\Models;

use App\Models\AppModel;

class AttendancesModel extends AppModel
{
	protected $table = 'm_attendances';
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
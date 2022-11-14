<?php

namespace HRM\Modules\TimeOff\Models;

use App\Models\AppModel;

class TimeOffRequestsModel extends AppModel
{
	protected $table = 'm_time_off_requests';
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
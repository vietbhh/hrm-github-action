<?php

namespace HRM\Modules\Attendances\Models;

use App\Models\AppModel;

class AttendanceDetailModel extends AppModel
{
	protected $table = 'm_attendance_details';
	protected $primaryKey = 'id';
	protected $useAutoIncrement = true;
	protected $returnType = 'array';
	protected $useSoftDeletes = false;
	protected $allowedFields = ['attendance','name','employee','date','clock_in','clock_in_location','clock_in_location_type','clock_out_location','clock_out_location_type','clock_out','is_clock_in_attendance','last_clock_in','status','logged_time','paid_time','overtime'];
	protected $useTimestamps = false;
	protected $createdField = 'created_at';
	protected $updatedField = 'updated_at';
	protected $deletedField = 'deleted_at';

}
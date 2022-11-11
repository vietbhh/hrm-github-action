<?php namespace Tatter\Permits\Models;

use CodeIgniter\Model;

class PermitModel extends Model
{
	protected $table      = 'auth_permissions';
	protected $primaryKey = 'id';

	protected $returnType     = 'object';
	protected $useSoftDeletes = false;

	protected $allowedFields = [
		'name',
		'description',
		'module', //erp custom
		'route', //erp custom,
		'default'  //erp custom,
	];

	protected $useTimestamps = false;

	protected $validationRules    = [];
	protected $validationMessages = [];
	protected $skipValidation     = false;
}

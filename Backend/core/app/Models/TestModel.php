<?php namespace App\Models;

use CodeIgniter\Model;

class TestModel extends \Tatter\Permits\Model
{
	protected $table = 'test';
	protected $allowedFields = [
		'name', 'email'
	];
	protected $returnType = 'App\Models\TestEntity';
	protected $useTimestamps = true;
	protected $protectFields = true;
	protected $skipValidation = true;
	protected $validationRules = [
		'firstname' => 'required|min_length[6]',
		'lastname' => 'required|min_length[3]',
		'name' => 'required|alpha_numeric_space|min_length[6]',
		'email' => 'required|valid_email|is_unique[test.email,id,{$id}]',
		'password' => 'required|min_length[8]',
		// 'password_confirm' => 'required_with[password]|matches[password]'
		// 'password_confirm' => 'matches[password]'
	];

	protected $validationMessages = [
		'email' => [
			'is_unique' => 'Sorry. That email has already been taken. Please choose another.'
		]
	];

	//Audits
	use \Tatter\Audits\Traits\AuditsTrait;

	protected $beforeInsert = ['ownerInsert'];
	protected $beforeUpdate = ['lastUpdate'];
	protected $afterInsert = ['auditInsert'];
	protected $afterUpdate = ['auditUpdate'];
	protected $afterDelete = ['auditDelete'];

}

?>
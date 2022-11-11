<?php namespace App\Models;

use Halo\Modules\Models\EmptyModel;

class AppModel extends EmptyModel
{
	protected $table = '';
	protected $primaryKey = 'id';
	protected $allowedFields = [];
	protected $returnType = 'object';
	protected $useTimestamps = true;
	protected $protectFields = true;
	protected $skipValidation = true;
	protected $validationRules = [];
	protected $validationMessages = [];
}

?>
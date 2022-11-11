<?php namespace App\Entities;

use CodeIgniter\Entity\Entity;
use Myth\Auth\Authorization\GroupModel;
use Myth\Auth\Authorization\PermissionModel;

class Employee extends Entity
{
	public function setIdUser(string $id)
	{
		$this->attributes['users_id'] = $id;
	}

}

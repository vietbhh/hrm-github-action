<?php namespace App\Libraries\Mail\Models;

use App\Models\AppModel;
use CodeIgniter\Model;

class EmailModel extends Model
{
	protected $table = 'email';
	protected $primaryKey = 'id';
	protected $returnType = 'array';
	protected $useSoftDeletes = false;
	protected $allowedFields = ['config', 'subject', 'content', 'attachments', 'from', 'to', 'cc', 'bcc', 'owner', 'status', 'respond', 'time_expected', 'time_real', 'created_at'];
	protected $useTimestamps = true;
	protected $createdField = 'created_at';
	protected $validationRules = [];
	protected $validationMessages = [];
	protected $skipValidation = false;

	public function getTemplates($where = [], $returnAsOption = false)
	{
		$model = new AppModel();
		$model->setTable('email_templates');
		$templates = $model->asArray()->where($where)->findAll();
		if ($templates) {
			foreach ($templates as $key => $item) {
				$templates[$key]['isLock'] = (filter_var($templates[$key]['isLock'], FILTER_VALIDATE_BOOLEAN));
				if ($returnAsOption) {
					$templates[$key]['value'] = $item['id'];
					$templates[$key]['label'] = $item['name'];
				}
			}
		}
		return $templates;
	}

	public function getTemplateDetail($id)
	{
		$model = new AppModel();
		$model->setTable('email_templates');
		$template = $model->asArray()->find($id);
		if ($template) $template['isLock'] = (filter_var($template['isLock'], FILTER_VALIDATE_BOOLEAN));
		return $template;
	}

	public function saveTemplate($data)
	{
		$model = new AppModel();
		$model->setTable('email_templates')->setAllowedFields(['name', 'source', 'subject', 'category', 'content']);
		return $model->save($data);
	}

	public function deleteTemplate($id)
	{
		$model = new AppModel();
		return $model->delete($id);
	}

}

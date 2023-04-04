<?php

namespace HRM\Modules\FriNet\Controllers;

use App\Controllers\ErpController;

class User extends ErpController
{
	public function get_user_get($identity)
	{
		$modules = \Config\Services::modules("employees");
		$model = $modules->model;
		$whereKey = 'id';
		if (!is_numeric($identity)) {
			$whereKey = 'username';
		}
		$data = $model->asArray()->where($whereKey, $identity)->first();
		if (!$data) {
			return $this->failNotFound(NOT_FOUND);
		}

		return $this->respond(handleDataBeforeReturn($modules, $data));
	}

	public function save_cover_image_post()
	{
		$modules = \Config\Services::modules('employees');
		$model = $modules->model;
		$postData = $this->request->getPost();
		$employeeData = isset($postData['employeeData']) ? $postData['employeeData'] : false;
		$image =  isset($postData['image']) ? $postData['image'] : false;
		if (!$employeeData || !$image) {
			return $this->fail(MISSING_REQUIRED);
		}

		$uploadService = \App\Libraries\Upload\Config\Services::upload();

		try {
			$employeeId = $employeeData['id'];
			$storePath = getModuleUploadPath('employees', $employeeId, false) . 'other/';
			$filename = $employeeId . '_cover_image.png';
			$image = substr($image, strpos($image, ',') + 1);
			$image = str_replace(' ', '+', $image);
			$image = base64_decode($image);
			$paths = $uploadService->uploadFile($storePath, [[
				'filename' => $filename,
				'filesize' => 0,
				'content' => $image
			]], true);

			if (isset($paths['last_uploaded']) && count($paths['last_uploaded']) > 0) {
				$model->setAllowedFields(['cover_image']);
				$dataSave = [
					'id' => $employeeId,
					'cover_image' => [$paths['last_uploaded']['url']]
				];
				$model->save($dataSave);

				$infoEmployee = $model->select(['id', 'cover_image'])->find($employeeId);
				return $this->respond($infoEmployee);
			}
		} catch (\Exception $err) {
			return $this->fail(FAILED_SAVE);
		}
	}
}

<?php

namespace App\Controllers;

use App\Models\AppModel;
use App\Models\UserModel;

class HeaderAssistant extends ErpController
{
	protected $secondLoadWeather = 300;

	public function get_header_assistant_get()
	{
		$data_custom = $this->getHeaderAssistant();
		$userModel = new UserModel();
		$month = date('m');
		$day = date('d');
		$data_birthday = $userModel->select(["id", "full_name"])->where("Month(dob) = '$month'")->where("DAY(dob) = '$day'")->asArray()->findAll();
		$result['data_birthday'] = $this->_renderBirthday($data_birthday);
		$result['data_custom'] = $data_custom;
		return $this->respond($result);
	}

	public function get_weather_get()
	{
		/** get location*/
		$city_name = "Hanoi";
		$lat = 21.0278;
		$lon = 105.834;
		$ip = $_SERVER['REMOTE_ADDR'];
		$findip_token = preference("findip_token");
		$crl = curl_init();
		$URL = "https://api.findip.net/$ip/?token=$findip_token";
		curl_setopt($crl, CURLOPT_URL, $URL);
		curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
		$findip_res = curl_exec($crl);
		if ($findip_res != 'null' && !empty($findip_res)) {
			$findip_res = json_decode($findip_res, true);
			if (!empty($findip_res)) {
				$city_name = $findip_res['city']['names']['en'];
				$lat = $findip_res['location']['latitude'];
				$lon = $findip_res['location']['longitude'];
			}
		}

		/** get weather*/
		$current_time = date("Y-m-d H:i:s");
		$weather_location = preference("weather_location");
		if (!empty($weather_location)) {
			if (isset($weather_location[$city_name])) {
				$time = $weather_location[$city_name]['time'];
				$second = strtotime($current_time) - strtotime($time);
				if ($second >= $this->secondLoadWeather) {
					$result = $this->getWeather($city_name, $lat, $lon, $weather_location);
				} else {
					$result = ['temp' => $weather_location[$city_name]['temp'], 'main' => $weather_location[$city_name]['main'], 'content' => rand(1, 10)];
				}
			} else {
				$result = $this->getWeather($city_name, $lat, $lon, $weather_location);
			}
		} else {
			$result = $this->getWeather($city_name, $lat, $lon, $weather_location);
		}

		return $this->respond($result);
	}

	public function get_header_assistant_all_get()
	{
		$model = new AppModel();
		$model->setTable("header_assistant");
		$data = $model->orderBy("id", "desc")->findAll();
		return $this->respond($data);
	}

	public function save_header_assistant_post()
	{
		if (!hasPermission("custom.header_assistant.manage")) return $this->failForbidden(MISSING_ACCESS_PERMISSION);

		$params = $this->request->getPost();
		$image = $this->request->getFiles();
		$model = new AppModel();
		$model->setTable("header_assistant");
		$model->setAllowedFields(["title", "content", "image", "image_position", "date_from", "date_to"]);

		try {
			$data = [
				'title' => $params['title'],
				'content' => $params['content'],
				'image_position' => $params['image_position'],
				'date_from' => date("Y-m-d", strtotime($params['date_from'])),
				'date_to' => date("Y-m-d", strtotime($params['date_to']))
			];
			if (isset($params['id']) && !empty($params['id'])) {
				$data['id'] = $params['id'];
			}

			$model->save($data);
			$id = $data['id'] ?? $model->getInsertID();

			if (!isset($params['image'])) {
				if (!empty($image)) {
					$uploadService = \App\Libraries\Upload\Config\Services::upload();
					$storePath = getModuleUploadPath('header_assistant', $id, false);
					$result = $uploadService->uploadFile($storePath, $image['image']);
					if (!empty($result)) {
						$model->save(['id' => $id, 'image' => $result['arr_upload_file'][0]['url']]);
					}
				} else {
					$model->save(['id' => $id, 'image' => ""]);
				}
			} else {
				$model->save(['id' => $id, 'image' => $params['image']]);
			}
		} catch (\Exception $e) {
			return $this->failServerError($e->getMessage());
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function get_delete_header_assistant_get($id)
	{
		if (!hasPermission("custom.header_assistant.manage")) return $this->failForbidden(MISSING_ACCESS_PERMISSION);

		$model = new AppModel();
		$model->setTable("header_assistant");
		$model->where('id', $id)->delete();
		return $this->respond(ACTION_SUCCESS);
	}

	public function get_data_header_assistant_get($id)
	{
		if (!hasPermission("custom.header_assistant.manage")) return $this->failForbidden(MISSING_ACCESS_PERMISSION);

		$model = new AppModel();
		$model->setTable("header_assistant");
		$data = $model->where('id', $id)->first();
		$data->date_from = date("d-m-Y", strtotime($data->date_from));
		$data->date_to = date("d-m-Y", strtotime($data->date_to));
		return $this->respond($data);
	}

	/** support function */
	protected function getWeather($city_name, $lat, $lon, $weather_location)
	{
		$oepnweathermap_token = preference("oepnweathermap_token");
		$crl = curl_init();
		$URL = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$oepnweathermap_token";
		curl_setopt($crl, CURLOPT_URL, $URL);
		curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
		$res = curl_exec($crl);
		$res = json_decode($res, true);
		if (!empty($res)) {
			$temp = round($res['main']['temp'] - 273.15);
			$main = strtolower($res['weather'][0]['main']);
			$weather_location[$city_name] = [
				'temp' => $temp,
				'main' => $main,
				'time' => date('Y-m-d H:i:s')
			];
			preference("weather_location", $weather_location, true);
			return ['temp' => $temp, 'main' => $main, 'content' => rand(1, 10)];
		}

		return [];
	}

	protected function _renderBirthday($data)
	{
		$content_birthday = [];
		foreach ($data as $item) {
			$content_birthday[] = rand(1, 14);
		}

		return ["data" => $data, "content" => $content_birthday];
	}

	protected function getHeaderAssistant()
	{
		$model = new AppModel();
		$model->setTable("header_assistant");
		$datetoday = date("Y-m-d");
		return $model->where("'$datetoday' between date_from and date_to")->orderBy("id", "desc")->findAll();
	}
}
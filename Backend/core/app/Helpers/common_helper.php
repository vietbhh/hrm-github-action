<?php
if (!function_exists('removeComma')) {
	function removeComma($str)
	{
		return str_replace(',', '', $str);
	}
}

if (!function_exists('vd')) {
	function vd($x, $exit = 0)
	{
		echo $res = "<pre>";
		if (is_array($x) || is_object($x)) {
			echo print_r($x);
		} else {
			echo var_dump($x);
		}
		echo "</pre><hr/>";
		if ($exit == 1) {
			die();
		}
	}
}

if (!function_exists('cleanString')) {
	function cleanString($str)
	{
		$str = str_replace('\"', '"', $str);
		$str = str_replace("\'", "'", $str);
		return $str;
	}
}

if (!function_exists('cleanStringUnicode')) {
	function cleanStringUnicode($string): string
	{
		$string = trim(strip_tags($string));
		$search = array(
			'#(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)#',
			'#(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)#',
			'#(ì|í|ị|ỉ|ĩ)#',
			'#(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)#',
			'#(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)#',
			'#(ỳ|ý|ỵ|ỷ|ỹ)#',
			'#(đ)#',
			'#(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)#',
			'#(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)#',
			'#(Ì|Í|Ị|Ỉ|Ĩ)#',
			'#(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)#',
			'#(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)#',
			'#(Ỳ|Ý|Ỵ|Ỷ|Ỹ)#',
			'#(Đ)#',
			"/[^a-zA-Z0-9\-\_]/",
		);
		$replace = array(
			'a',
			'e',
			'i',
			'o',
			'u',
			'y',
			'd',
			'A',
			'E',
			'I',
			'O',
			'U',
			'Y',
			'D',
			'-',
		);
		return preg_replace($search, $replace, $string);
	}
}

if (!function_exists('setKeyVal')) {
	function setKeyVal($data, $value)
	{
		$tmp = false;
		if ($data && count($data)) {
			foreach ($data as $key => $val) {
				$tmp[$val['id']] = $val[$value];
			}
		}
		return $tmp;
	}
}

if (!function_exists('randomString')) {
	function randomString($length = 10): string
	{
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, strlen($characters) - 1)];
		}
		return $randomString;
	}
}

function str_replace_first($from, $to, $content)
{
	$from = '/' . preg_quote($from, '/') . '/';

	return preg_replace($from, $to, $content, 1);
}


if (!function_exists('arrayKey')) {
	function arrayKey($array, $key, $value = '*', $forceArray = false): array
	{
		$result = [];
		foreach ($array as $item) {
			if (is_array($item)) {
				if (isset($item[$key])) {
					if ($value === '*' || empty($value)) {
						$result[$item[$key]] = $item;
					} else {
						$result[$item[$key]] = $item[$value];
					}
				}
			} else {
				if (isset($item->$key)) {
					if ($value === '*' || empty($value)) {
						$result[$item->$key] = ($forceArray) ? (array)$item : $item;
					} else {
						$result[$item->$key] = $item->$value;
					}
				}
			}

		}
		return $result;
	}
}
if (!function_exists('safeFileName')) {
	function safeFileName($theValue): string
	{
		$_trSpec = array(
			'Ç' => 'C',
			'Ğ' => 'G',
			'İ' => 'I',
			'Ö' => 'O',
			'Ş' => 'S',
			'Ü' => 'U',
			'ç' => 'c',
			'ğ' => 'g',
			'ı' => 'i',
			'i' => 'i',
			'ö' => 'o',
			'ş' => 's',
			'ü' => 'u',
		);
		$enChars = array_values($_trSpec);
		$trChars = array_keys($_trSpec);
		$theValue = str_replace($trChars, $enChars, $theValue);
		$theValue = preg_replace("@[^A-Za-z0-9\-_.\/]+@i", "-", $theValue);
		return $theValue;
	}
}

if (!function_exists('getStoreUploadPath')) {
	function getStoreUploadPath(): string
	{
		return WRITEPATH . $_ENV['data_folder'] . '/';
	}
}

if (!function_exists('getModuleUploadPath')) {
	function getModuleUploadPath($module = '', $id = '', $withStorePath = true): string
	{
		$storePath = $withStorePath ? getStoreUploadPath() : '/';
		$path = $storePath . $_ENV['data_folder_module'] . '/';
		if (!empty($module)) $path .= $module . '/';
		if (!empty($id)) $path .= $id . '/';
		return $path;
	}
}

if (!function_exists('validateFiles')) {
	/**
	 * @throws Exception
	 */
	function validateFiles($file): bool
	{
		$allowTypes = explode(';', preference('uploadFileTypeAllow'));
		$fileType = $file->getClientExtension();
		if (!in_array($fileType, $allowTypes)) {
			throw new Exception(FILE_NOT_ALLOWED);
		}
		$allowSize = preference('maxFileSize');
		if ($file->getSize() > $allowSize) {
			throw new Exception(FILE_TOO_LARGE);
		}
		return true;
	}
}


if (!function_exists('formatDate')) {
	function formatDate($date, $format = 'date')
	{
		if ($format === 'date') $f = 'Y-m-d';
		if ($format === 'datetime') $f = 'Y-m-d H:i:s';
		elseif ($format === 'time') $f = 'H:i:s';
		else $f = $format;
		return date($f, strtotime($date));
	}
}


if (!function_exists('createSlug')) {
	function createSlug($str, $delimiter = '-'): string
	{
		$slug = strtolower(trim(preg_replace('/[\s-]+/', $delimiter, preg_replace('/[^A-Za-z0-9-]+/', $delimiter, preg_replace('/[&]/', 'and', preg_replace('/[\']/', '', iconv('UTF-8', 'ASCII//TRANSLIT', $str))))), $delimiter));
		return $slug;
	}
}

if (!function_exists('modifyDate')) {
	function modifyDate($date, $dayNumber, $method = '+', $format = 'Y-m-d')
	{
		$datetime = new DateTime($date);
		$datetime->modify($method . $dayNumber . ' day');
		return $datetime->format($format);
	}
}

if (!function_exists('create_slug')) {
	function create_slug($string)
	{
		$search = array(
			'#(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)#',
			'#(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)#',
			'#(ì|í|ị|ỉ|ĩ)#',
			'#(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)#',
			'#(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)#',
			'#(ỳ|ý|ỵ|ỷ|ỹ)#',
			'#(đ)#',
			'#(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)#',
			'#(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)#',
			'#(Ì|Í|Ị|Ỉ|Ĩ)#',
			'#(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)#',
			'#(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)#',
			'#(Ỳ|Ý|Ỵ|Ỷ|Ỹ)#',
			'#(Đ)#',
			"/[^a-zA-Z0-9\-\_]/",
		);
		$replace = array(
			'a',
			'e',
			'i',
			'o',
			'u',
			'y',
			'd',
			'A',
			'E',
			'I',
			'O',
			'U',
			'Y',
			'D',
			'-',
		);
		$string = preg_replace($search, $replace, $string);
		$string = preg_replace('/(-)+/', '-', $string);
		$string = strtolower($string);
		return $string;
	}
}

if (!function_exists('array_merge_deep')) {
	/*
	 * $merged = array_merge_deep([$ar_1, $ar_2]);
	 * */
	function array_merge_deep($arrays)
	{
		$result = array();
		foreach ($arrays as $array) {
			foreach ($array as $key => $value) {
				// Renumber integer keys as array_merge_recursive() does. Note that PHP
				// automatically converts array keys that are integer strings (e.g., '1')
				// to integers.
				if (is_integer($key)) {
					$result[] = $value;
				} elseif (isset($result[$key]) && is_array($result[$key]) && is_array($value)) {
					$result[$key] = array_merge_deep(array(
						$result[$key],
						$value,
					));
				} else {
					$result[$key] = $value;
				}
			}
		}
		return $result;
	}
}

?>
<?php
if (!function_exists('layoutView')) {
	function layoutView($viewPath, $data = [], $option = [], $layout = 'layout'): string
	{
		$view = "CLIENT\Views\default\\" . $layout;
		$data['viewPath'] = $viewPath;

		return view($view, $data, $option);
	}
}

if (!function_exists('blankView')) {
	function blankView($viewPath, $data = [], $option = []): string
	{
		$view = "CLIENT\Views\default\\" . $viewPath;
		return view($view, $data, $option);
	}
}


if (!function_exists('getMailTemplates')) {
	function getMailTemplates($templatesPath, $data = [], $option = []): string
	{
		$language = preference('language', null, false, $data['data']['receiver_id']);
		$view = $templatesPath . '_' . (empty($language) ? 'en' : $language);
		return view($view, $data, $option);
	}
}
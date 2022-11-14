<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for News ***/
$routes->get('news/load-news', 'News::load_news_get',['namespace' => 'HRM\Modules\News\Controllers']);
$routes->post('news/add-news', 'News::add_news_post',['namespace' => 'HRM\Modules\News\Controllers']);
$routes->get('news/get-employees-by-department', 'News::get_employees_by_department_get',['namespace' => 'HRM\Modules\News\Controllers']);
$routes->post('news/upload-image', 'News::upload_image_post',['namespace' => 'HRM\Modules\News\Controllers']);
$routes->get('news/image', 'News::image_get',['namespace' => 'HRM\Modules\News\Controllers']);
$routes->get('news/delete-news/(:any)', 'News::delete_news_get/$1',['namespace' => 'HRM\Modules\News\Controllers']);
$routes->get('news/get-news-detail/(:any)', 'News::get_news_detail_get/$1',['namespace' => 'HRM\Modules\News\Controllers']);
$routes->post('news/save-comment', 'News::save_comment_post',['namespace' => 'HRM\Modules\News\Controllers']);
$routes->get('news/load-more-comments', 'News::load_more_comments_get',['namespace' => 'HRM\Modules\News\Controllers']);
$routes->post('news/edit-comment', 'News::edit_comment_post',['namespace' => 'HRM\Modules\News\Controllers']);
$routes->get('news/delete-comment/(:any)', 'News::delete_comment_get/$1',['namespace' => 'HRM\Modules\News\Controllers']);

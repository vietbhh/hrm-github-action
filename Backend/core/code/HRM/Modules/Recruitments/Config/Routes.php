<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Recruitments ***/
$routes->get('recruitments/load-approve', 'Recruitments::load_approve_get',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->get('recruitments/load-job', 'Recruitments::loadJob_get',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->get('recruitments/load-candidate', 'Recruitments::load_candidate_get',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->get('recruitments/job/(:any)', 'Recruitments::job_get/$1',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->get('recruitments/change-status/(:any)/(:any)', 'Recruitments::change_status_get/$1/$2',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->post('recruitments/change-stage/(:any)', 'Recruitments::change_stage_post/$1',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->get('recruitments/check-candidate-interview-schedule/(:any)/(:any)', 'Recruitments::check_candidate_interview_schedule_get/$1/$2',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->get('recruitments/activity/(:any)', 'Recruitments::activity_get/$1',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->get('recruitments/info/(:any)', 'Recruitments::info_get/$1',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->post('recruitments/add', 'Recruitments::add_post',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->post('recruitments/add-candidate', 'Recruitments::add_candidate_post',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->get('recruitments/candidate-info/(:any)', 'Recruitments::candidate_info_get/$1',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->post('recruitments/approve/(:any)', 'Recruitments::approve_post/$1',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->post('recruitments/load-cv', 'Recruitments::load_cv_post',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->post('recruitments/load-content-cv', 'Recruitments::load_content_cv_post',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->get('recruitments/load-employee-email', 'Recruitments::load_employee_email_get',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->post('recruitments/delete-list-file-cv', 'Recruitments::delete_list_file_cv_post',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->post('recruitments/import-cv', 'Recruitments::import_cv_post',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->post('recruitments/delete-old-cv', 'Recruitments::delete_old_cv_post',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->add('recruitments/check-exist-job', 'Recruitments::checkExistJob',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->get('recruitments/tags-sources', 'Recruitments::tags_sources_get',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->get('recruitments/load-email-template', 'Recruitments::load_email_template_get',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->add('recruitments/email-template', 'Recruitments::email_template',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->post('recruitments/save-general', 'Recruitments::save_general_post',['namespace' => 'HRM\Modules\Recruitments\Controllers']);
$routes->get('recruitments/export-candidates', 'Recruitments::export_candidates_get',['namespace' => 'HRM\Modules\Recruitments\Controllers']);

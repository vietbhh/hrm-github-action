<?php

namespace App\Libraries\Upload;

use App\Libraries\Upload\GoogleCloudStorage;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use ZipArchive;

class Upload
{
    private $uploadType = '';
    private $googleCloudStorage = '';
    private $bucketName = '';

    public function __construct()
    {
        $this->uploadType = preference('upload_type');
        $this->googleCloudStorage = new GoogleCloudStorage();
        $this->bucketName = empty($_ENV['gcs_bucket_name']) ? 'friday-storage' : $_ENV['gcs_bucket_name'];
    }

    /**
     *  $storePath = getModuleUploadPath($module, $id, true) . 'data/';
     *  $storePathForDownload = '/' . $_ENV['data_folder_module'] . '/'.$module.'/' . $id . '/data/';
     *  $listFile: list file upload
     **/
    public function uploadFile($storePath, $listFile, $uploadByFileContent = false, $safeFilename = '')
    {
        helper('filesystem');
        if ($storePath == '') {
            return false;
        }

        if ($this->uploadType == 'direct') {
            return $this->_handleUploadDirect($storePath, $listFile, $uploadByFileContent, $safeFilename);
        } else if ($this->uploadType == 'cloud_storage') {
            return $this->_handleUploadCloudStorage($storePath, $listFile, $uploadByFileContent, $safeFilename);
        }
    }

    public function removeFile($path)
    {
        if ($this->uploadType == 'direct') {
            $storePath = WRITEPATH . $_ENV['data_folder'] . '/' . $path;
            if (is_file($storePath)) {
                unlink($storePath);
            }
        } elseif ($this->uploadType == 'cloud_storage') {
            $storePathForDownload = $path;
            $storage = $this->googleCloudStorage->storage();
            $bucket = $storage->bucket($this->bucketName);
            $object = $bucket->object('default' . $storePathForDownload);
            $object->delete();
        }
    }

    public function copyFile($pathFrom, $pathTo, $filename)
    {
        if ($this->uploadType == 'direct') {
            $storePathFrom =  WRITEPATH . $_ENV['data_folder'] . $pathFrom;
            $storePathTo =  WRITEPATH . $_ENV['data_folder'] . $pathTo;
            if (!is_dir($storePathTo)) {
                mkdir($storePathTo, 0777, true);
            }
            $filePathFrom = $storePathFrom . $filename;
            if (is_file($filePathFrom)) {
                $filePathTo = $storePathTo . $filename;
                copy($filePathFrom, $filePathTo);
            }
        } elseif ($this->uploadType == 'cloud_storage') {
            $storePathForDownloadFrom = $pathFrom;
            $storePathForDownloadTo = $pathTo;
            $storage = $this->googleCloudStorage->storage();
            $bucket = $storage->bucket($this->bucketName);
            $sourceObject = $storePathForDownloadFrom . $filename;
            $object = $bucket->object('default' . $sourceObject);
            $content = $object->downloadAsString();
            $size = $object->size;
        }
    }

    public function downloadFolder($path, $uploadFilename, $zipFilename, $arrSubFolderName = [])
    {
        $zipFile = $zipFilename . '.zip';
        if ($this->uploadType == 'direct') {
            if (count($arrSubFolderName) == 0) {
                $this->_downloadIndividualFolder($path, $zipFile);
            } else {
                $this->_downloadNestedFolder($path, $zipFile, $arrSubFolderName);
            }
        } elseif ($this->uploadType == 'cloud_storage') {
            $storePathForDownload = $path;
            $storage = $this->googleCloudStorage->storage();
            $bucket = $storage->bucket($this->bucketName);
            $zip = new ZipArchive();
            if ($zip->open($zipFile, (ZipArchive::CREATE | ZipArchive::OVERWRITE))) {
                foreach ($uploadFilename as $file) {
                    $path = 'default' . $storePathForDownload . $file['filename'];
                    $object = $bucket->object($path);
                    $content = $object->downloadAsString();
                    $zip->addFromString($file['filename'], $content);
                }
            }
            $zip->close();
            header('Cache-Control: public');
            header('Content-Description: File Transfer');
            header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK');
            header("Content-Type: application/zip");
            header("Content-Transfer-Encoding: Binary");
            header("Content-Length: " . filesize($zipFile));
            header("Content-Disposition: attachment; filename=\"" . basename($zipFile) . "\"");
            readfile($zipFile);
            unlink($zipFile);
            exit();
        }
    }

    public function deleteFolder($path)
    {
        if ($this->uploadType == 'direct') {
            $dir = WRITEPATH . $_ENV['data_folder'] . '/' . $path;
            $it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
            $files = new RecursiveIteratorIterator(
                $it,
                RecursiveIteratorIterator::CHILD_FIRST
            );
            foreach ($files as $file) {
                if ($file->isDir()) {
                    rmdir($file->getRealPath());
                } else {
                    unlink($file->getRealPath());
                }
            }
            rmdir($dir);
        } elseif ($this->uploadType == 'cloud_storage') {
            $storePathForDownload = $path;
            $storage = $this->googleCloudStorage->storage();
            $bucket = $storage->bucket($this->bucketName);
            $objects = $bucket->objects([
                'prefix' => 'default' . $storePathForDownload
            ]);
            foreach ($objects as $object) {
                $object->delete();
            }
        }
    }

    // ** support function
    private function _handleUploadDirect($path, $listFile, $uploadByFileContent = false, $safeFileName = '', $isFullPath = false)
    {
        $result = [];
        $arrUploadFile = [];
        $totalSize = 0;

        $storePath =  WRITEPATH . $_ENV['data_folder'] . '/' . $path;
        $storePathForDownload = $path;

        if (!is_dir($storePath)) {
            mkdir($storePath, 0777, true);
        }

        if (!$uploadByFileContent) {
            foreach ($listFile as $key => $files) {
                if (empty($files)) continue;
                if (!is_array($files)) $files = [$files];
                foreach ($files as $position => $file) {
                    $fileName = $safeFileName == '' ? safeFileName($file->getName()) : $safeFileName;
                    try {
                        validateFiles($file);
                    } catch (\Exception $e) {
                        $result['error_file'][] = [
                            'name' => $fileName,
                            'msg' => $e->getMessage()
                        ];
                        continue;
                    }

                    if (!$file->isValid()) {
                        $result['error_file'][] = [
                            'name' => $fileName,
                            'msg' => $file->getErrorString() . '(' . $file->getError() . ')'
                        ];
                        continue;
                    }

                    if (!$file->hasmoved()) {
                        $fileNameOrigin = $file->getName();
                        $file->move($storePath, $fileName);
                        $infoFileUpload = getFilesProps($storePathForDownload . $fileName);
                        $fileSize = $infoFileUpload['size'];

                        $arrUploadFile[] = [
                            'filename' => $fileName,
                            'filename_origin' => $fileNameOrigin,
                            'size' => $fileSize,
                            'url' => $storePathForDownload . $fileName,
                            'type' => $infoFileUpload['type']
                        ];
                        $totalSize += $fileSize;
                    }
                }
            }
        } else {
            foreach ($listFile as $file) {
                $filename = $safeFileName == '' ? (isset($file['filename']) ? safeFileName($file['filename']) : safeFileName($file->getName())) : $safeFileName;
                $fileNameOrigin = isset($file['filename']) ? $file['filename'] : $file->getName();
                $fileSize = isset($file['filesize']) ? $file['filesize'] : $file->getSize();
                file_put_contents($storePath . $filename, $file['content']);

                $arrFilename = explode(".", $filename);

                $arrUploadFile[] = [
                    'filename' => $filename,
                    'filename_origin' => $fileNameOrigin,
                    'size' => $fileSize,
                    'url' => $storePathForDownload . $filename,
                    'type' => end($arrFilename)
                ];
                $totalSize += $fileSize;
            }
        }

        $result['total_size'] = $totalSize;
        $result['arr_upload_file'] = $arrUploadFile;

        return $result;
    }

    private function _handleUploadCloudStorage($storePathForDownload, $listFile, $uploadByFileContent = false, $safeFileName = '')
    {
        $storage = $this->googleCloudStorage->storage();
        $bucket = $storage->bucket($this->bucketName);
        $arrUploadFile = [];
        $totalSize = 0;

        if (!$uploadByFileContent) {
            foreach ($listFile as $key => $files) {
                if (empty($files)) continue;
                if (!is_array($files)) $files = [$files];
                foreach ($files as $position => $file) {
                    $filename = $safeFileName == '' ? safeFileName($file->getName()) : $safeFileName;
                    try {
                        validateFiles($file);
                    } catch (\Exception $e) {
                        $result['error_file'][] = [
                            'name' => $filename,
                            'msg' => $e->getMessage()
                        ];
                        continue;
                    }

                    if (!$file->isValid()) {
                        $result['error_file'][] = [
                            'name' => $filename,
                            'msg' => $file->getErrorString() . '(' . $file->getError() . ')'
                        ];
                        continue;
                    }

                    $fileNameOrigin = $file->getName();
                    $fileSize = $file->getSize();
                    $fileUpload = fopen($file, 'r');
                    $uploadPath = 'default' . $storePathForDownload . $filename;
                    $object = $bucket->upload($fileUpload, [
                        'name' => $uploadPath
                    ]);

                    $arrFilename = explode(".", $filename);

                    $arrUploadFile[] = [
                        'filename' => $filename,
                        'filename_origin' => $fileNameOrigin,
                        'size' => $fileSize,
                        'url' => $storePathForDownload . $filename,
                        'type' => end($arrFilename)
                    ];
                    $totalSize += $fileSize;
                }
            }
        } else {
            foreach ($listFile as $file) {
                $filename = $safeFileName == '' ? (isset($file['filename']) ? safeFileName($file['filename']) : safeFileName($file->getName())) : $safeFileName;
                $fileNameOrigin = isset($file['filename']) ? $file['filename'] : $file->getName();
                $fileSize = isset($file['filesize']) ? $file['filesize'] : $file->getSize();
                $fileUpload = $file['content'];
                $uploadPath = 'default' . $storePathForDownload . $filename;
                $bucket->upload($fileUpload, [
                    'name' => $uploadPath
                ]);

                $arrFilename = explode(".", $filename);

                $arrUploadFile[] = [
                    'filename' => $filename,
                    'filename_origin' => $fileNameOrigin,
                    'size' => $fileSize,
                    'url' => $storePathForDownload . $filename,
                    'type' => end($arrFilename)
                ];
                $totalSize += $fileSize;
            }
        }

        $result['total_size'] = $totalSize;
        $result['arr_upload_file'] = $arrUploadFile;

        return $result;
    }

    private function _downloadNestedFolder($path, $zipFile, $arrSubFolderName = [])
    {
        $zip = new ZipArchive();
        if (!$zip->open($zipFile, ZIPARCHIVE::CREATE)) {
            return false;
        }

        try {
            $source =  WRITEPATH . $_ENV['data_folder'] . str_replace('\\', '/', $path);

            if (is_dir($source) === true) {
                $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source), RecursiveIteratorIterator::SELF_FIRST);

                // add nested directory file
                foreach ($files as $file) {
                    $file = str_replace('\\', '/', $file);
                    if (in_array(substr($file, strrpos($file, '/') + 1), array('.', '..'))) {
                        continue;
                    }

                    $arrFileDirectory = explode('/', $file);
                    if (is_numeric(end($arrFileDirectory))) {
                        continue;
                    }

                    if (is_dir($file) === true) {
                        $realPath =  $file . '/';
                        if ($dh = opendir($realPath)) {
                            while (($pathContent = readdir($dh)) !== false) {
                                if ($pathContent != '' && $pathContent != '.' && $pathContent != '..') {
                                    if (is_file($realPath . $pathContent)) {
                                        $savePath = $this->_getZipDirectory($arrFileDirectory, $arrSubFolderName);
                                        $zip->addFile($realPath . $pathContent, $savePath . '/' . $pathContent);
                                    }
                                }
                            }
                        }
                    }
                }

                // add current directory file
                $arrFileDirectory = explode('/', $source);
                if ($dh = opendir($source)) {
                    while (($pathContent = readdir($dh)) !== false) {
                        if ($pathContent != '' && $pathContent != '.' && $pathContent != '..') {
                            if (is_file($source . $pathContent)) {
                                $savePath = $this->_getZipDirectory($arrFileDirectory, $arrSubFolderName);
                                $zip->addFile($source . $pathContent, $savePath . '/' . $pathContent);
                            }
                        }
                    }
                }

                $zip->close();
                header('Cache-Control: public');
                header('Content-Description: File Transfer');
                header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK');
                header("Content-Type: application/zip");
                header("Content-Transfer-Encoding: Binary");
                header("Content-Length: " . filesize($zipFile));
                header("Content-Disposition: attachment; filename=\"" . basename($zipFile) . "\"");
                readfile($zipFile);
                unlink($zipFile);
                exit();
            }
        } catch (\Exception $e) {
            return false;
        }
    }

    private function _getZipDirectory($arrDirectory, $arrSubFolderName)
    {
        if (count($arrDirectory) === 0) {
            return "";
        }

        $arrDirectory = array_slice($arrDirectory, 3);
        $arrDirectoryForSave = [];
        foreach ($arrDirectory as $rowDirectory) {
            if ($rowDirectory != 'data' && isset($arrSubFolderName[$rowDirectory])) {
                $arrDirectoryForSave[] = $arrSubFolderName[$rowDirectory]['name'];
            }
        }

        return implode('/', $arrDirectoryForSave);
    }

    private function _downloadIndividualFolder($path, $zipFile)
    {
        $storePath = WRITEPATH . $_ENV['data_folder']  . $path;
        $zip = new ZipArchive();
        try {
            if ($zip->open($zipFile, (ZipArchive::CREATE | ZipArchive::OVERWRITE))) {
                if ($dh = opendir($storePath)) {
                    while (($file = readdir($dh)) !== false) {
                        if (($file != '' && $file != '.' && $file != '..')) {
                            if (is_file($storePath . $file)) {
                                $zip->addFile($storePath . $file, $file);
                            }
                        }
                    }
                    closedir($dh);
                }
            }
            $zip->close();
            header('Cache-Control: public');
            header('Content-Description: File Transfer');
            header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK');
            header("Content-Type: application/zip");
            header("Content-Transfer-Encoding: Binary");
            header("Content-Length: " . filesize($zipFile));
            header("Content-Disposition: attachment; filename=\"" . basename($zipFile) . "\"");
            readfile($zipFile);
            unlink($zipFile);
            exit();
        } catch (\Exception $e) {
            return false;
        }
    }
}

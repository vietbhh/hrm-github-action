<?php

namespace App\Libraries\Upload;

use App\Libraries\Upload\GoogleCloudStorage;
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
        $this->bucketName = 'friday-storage';
    }

    /**
     *  $storePath = getModuleUploadPath($module, $id, true) . 'data/';
     *  $storePathForDownload = '/' . $_ENV['data_folder_module'] . '/'.$module.'/' . $id . '/data/';
     *  $listFile: list file upload
     **/
    public function uploadFile($storePath, $listFile, $uploadByFileContent = false, $saveFilename = '')
    {
        helper('filesystem');
        if ($storePath == '') {
            return false;
        }

        if ($this->uploadType == 'direct') {
            return $this->_handleUploadDirect($storePath, $listFile, $uploadByFileContent, $saveFilename);
        } else if ($this->uploadType == 'cloud_storage') {
            return $this->_handleUploadCloudStorage($storePath, $listFile, $uploadByFileContent, $saveFilename);
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

    public function downloadFolder($path, $uploadFilename, $zipFilename)
    {
        $zipFile = $zipFilename . '.zip';
        if ($this->uploadType == 'direct') {
            $storePath = WRITEPATH . $_ENV['data_folder'] . '/' . $path;
            $zip = new ZipArchive();
            if ($zip->open($zipFile, (ZipArchive::CREATE | ZipArchive::OVERWRITE))) {
                if ($dh = opendir($storePath)) {
                    while (($file = readdir($dh)) !== false) {
                        if ($file != '' && $file != '.' && $file != '..') {
                            $zip->addFile($storePath . $file, $file);
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
            $storePath = WRITEPATH . $_ENV['data_folder'] . '/' . $path;
            if (!is_dir($storePath)) {
                return unlink($storePath);
            }

            foreach (scandir($storePath) as $item) {
                if ($item == '.' || $item == '..') {
                    continue;
                }

                if (!$this->deleteFolder($storePath . DIRECTORY_SEPARATOR . $item, '')) {
                    return false;
                }
            }

            return rmdir($storePath);
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
    private function _handleUploadDirect($path, $listFile, $uploadByFileContent = false, $saveFilename = '')
    {
        $result = [];
        $arrUploadFile = [];
        $totalSize = 0;

        $storePath = WRITEPATH . $_ENV['data_folder'] . '/' . $path;
        $storePathForDownload = $path;

        if (!is_dir($storePath)) {
            mkdir($storePath, 0777, true);
        }

        if (!$uploadByFileContent) {
            foreach ($listFile as $key => $files) {
                if (empty($files)) continue;
                if (!is_array($files)) $files = [$files];
                foreach ($files as $position => $file) {
                    $fileName = $saveFilename == '' ? safeFileName($file->getName()) : $saveFilename;
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
                $filename = $saveFilename == '' ? (isset($file['filename']) ? safeFileName($file['filename']) : safeFileName($file->getName())) : $saveFilename;
                $fileNameOrigin = isset($file['filename']) ? $file['filename'] : $file->getName();
                $fileSize = isset($file['filesize']) ? $file['filesize'] : $file->getSize();
                file_put_contents($storePath . $filename, $file['content']);

                $infoFileUpload = getFilesProps($storePathForDownload . $filename);

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

    private function _handleUploadCloudStorage($storePathForDownload, $listFile, $uploadByFileContent = false, $saveFilename = '')
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
                    $filename = $saveFilename == '' ? safeFileName($file->getName()) : $saveFilename;
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
                $filename = $saveFilename == '' ? (isset($file['filename']) ? safeFileName($file['filename']) : safeFileName($file->getName())) : $saveFilename;
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
}

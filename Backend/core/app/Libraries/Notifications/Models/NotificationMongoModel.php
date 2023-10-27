<?php

namespace App\Libraries\Notifications\Models;

use App\Config\MongoDatabaseConnector;

class NotificationMongoModel
{
    private $collection;

    public function __construct()
    {
        $connection = new MongoDatabaseConnector();
        $database = $connection->getDatabase();
        $this->collection = $database->notifications;
    }

    public function getNotificationById($id)
    {
        if (empty($id) || $id == "undefined") {
            return [];
        }

        $notification = $this->collection->findOne(['_id' => new \MongoDB\BSON\ObjectId($id)], ["typeMap" => ['root' => 'array', 'document' => 'array']]);
        return $notification;
    }

    public function addNotification($content)
    {
        $content['created_at'] = date('Y-m-d H:i:s');
        $content['updated_at'] = date('Y-m-d H:i:s');
        $this->collection->insertOne($content);
        return true;
    }

    public function listNotification($perPage = 10, $page = 0, $unseenOnly = false, $arrId = [], $conditions = [])
    {
        $user = user_id();
        $condition = $conditions;
        if (count($arrId) > 0) {
            foreach ($arrId as $key => $row) {
                $arrId[$key] = new \MongoDB\BSON\ObjectId($row);
            }

            $condition['_id'] = [
                '$in' => $arrId
            ];
        }
        $condition['recipient_id'] = $user;

        if ($unseenOnly) {
            $condition['seen_by'] = [
                '$ne' => $user
            ];
        }

        $option = ["typeMap" => ['root' => 'array', 'document' => 'array'], 'sort' => ['created_at' => -1]];
        if ($perPage != 0) {
            if ($page > 0) {
                $page = $page - 1;
                $option['skip'] = $perPage * $page;
            }

            $option['limit'] = intval($perPage);
        }

        $list = $this->collection->find($condition, $option);
        $result = [];

        foreach ($list as $row) {
            $arrPush = $row;
            $arrPush['_id'] = (string)$row['_id'];
            $result[] = $arrPush;
        }

        return $result;
    }

    public function getUnreadNotificationNumber()
    {
        $user = user_id();
        $condition = [
            'recipient_id' => $user,
            'seen_by' => [
                '$nin' => [(string)$user]
            ]
        ];

        return $this->collection->count($condition);
    }

    public function seenNotification($data)
    {
        $seenBy = !empty($data['seen_by']) ? $data['seen_by'] : [];
        if (!in_array(user_id(), $seenBy)) {
            $seenBy[] = (string)user_id();
            $this->collection->updateOne(
                ['_id' => new \MongoDB\BSON\ObjectId($data['_id'])],
                ['$set' => [
                    'seen_by' => $seenBy
                ]]
            );

            return true;
        }

        return false;
    }

    public function markAsRead($data)
    {
        $readBy = !empty($data['read_by']) ? $data['read_by'] : [];
        if (!in_array(user_id(), $readBy)) {
            $readBy[] = (string)user_id();
            $this->collection->updateOne(
                ['_id' => new \MongoDB\BSON\ObjectId($data['_id'])],
                ['$set' => [
                    'read_by' => $readBy
                ]]
            );

            return true;
        }

        return false;
    }


    public function removeNotification($id)
    {   
        $notificationInfo = $this->getNotificationById($id);
        if (count($notificationInfo) == 0) {
            return false;
        }

        $result = $this->collection->deleteOne(['_id' => new \MongoDB\BSON\ObjectId($id)]);
        if($result->getDeletedCount() == 1) {
            return true;
        }

        return false;
    }
}

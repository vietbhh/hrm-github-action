<?php

namespace HRM\Modules\Asset\Models;

use App\Models\AppModel;

class AssetModel extends AppModel
{
    protected function getNewAssetListCode($oldAssetGroupCode, $newAssetGroupCode, &$assetCode, $indexStr = 0)
    {
        $arrIndex = $this->_getIndexInString($assetCode, $oldAssetGroupCode);
        if (count($arrIndex) == 0) {
            return $assetCode;
        }
        
        $index = null;
        if (count($arrIndex) > 1) {
            $index = isset($arrIndex[$indexStr]) ? $arrIndex[$indexStr] : null;
        } else {
            $index = $arrIndex[0];
        }
        
        if ($index === null) {
            return $assetCode;
        }
        

        $length = strlen($oldAssetGroupCode);
        $newAssetCode = substr_replace($assetCode, $newAssetGroupCode, $index, $length);
        
        return $newAssetCode;
    }

    private function _getIndexInString($string, $stringSearch)
    {
        $arrIndex = [];
        for ($i = 0; $i < strlen($string); $i++) {
            if (substr($string, $i, strlen($stringSearch)) == $stringSearch) {
                $arrIndex[] = $i;
            }
        }

        return $arrIndex;
    }
}

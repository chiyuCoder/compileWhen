<?php
    function dump($var) {
        $trace = debug_backtrace();
        $line = $trace[0]['line'];
        echo 'line:'.$line.PHP_EOL;
        var_dump($var);
        echo PHP_EOL;
    }

    function padStrArr(int $len, string $str = '**') {
        $arr = [];
        while ($len --) {
            array_push($arr, $str);
        }
        return $arr;
    }
    
    function getAddonSourceCodeFiles(string $path, int $level,  string $prefix = 'public'){
        global $webRoot;
        if ($level >= 0) {
            $layerArr = padStrArr($level);
            $parent = implode($webRoot->delimiter, $layerArr);
            $path = $webRoot->join($parent, $path);
        }
        $addonPath = $webRoot->join($webRoot->root, $prefix);
        $sourceGlob = $webRoot->join($addonPath, $path);
        return glob($sourceGlob);
    }
    
    function getAllSourceCodeFiles(array $sourceTypes = [], string $prefix = 'public', int $maxLevel = 10) {
        $sourceCodeFile = [];        
        foreach ($sourceTypes as $sourceType) {
            $sourceCodeFile[$sourceType] = [];
        }
        
        $level = $maxLevel;
        while($level --) {
            foreach ($sourceTypes as $sourceType) {             
                $path = "*.".$sourceType;
                $sourceTypeFile = getAddonSourceCodeFiles($path, $level, $prefix);
                $sourceCodeFile[$sourceType] = array_merge($sourceCodeFile[$sourceType], $sourceTypeFile);
            }
        }
        return $sourceCodeFile;
    }
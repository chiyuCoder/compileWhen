<?php
namespace akaba\dev;

class Path{
    protected $os;
    protected $delimiter;
    protected $root;
    private $filterTypes = [
        '*',
        'dir',
        '*.less/',
        '*.c.less',
        '*.es6'
    ];
    const NON_FILTER = 0;
    const DIR_FILTER = 1;
    const LESS_FILTER = 2;
    const COMPILER_LESS_FILTER = 3;
    const ES_FILTER = 4;
    const SIBLING_NODE = '.';
    const PARENT_NODE = '..';
    public function __construct(string $path = '')
    {
        $this->os = strToLower(PHP_OS);       
        $this->delimiter = $this->getDelimiterByOs();
        if (empty($path)) {
            $path = CODE_ROOT;
        } else {
            $path = \preg_replace("/(\/|\\\\)+$/", '', $path);
        }
        $this->path = str_replace("\\", "/", $path);
        $this->root = $this->path;
    }
    function join($a, $b = "./") {
        if ($this->isAbsPath($b)) {
            return $b;
        }
        $arrA = explode($this->delimiter, $a);
        $arrB = explode($this->delimiter, $b);
        $arr = array_merge($arrA, $arrB);
        $arrLen = sizeOf($arr);
        $pathTravel = [];
        $path = '';
        $searchProcessArray = [];
        for($nowIndex = 0; $nowIndex < $arrLen; $nowIndex ++) {
            $nodeName = $arr[$nowIndex];
            if ($nodeName == self::PARENT_NODE) {
                $pathLevel = sizeOf($pathTravel);
                $parentNode = $pathTravel[$pathLevel - 1];
                if (!isSet($parentNode) || $parentNode == self::PARENT_NODE) {
                    array_push($pathTravel, self::PARENT_NODE);
                } else {
                    unset($pathTravel[$pathLevel - 1]);
                }
            } elseif ($nodeName == self::SIBLING_NODE) {
                continue;
            } else {
                if ($nodeName !== '') {
                    array_push($pathTravel, $nodeName);
                } elseif(!$nowIndex) {
                    array_push($pathTravel, $nodeName);
                }
            }
        }
        return implode($this->delimiter, $pathTravel);
    }
    function resolve($a, $b) {
        $a = $this->join($this->root, $a);
        return $this->join($a, $b);
    }
    function isAbsPath(string $path) {
        $firstLetterIndex = 0;
        if ($this->os == 'linux') {
            $rootPath = '\/';
        } else {
            $rootPath = "\w:\\\\";
        }
        preg_match("/^" . $rootPath."/", $path, $matches);
        if (empty($matches)) {
            return false;
        } else {
            return true;
        }
    }
    function __get($key) {
        if (isSet($this->$key)) {
            return $this->$key;
        }
        return null;
    }
    function getDelimiterByOs(string $os = '') {
        if (empty($os)) {
            $os = $this->os;
        }
        $delimiter = '/';
        if (strToLower($os) == "winnt") {
            $delimiter = "\\";
        }
        return $delimiter;
    }
    public function getChildren($filterIndex = self::NON_FILTER) {
        if (\is_numeric($filterIndex)) {
            $filter = $this->filterTypes[$filterIndex];
        } else {
            $filter = $filterIndex;
        }
        if ($filter == 'dir') {
            $globalPath = $this->join($this->root, '*');
            $children = glob($globalPath,  GLOB_ONLYDIR);
        } else {
            $globalPath = $this->join($this->root, $filter);
            $children = glob($globalPath);
        }
        return $children;
    }
}
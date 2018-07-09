<?php
$funcFloder =  __DIR__.'/func/dev.php';
include $funcFloder;
spl_autoload_register(function ($class) {
    $classMap = [
        "akaba\\dev\\Path" => "Path"
    ];
    $clsFloder = __DIR__."/class/".$classMap[$class].".php";
    include $clsFloder;
});

use akaba\dev\Path;
$dir = __DIR__;
$dir = preg_replace("/(\/|\\\\)compiler(\/|\\\\)php(\/|\\\\)?$/", '', $dir);
define("CODE_ROOT", $dir);
$webRoot = new Path();
$sourceTypes = ['less', 'es6', 'map'];

$sourceTypes = ["c.less"];
$adminSourceCodeFiles = getAllSourceCodeFiles($sourceTypes, 'application/admin/view/', 4);
$addonsSourceCodeFiles = getAllSourceCodeFiles($sourceTypes);
foreach ($sourceTypes as $type) {
    if (!isSet($sourceFiles[$type])) {
        $sourceFiles[$type] = [];
    }
    $sourceFiles[$type] = array_merge($adminSourceCodeFiles[$type], $addonsSourceCodeFiles[$type]);
}
$devServerHostnames = [
    "dz" => "iZ2ze5zmsp7p24a6n10kbhZ"
];

// if (!in_array($_SERVER["HOSTNAME"], $devServerHostnames)) {
//     $delCmds = ['del', 'delete'];
//     if (!empty($argv[1]) && in_array(strTolower($argv[1]), $delCmds)) {
//         $delSize = sizeOf($sourceFiles);
//         foreach($sourceFiles as $index => $files) {
//             // unlink($sourceFile);
//             foreach($files as $file) {
//                 // var_dump($file);
//                 unlink($file);
//             }
//         }
//         die;
//     }
// } 
file_put_contents(__DIR__."/sourceFiles.json", json_encode($sourceFiles, JSON_PRETTY_PRINT));
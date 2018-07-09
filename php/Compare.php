<?php
$styles = ["proDefault", "default"];
$dir = "/www/web/think_diandingsc_cc/public_html/application/admin/view/";
foreach ($styles as $style) {
    $htmls = glob($dir.$style."/*/*.html");
    file_put_contents(__DIR__."/".$style."-htmls.json", json_encode($htmls, JSON_PRETTY_PRINT));
}
let babel = require("babel-core");
let file = "/www/web/think_diandingsc_cc/public_html/public/styles/proDefault/addons/infoform/setting/setting/setting.es6",
    options = {

    };
let result = babel.transformFile(file, options, (err, result) => {
    console.log(result);
});
import { StCli } from "./StCli.node";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
export class StEcho extends StCli {
    public debug(str: any) {
        this.log(str);
    }
    public log(str: any, fontColor: string = "", backgroundColor: string = "") {
        var type = '%s',
            color,
            colors = this;
        if (typeof str == 'object') {
            type = '%O';
        }
        let fontColorIndex = this.getColorValue(fontColor),
            backgroundColorIndex = this.getColorValue(backgroundColor, 'backgroundColors');
        color = `\u001B[${backgroundColorIndex};${fontColorIndex}m${type}\u001B[${colors.backgroundColors.default};${colors.fontColors.default}m`;
        console.log(color, str);
    }
    public error(str, newLine = "=== error ====") {
        this.log(newLine + "=>", 'red');
        this.log(str, 'red');
        this.log(newLine + "<=", 'red');
    }
    public info(str, newLine = "=== info line ====") {
        this.log(newLine + "=>", 'blue');
        this.log(str, 'blue');
        this.log(newLine + '<=', 'blue');
    }
    public success(str, newLine = "-----------------------") {
        this.log(str, "darkgreen");
        this.log(newLine);
    }
    public write(str: any, filename: string = path.resolve(__dirname, "../log/error.json")) {
        let data: any = {};
        let time = new Date();
        let timeStr = time.getFullYear() + "-" +
            (time.getMonth() + 1) + "-"
            + time.getDate() + "  "
            + time.getHours() + ":"
            + time.getMinutes();
        data.time = timeStr;
        data.errorData = str;
        let jsonData = JSON.stringify(data, (key, value) => {
            return value;
        }, 4);
        fs.appendFile(filename, os.EOL + jsonData + os.EOL, (err) => {
            if (err) {
                throw err;
            }
        });
    }
}
export let stEcho = new StEcho();


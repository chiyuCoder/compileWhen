class StCli {
    constructor() {
        this.fontColors = {
            "black": 30,
            "red": 31,
            "green": 32,
            yellow: 33,
            blue: 34,
            purple: 35,
            darkgreen: 36,
			white: 37,
			default: 39,
        };
        this.backgroundColors = {
            black: 40,
            red: 41,
            green: 42,
            yellow: 43,
            blue: 44,
            purple: 45,
            darkgreen: 46,
			white: 47,
			default: 49
        };
        this.quotes = {
            closeAllProperties: 0, //关闭所有属性
            hightLight: 1, //设置高亮度
            underline: 4, //下划线
            twink: 5, //闪烁  
            invert:7, //反显
			fade: 8, //消隐,
			//\x1b[30m   --  \x1b[37m   设置前景色  ,
			//\x1b[40m   --  \x1b[47m   设置背景色
			/*
			*\x1b[nA    光标上移n行  
			*\x1b[nB    光标下移n行  
			*\x1b[nC    光标右移n行  
			*\x1b[nD    光标左移n行  
			*\x1b[y;xH  设置光标位置  
			*\x1b[2J    清屏  
			*\x1b[K     清除从光标到行尾的内容  
			*\x1b[s     保存光标位置  
			*\x1b[u     恢复光标位置  
			*\x1b[?25l  隐藏光标  
			*\x1b[?25h  显示光标
			*/ 
        };
    }
}


class StEcho extends StCli {
    constructor() {
        super();
    }
    debug(str) {
        this.log(str);
        debugger;
	}
	getColorValue(colorStr, type = 'fontColors') {
		var colors = this;
		if (!colorStr) {
			colorStr = colors[type].default;
		} else {
			if (colorStr in colors.fontColors) {
				colorStr = colors[type][colorStr];
			} else {
				throw new Error(`${fontColor}不存在`);
			}
		}
		return colorStr;
	}
    log(str, fontColor, backgroundColor) {
		var type = '%s',
			color,
			colors = this;
		if (typeof str == 'object') {
			type = '%O';
		}
		fontColor = this.getColorValue(fontColor);
		backgroundColor = this.getColorValue(backgroundColor, 'backgroundColors');
		color = `\x1b[${backgroundColor};${fontColor}m${type}\x1b[${this.backgroundColors.default};${this.fontColors.default}m`;
		console.log(color, str);
	}
	error(str, newLine = "=======>") {
		this.log(str, 'red', "black");
		this.log(newLine);
	}
	info(str, newLine = "=======>"){
		this.log(str, 'yellow', 'black');
		this.log(newLine);
	} 
}


let stEcho = new StEcho();

module.exports = {
	StEcho: StEcho,
	stEcho: stEcho
}
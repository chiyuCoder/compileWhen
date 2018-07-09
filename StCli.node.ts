export class StCli{
    readonly fontColors = {
        "black": 30,
        "red": 31,
        "green": 32,
        yellow: 33,
        blue: 34,
        purple: 35,
        darkgreen: 36,
        white: 37,
        default: 39,
        grey: 90,
    }
    readonly backgroundColors = {
        black: 40,
        red: 41,
        green: 42,
        yellow: 43,
        blue: 44,
        purple: 45,
        darkgreen: 46,
        white: 47,
        default: 49
    }
    readonly quotes = {
        closeAllProperties: 0, //关闭所有属性
        hightLight: 1, //设置高亮度
        italic: 3,//斜体
        underline: 4, //下划线
        twink: 5, //闪烁  
        invert:7, //反显
        fade: 8, //消隐,
        strikethrough: 9,//
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
    }
    public getColorValue(colorStr: string = "", type: string = 'fontColors'): number {
        var colors = this;
		if (!colorStr) {
            return colors[type].default;
        } 
        if (colorStr in colors.fontColors) {
            let colorIndex: number = colors[type][colorStr];
            return colorIndex;
        } 
        throw new Error(`${type}[${colorStr}]不存在`);      
	}
}
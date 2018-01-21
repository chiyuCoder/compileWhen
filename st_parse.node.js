let { stdin, exit } = require('process'), 
    { StParse } = require('./st_parser.node'),
    { stEcho } = require('./st_devtool.node');


stdin.setEncoding('utf-8');

stdin.on('readable', () => {
    let chunk = stdin.read();
    if (chunk != null) {
        chunk = chunk.replace(/\r?\n$/, '');
        stEcho.info(chunk);
        let parser = new StParse(chunk);
    }
});
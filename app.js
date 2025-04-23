'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map(); //key: 都道府県, value: 集計データのオブジェクト
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefcture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefcture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0 
            };
        }
        if (year === 2010) {
            value.popu10 += popu;
        } else if (year === 2015) {
            value.popu15 += popu;
        }
        map.set(prefcture, value);
    }
});
rl.resume();
rl.on('close', () => {
    for(let pair of map) {
        const value = pair[1];
        value.chenge = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].chenge - pair1[1].chenge;
    });
    const rankingStrings = rankingArray.map((pair) => {
        return pair[0] + ' : ' + pair[1].popu10 + ' => ' + pair[1].popu15 + ' 変化率: ' + pair[1].chenge;
    });
    console.log(rankingStrings);
});
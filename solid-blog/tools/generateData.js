var fastLoremIpsum = require('fast-lorem-ipsum');
const fs = require('fs');

const {v4} = require('uuid');

// const genZSlang = [
//     "sus",
//     "lit",
//     "no cap",
//     "slay",
//     "based",
//     "vibes",
//     "lowkey",
//     "highkey",
//     "ghosting",
//     "flex",
//     "salty",
//     "tea",
//     "spill the tea",
//     "toxic",
//     "fomo",
//     "yeet",
//     "solid",
//     "boomer",
//     "hits different",
//     "slaps",
//     "sheesh",
//     "bussin",
//     "cheugy",
//     "rent free",
//     "mid",
//     "snatched",
//     "mood",
//     "rizz",
//     "skibidi",
//     "it's giving"
// ];
 
const r = [];
for (let i = 0; i < 30; i++) {
    const l = ((Math.random() * 300) >>> 0) + 200;
    const t = fastLoremIpsum(`${(l / 100) >>> 0}w`);
    const c = fastLoremIpsum(`${l}w`);
    r.push({
        id: v4(),
        title: t,
        content: c
    });
}

fs.writeFileSync('./blogData.json', JSON.stringify(r), 'utf-8');
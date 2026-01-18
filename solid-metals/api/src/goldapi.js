const fs = require('fs');

const DATA_FILE = './data/data.json';
const ONE_DAY_MILLIS = (60 * 60 * 24 * 1000);

let globalData = [
    {
        ts: 1767564184709,
        au: 1,
        ag: 1,
        pt: 1,
        status: 0
    }
]

const callGoldAPI = (metal) => {
    return new Promise((resolve, reject) => {
        var myHeaders = new Headers();
        myHeaders.append("x-access-token", process.env.AU_API_TOKEN);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        console.log(`calling https://www.goldapi.io/api/${metal}/USD`);
        fetch(`https://www.goldapi.io/api/${metal}/USD`, requestOptions)
            .then(response => {
                console.log(`${metal} response status = ${response.status}`);
                if(response.status != 200) {
                    throw new Error(`${metal} response status = ${response.status}`);
                }
                return response.json()
            })
            .then(result => {
                return resolve(result.price)
            })
            .catch(error => {
                console.error(error);
                return reject('error', error)
            });
    });
}

const updateQuotes = async () => {
    const metalCodes = [
        'XAU',
        'XAG',
        'XPT'
    ];
    const tasks = metalCodes.map(m => callGoldAPI(m));
    try {
        const results = await Promise.all(tasks);
        console.log(`results = ${results.map(m => `${m}, `)}`);
        globalData.unshift({
            ts: Date.now(),
            au: results[0],
            ag: results[1],
            pt: results[2],
            status: 0
        });
        fs.writeFileSync(DATA_FILE, JSON.stringify(globalData), 'utf-8');
    } catch (error) {
        console.error(error.message);
    }
}

const getLatestFromFile = () => {
    console.log('open data file');
    try {
        // console.log(`cwd = ${process.cwd()}`);
        const dataString = fs.readFileSync(DATA_FILE, 'utf-8');
        // console.log(`dataString len = ${dataString.length}`);
        globalData = JSON.parse(dataString).sort((a, b) => b.ts - a.ts);
        // console.log(`data len = ${globalData.length}`);
        // console.log(`typeof data = ${typeof globalData}`);
        console.log(globalData[0]);
    } catch (error) {
        console.error(error.message);
    }
}

const getQuotes = async () => {
    getLatestFromFile();
    let o = globalData[0];
    const currentTime = Date.now();
    if ((o.ts + ONE_DAY_MILLIS) > currentTime) {
        console.log('Time not elapsed, reusing old values');
    } else {
        console.log('Data old, fetch new');
        await updateQuotes();
        o = globalData[0];
    }
    return o;
}

module.exports = getQuotes;
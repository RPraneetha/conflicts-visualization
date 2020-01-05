//Util file for country count. To be run as a stand-alone file. IGNORE
const fs = require('fs');
const conflictData = require('../../data/locations-2015');
function runCount() {
    let countryCount = {};
    countryCount = conflictData.locations.reduce(function(a, b) {
        if(a && b){
            if(b.protestLocation) {
                a[b.protestLocation.country] = (a[b.protestLocation.country] || 0) + 1;
            }}

        return a;
    }, {});
    fs.writeFile("../../data/countryCount2015.json", JSON.stringify(countryCount), function(){});
}

runCount();
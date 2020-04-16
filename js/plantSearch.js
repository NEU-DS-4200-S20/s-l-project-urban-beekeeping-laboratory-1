//This function sets up a dictionary of Hives and plants found in honey samples
//This allows us to search for particular plants found near each Hive
var hiveDictionary = []

d3.csv("data/ids_cities_health.csv", function(data) {
    var i;
    for(i = 0; i < data.length; i++) {
        var hiveID = data[i]["Hive ID"]
        var filepath = "data/hive\ plant\ species\ data/" + hiveID + ".csv"
        extract(filepath, hiveID)
    }
});

async function extract(filepath, hiveID) {
    await d3.csv(filepath, (hive) => {
        var hiveObject = {}
        var plantList = []
        var j;
        for(j = 0; j < hive.length; j++) {
            if(hive[j]["Common Name"] != null) {
                plantList.push(hive[j]["Common Name"])
            }
        }
        hiveObject["Hive"] = hiveID
        hiveObject["Plants"] = plantList
        hiveDictionary.push(hiveObject)
    });
}


//Given a plant name, finds all hives with those plants using the dictionary
function hivesWithPlant(plant) {
    console.log(plant)
    var i
    var hiveList = []
    for(i = 0; i < hiveDictionary.length; i++) {
        var plantList = hiveDictionary[i]["Plants"]
        if(plantList.includes(plant)) {
            hiveList.push(hiveDictionary[i]["Hive"])
        }
    }
    return hiveList;
}

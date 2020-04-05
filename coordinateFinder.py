from  geopy.geocoders import Nominatim
import pandas as pd
import csv


def coordFinder(cityName, stateName):
    geolocator = Nominatim()
    city = cityName
    state = stateName

    try:
        loc = geolocator.geocode(city+','+ state)
        return (loc.latitude, loc.longitude)
    except:
        print("Not a valid city:", city)

def allCoords(df):

    latitudeList = []
    longitudeList = []

    for i in range(df["City"].count()):

        # print(i)
        city = df["City"][i]
        # print(city)
        state = df["State"][i]
        # print(state)

        latLonTup = coordFinder(city, state)

        try:
            latitude = latLonTup[0]
            latitudeList.append(latitude)
            longitude = latLonTup[1]
            longitudeList.append(longitude)

            # print(latitude)
            # print(longitude)

        except:
            # print("Not a valid city:", city)
            longitudeList.append("N/A")
            latitudeList.append("N/A")

    # for latitude in latitudeList:
        # print(latitude)

    # for longitude in longitudeList:
        # print(longitude)

    df["Latitude"] = latitudeList
    df["Longitude"] = longitudeList

    print(len(latitudeList))
    print(len(longitudeList))
        
df = pd.read_csv('data/ids_cities_states.csv')
# print(df["City"])
allCoords(df)
# print(df)
df.to_csv('data/ids_cities_with_coords.csv', index=False)

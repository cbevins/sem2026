export class DataProvider {
    constructor() {}

    getAspect(easting, northing, date) { return 0 }

    getFeature(easting, northing, date) { return 0 }

    getFuelCuring(easting, northing, date) { return 0 }

    getFuelModel(easting, northing, date) { return 1 }

    getFuelMoistures(easting, northing, date) { return 0.1 }

    getSlopeRatio(easting, northing, date) { return 0 }

    getMaxSpreadDirection(easting, northing, date) { return 0 }

    getMidflameWindSpeed(easting, northing, date) { return 0 }

    getSpreadRate(easting, northing, date, bearing) { return 100 }

    getWindSpeed(easting, northing, date) { return 0 }

    getWindBearing(easting, northing, date) { return 0 }
}
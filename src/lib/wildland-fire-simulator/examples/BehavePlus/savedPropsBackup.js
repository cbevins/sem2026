export const BehavePlusProps = {
    // WfsFirePosition
    elapsedTime: {
        owner: 'firePosition',
        key: 'elapsedTime',
        label: 'Elapsed time',
        input: false,
        output: false,
        values: [60],
    },
    ignEast: {
        owner: 'firePosition',
        key: 'ignEast',
        label: 'Ignition Easting',
        values:[0],
    },
    ignNorth: {
        owner: 'firePosition',
        key: 'ignNorth',
        label: 'Ignition Northing',
        values: [0],
    },

    // WfsFireTerrain
    aspect: {
        owner: 'fireTerrain',
        key: 'aspect',
        label: 'Aspect',
        values: [180],
    },
    elevation: {
        owner: 'fireTerrain',
        key: 'elevation',
        label: 'Elevation',
        values: [0],
    },
    ridgeValleyDistance: {
        owner: 'fireTerrain',
        key: 'ridgeValleyDistance',
        label: 'Ridge-to-valley Distance',
        values: [0],
    },
    ridgeValleyElevation: {
        owner: 'fireTerrain',
        key: 'ridgeValleyElevation',
        label: 'Ridge-to-valley Elevation',
        values:[0]
    },
    slopeDegrees: {
        owner: 'fireTerrain',
        key: 'slopeDegrees',
        label: 'Slope Degrees',
        values: [0],
    },
    slopeRatio: {
        owner: 'fireTerrain',
        key: 'slopeRatio',
        label: 'Slope Rise/Reach',
        values: [0.25],
    },
    topography: {
        owner: 'fireTerrain',
        key: 'topography',
        label: 'Location Topography',
        values: ['ridgetop'],
    },
    upslope: {
        owner: 'fireTerrain',
        key: 'upslope',
        label: 'Upslope Direction from North',
        values: [0],
    },

    // WfsFireWeather
    airTemp: {label: 'Air Temperature', values: [95]},            // only used by scorch height
    midflameReduction: {label: 'Midflame Wind Speed reduction Factor', values: [1]},   // output
    midflameWindSpeed: {label: 'Midflame ind Speed', values: [880]}, // required by makeFireBehavior()
    windBearing: {label: 'Wind Bearing from North', values: [90]},        // required by makeFireBehavior()
    windFromUpslope: [90],    // 
    windSource: [180],        // used/created by makeFireWeather
    windSpeed10m: [900],      // used/created by makeFireWeather
    windSpeed20ft: [880],     // used/created by makeFireWeather

    // WfsFuelCanopy
    canopyBaseHeight: [0],
    canopyBulkDensity: [0],
    canopyCover: [0],
    canopyHeight: [0],
    canopyLength: [0],
    canopyRatio: [0],
    canopyWindReductionFactor: [0],

    // WfsObservedFireBehavior
    headingSpreadRate: [0],
    bearing: [0],
    lengthWidthRatio: [1],
    flameLength: [0],

    // fire vectors
    betaFromHead: 45,
    psiFromHead: 45,

    // SlopeMap
    mapScale: [24000],            // map sacle factor (Greater than 1, i.e., 24000)
    mapContourInterval: [20],     // map contour interval (ft)
    mapContours: [0],             // number of contours crossed in mapDistance
    mapDistance: [0],             // map distance covered in the measurement
}

        // module objects
        this.fuelModel = null
        this.fuelBed = null
        this.fuelIgnition = null
        this.fireBehavior = null

        // make<Something>() input objects
        this.firePosition = {...WfsFirePosition}
        this.fireTerrain = {...WfsFireTerrain}
        this.fireWeather = {...WfsFireWeather}
        this.fuelCanopy = {...WfsFuelCanopy}
        this.fuelCuring = {...WfsFuelCuring}
        this.fuelKeys = {...WfsFuelKeys}
        this.fuelMoisture = {...WfsFuelMoisture}
        this.observedFireBehavior = {...WfsObservedFireBehavior}
        this.slopeMap = {...WfsSlopeMap}
        this.betaFromHead = WfsBetaFromHead
        this.psiFromHead = WfsPsiFromHead
        // Make an initial run with default configs just to create the initial module instances
        this.run()

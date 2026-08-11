// ----------------------------------------------------------------------------
// Standard Fire Behavior Fuel Models
// as defined by Albini, Anderson, Scott & Burgan (among others),
// and used in BehavePlus, LANDFIRE, FARSITE, FlamMap.
// This file was auto-generated on 6/11/2026
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Part 1: FuelModelParticle Class Definition
// ----------------------------------------------------------------------------

// Every fuel model has one or more types of FuelModelParticle.  Below is the
// prototype (template) object used to create each FuelModelParticle, and a
// description of their properties.

const FuelModelParticle = {
    // The "life" property is one of the following strings: "dead", "live", or "curable".
    life: "dead",

    // The "ovendryLoad" is in (lb/ft2) [where lb/ft2 = 0.004591368227731864 * ton/ac]
    ovendryLoad: 0,

    // The "savr" is the surface area-to-volume ratio (ft2/ft3)
    savr: 1,

    // The "heat" is the low heat content, aka the "heat of combustion" (BTU/lb)
    heat: 8000,

    // The "density" is the fuel particle fiber density (lb/ft3)
    density: 32,

    // The "totalMineral" is the fuel particle total mineral content (lb minerals / lb ovendry fuel)
    totalMineral: 0.0555,

    // The "effectiveMineral" is fuel particle "effective" (non-silica) mineral content (lb silica-free minerals / lb ovendry wood)
    effectiveMineral: 0.01,

    // The "deadMoistureClass" is the key of the moisture content property applied when this particle is dead.
    // The standard fuel models use "moistureDead1h", "moistureDead10h", and "moistureDead100h" dead
    // fuel moisture class keys, but custom fuel models may assign new keys such as "moistureDeadDuff",
    // in which case the user would include a "moistureDeadDuff" property in the inputs object passed to
    // new Fire(inputs) or new FuelIgnition(inputs).
    deadMoistureClass: "moistureDead1h",

    // The "liveMoistureClass" is the key of the moisture content property applied when this particle is live.
    // The standard fuel models use "moistureLiveHerb" and "moistureLiveStem" live fuel moisture class keys,
    // but custom fuel models may assign new keys such as "moistureLiveCheatgrass", in which case
    // the user would include a "moistureLiveCheatgrass" property in the inputs object passed to
    // new Fire(inputs) or new FuelIgnition(inputs).
    liveMoistureClass: "moistureLiveStem",

    // The "curingClass" property is the key of the cured fraction property used to identify
    // the cured fraction of "curable" particles.
    // The standard fire behavior fuel models only use the "curedHerb" key, but custom fuel
    // models may assign new keys as needed, such as "curedCheatgrass", in which case the
    // user would include a "curedCheatgrass" property in the iputs object passed to
    // new Fire(inputs) or new FuelBed(inputs).  If the inputs object does not have the key
    // named below, then the cured fraction is set to 0.
    curingClass: "dead1h",
}

// The heat-of-combustion, density, and two mineral content properties do not vary
// significantly across vegetative fuels and are generally treated as constants.

// The fire spread model recognizes two "categories" of fuel; "dead" and "live".
// The standard fire behavior fuel models recognize 3 "classes" of dead fuels,
// and two classes of live fuels, as described below.

// ----------------------------------------------------------------------------
// Part 1.1 Dead Category FuelParticles
// ----------------------------------------------------------------------------

// Dead category fuels are classified based upon their fuel moisture "time-lag" classes
// (1-, 10, or 100-h) indicating their response time to changes in ambient temperature
// humidity, solar radiation, and precipitation.  The time-lag, in turn, depends
// primarily upon dead particle size as expressed by its surface-area-to-volume ratio.

// Dead 1-h fuel moisture time-lag class particles have a surface area-to-volume ratio
// less than 192 ft2/ft3 (equivalent to a 0.25-in diameter cylinder). The standard fuel model
// surface-area-to-volume ratios for dead 1-h fuels range from 750 to 3500 ft2/ft3
// (0.064 to 0.0137 inch diameter).
// The following template object is used to create standard dead 1-h time-lag fuel particles:
export const Dead1 = {...FuelModelParticle,
    life: "dead",
    deadMoistureClass: "moistureDead1h",
    liveMoistureClass: "moistureDead1h",
    curingClass: ""}

// Dead 10-h fuel moisture time-lag class particles have a surface area-to-volume ratio
// between 48 and 192 ft2/ft3 (1 to 0.25 inch diameter).  The standard fire behavior fuel models
// use a fixed surface-area-to-volume ratio of 109 1/ft (0.44-in diameter) for dead 10-h fuels.
// The following template object is used to create standard dead 10-h time-lag fuel particles:
export const Dead10 = {...FuelModelParticle,
    life: "dead",
    savr: 109,
    deadMoistureClass: "moistureDead10h",
    liveMoistureClass: "moistureDead10h",
    curingClass: ""}

// Dead 100-h fuel moisture time-lag class particles have a surface area-to-volume ratio
// between 192 and 16 ft2/ft3 (1 to 3 inch diameter).  The standard fire behavior fuel models
// use a fixed surface-area-to-volume ratio of 30 (1.6-in diameter) for dead 100-h fuels.
// The following template object is used to create standard dead 100-h time-lag fuel particles:
export const Dead100 = {...FuelModelParticle,
    life: "dead",
    savr: 30,
    deadMoistureClass: "moistureDead100h",
    liveMoistureClass: "moistureDead100h",
    curingClass: ""}

// ----------------------------------------------------------------------------
// Part 1.2 Live Category FuelParticles
// ----------------------------------------------------------------------------

// Live category fuels are able to regulate their moisture content independently
// (more or less) of synoptic ambient weather conditions.

// "Stem" fuels refer to the living, above-ground woody branches, twigs, and
// stems of shrubs and trees. While their moisture contents may range seasonally
// from 50% to 300%, they generally do not cure or die out during the season.
// Standard fire behavior fuel model surface area-to-volume ratios for stems range from
// 750 to 2000 ft2/ft3 (0.064 to 0.024 inch diameter).
// The following template object is used to create standard live stem particles:
export const Stem = {...FuelModelParticle,
    life: "live",
    deadMoistureClass: "moistureDead1h",
    liveMoistureClass: "moistureLiveStem",
    curingClass: ""}

// "Herb" fuels include grasses, forbs, and ferns that may cure during the season.
// The BehavePlus wildland fire modeling system considers herbs to be fully live
// when their moisture content exceeds 120%, and fully cured (dead) when below 30%.
// Standard fire behavior fuel model surface area-to-volume ratios for herbs range from
// range from 1300 to 2000 ft2/ft3 (0.369 to 0.024 inches).
// The following template object is used to create standard live or curable herb particles:
export const Herb = {...FuelModelParticle,
    life: "curable",
    deadMoistureClass: "moistureDead1h",
    liveMoistureClass: "moistureLiveHerb",
    curingClass: "curedHerb"}

// ----------------------------------------------------------------------------
// Part 2 FuelModel Class Definition
// ----------------------------------------------------------------------------

// Standard fuel models are differentiated by their fuel bed depth (ft), dead fuel
// moisture content of extinction, and number and types of FuelParticles.

// eslint-disable-next-line no-unused-vars
const FuelModel = {
    number: 0,      // a standard, assigned fuel model number, used as a lookup key
    code: "",       // a standard, assigned fuel model code, also used as a lookup key
    label: "",      // a brief label
    group: "",      // one of "FBFM13", "FBFM40", "LANDFIRE", or "CUSTOM"
    desc: "",       // a more detailed description of fuel vegetation, distribution, etc
    depth: 0.4,     // fuel bed depth (ft)
    deadMext: 0.15, // dead fuel "moisture content of extinction" (lb water / lb ovendry fuel)
    particles: [],  // array of FuelParticle objects
}

// ----------------------------------------------------------------------------
// 3 The Standard FuelModels
// ----------------------------------------------------------------------------

export const StandardFuelModels = [
    { number: 0,
        code: "none",
        group: "FBFM13",
        label: "No Fuel",
        desc: "undefined",
        depth: 0,
        deadMext: 0,
        particles: [
        ],
    },
    { number: 1,
        code: "1",
        group: "FBFM13",
        label: "Short grass",
        desc: "Surface fires that burn fine herbaceous fuels, cured and curing fuels, little shrub or timber present, primarily grasslands and savanna",
        depth: 1,
        deadMext: 0.12,
        particles: [
            {...Dead1, ovendryLoad: 0.034, savr: 3500, heat: 8000},
        ],
    },
    { number: 2,
        code: "2",
        group: "FBFM13",
        label: "Timber grass and understory",
        desc: "Burns fine, herbaceous fuels, stand is curing or dead, may produce fire brands on oak or pine stands",
        depth: 1,
        deadMext: 0.15,
        particles: [
            {...Dead1, ovendryLoad: 0.092, savr: 3000, heat: 8000},
            {...Dead10, ovendryLoad: 0.046, heat: 8000},
            {...Dead100, ovendryLoad: 0.023, heat: 8000},
            {...Herb, ovendryLoad: 0.023, savr: 1500, heat: 8000},
        ],
    },
    { number: 3,
        code: "3",
        group: "FBFM13",
        label: "Tall grass",
        desc: "Most intense fire of grass group, spreads quickly with wind, one third of stand dead or cured, stands average 3 ft tall",
        depth: 2.5,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.138, savr: 1500, heat: 8000},
        ],
    },
    { number: 4,
        code: "4",
        group: "FBFM13",
        label: "Chaparral",
        desc: "Fast spreading fire, continuous overstory, flammable foliage and dead woody material, deep litter layer can inhibit suppression",
        depth: 6,
        deadMext: 0.2,
        particles: [
            {...Dead1, ovendryLoad: 0.23, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.184, heat: 8000},
            {...Dead100, ovendryLoad: 0.092, heat: 8000},
            {...Stem, ovendryLoad: 0.23, savr: 1500, heat: 8000}
        ],
    },
    { number: 5,
        code: "5",
        group: "FBFM13",
        label: "Brush",
        desc: "Low intensity fires, young, green shrubs with little dead material, fuels consist of litter from understory",
        depth: 2,
        deadMext: 0.2,
        particles: [
            {...Dead1, ovendryLoad: 0.046, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.023, heat: 8000},
            {...Stem, ovendryLoad: 0.092, savr: 1500, heat: 8000}
        ],
    },
    { number: 6,
        code: "6",
        group: "FBFM13",
        label: "Dormant brush, hardwood slash",
        desc: "Broad range of shrubs, fire requires moderate winds to maintain flame at shrub height, or will drop to the ground with low winds",
        depth: 2.5,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.069, savr: 1750, heat: 8000},
            {...Dead10, ovendryLoad: 0.115, heat: 8000},
            {...Dead100, ovendryLoad: 0.092, heat: 8000},
        ],
    },
    { number: 7,
        code: "7",
        group: "FBFM13",
        label: "Southern rough",
        desc: "Foliage highly flammable, allowing fire to reach shrub strata levels, shrubs generally 2 to 6 feet high",
        depth: 2.5,
        deadMext: 0.4,
        particles: [
            {...Dead1, ovendryLoad: 0.052, savr: 1750, heat: 8000},
            {...Dead10, ovendryLoad: 0.086, heat: 8000},
            {...Dead100, ovendryLoad: 0.069, heat: 8000},
            {...Stem, ovendryLoad: 0.017, savr: 1500, heat: 8000}
        ],
    },
    { number: 8,
        code: "8",
        group: "FBFM13",
        label: "Short needle litter",
        desc: "Slow, ground burning fires, closed canopy stands with short needle conifers or hardwoods, litter consist mainly of needles and leaves, with little undergrowth, occasional flares with concentrated fuels",
        depth: 0.2,
        deadMext: 0.3,
        particles: [
            {...Dead1, ovendryLoad: 0.069, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.046, heat: 8000},
            {...Dead100, ovendryLoad: 0.115, heat: 8000},
        ],
    },
    { number: 9,
        code: "9",
        group: "FBFM13",
        label: "Long needle or hardwood litter",
        desc: "Longer flames, quicker surface fires, closed canopy stands of long-needles or hardwoods, rolling leaves in fall can cause spotting, dead-down material can cause occasional crowning",
        depth: 0.2,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.134, savr: 2500, heat: 8000},
            {...Dead10, ovendryLoad: 0.019, heat: 8000},
            {...Dead100, ovendryLoad: 0.007, heat: 8000},
        ],
    },
    { number: 10,
        code: "10",
        group: "FBFM13",
        label: "Timber litter & understory",
        desc: "Surface and ground fire more intense, dead-down fuels more abundant, frequent crowning and spotting causing fire control to be more difficult",
        depth: 1,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.138, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.092, heat: 8000},
            {...Dead100, ovendryLoad: 0.23, heat: 8000},
            {...Stem, ovendryLoad: 0.092, savr: 1500, heat: 8000}
        ],
    },
    { number: 11,
        code: "11",
        group: "FBFM13",
        label: "Light logging slash",
        desc: "Fairly active fire, fuels consist of slash and herbaceous materials, slash originates from light partial cuts or thinning projects, fire is limited by spacing of fuel load and shade from overstory",
        depth: 1,
        deadMext: 0.15,
        particles: [
            {...Dead1, ovendryLoad: 0.069, savr: 1500, heat: 8000},
            {...Dead10, ovendryLoad: 0.207, heat: 8000},
            {...Dead100, ovendryLoad: 0.253, heat: 8000},
        ],
    },
    { number: 12,
        code: "12",
        group: "FBFM13",
        label: "Medium logging slash",
        desc: "Rapid spreading and high intensity fires, dominated by slash resulting from heavy thinning projects and clearcuts, slash is mostly 3 inches or less",
        depth: 2.3,
        deadMext: 0.2,
        particles: [
            {...Dead1, ovendryLoad: 0.184, savr: 1500, heat: 8000},
            {...Dead10, ovendryLoad: 0.644, heat: 8000},
            {...Dead100, ovendryLoad: 0.759, heat: 8000},
        ],
    },
    { number: 13,
        code: "13",
        group: "FBFM13",
        label: "Heavy logging slash",
        desc: "Fire spreads quickly through smaller material and intensity builds slowly as large material ignites, continuous layer of slash larger than 3 inches in diameter predominates, resulting from clearcuts and heavy partial cuts, active flames sustained for long periods of time, fire is susceptible to spotting and weather conditions",
        depth: 3,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.322, savr: 1500, heat: 8000},
            {...Dead10, ovendryLoad: 1.058, heat: 8000},
            {...Dead100, ovendryLoad: 1.288, heat: 8000},
        ],
    },
    { number: 91,
        code: "nb1",
        group: "LANDFIRE",
        label: "Urban / Developed",
        desc: "Urban/Developed",
        depth: 0,
        deadMext: 0,
        particles: [
        ],
    },
    { number: 92,
        code: "nb2",
        group: "LANDFIRE",
        label: "Snow / Ice",
        desc: "Snow/Ice",
        depth: 0,
        deadMext: 0,
        particles: [
        ],
    },
    { number: 93,
        code: "nb3",
        group: "LANDFIRE",
        label: "Agriculture",
        desc: "Agricultural",
        depth: 0,
        deadMext: 0,
        particles: [
        ],
    },
    { number: 98,
        code: "nb8",
        group: "LANDFIRE",
        label: "Open Water",
        desc: "Open Water",
        depth: 0,
        deadMext: 0,
        particles: [
        ],
    },
    { number: 99,
        code: "nb9",
        group: "LANDFIRE",
        label: "Barren",
        desc: "Barren",
        depth: 0,
        deadMext: 0,
        particles: [
        ],
    },
    { number: 101,
        code: "gr1",
        group: "FBFM40",
        label: "Short, sparse, dry climate grass",
        desc: "Short, sparse dry climate grass is short, naturally or heavy grazing, predicted rate of fire spread and flame length low ",
        depth: 0.4,
        deadMext: 0.15,
        particles: [
            {...Dead1, ovendryLoad: 0.004591368227731864, savr: 2200, heat: 8000},
            {...Herb, ovendryLoad: 0.013774104683195591, savr: 2000, heat: 8000},
        ],
    },
    { number: 102,
        code: "gr2",
        group: "FBFM40",
        label: "Low load, dry climate grass",
        desc: "Low load, dry climate grass primarily grass with some small amounts of fine, dead fuel, any shrubs do not affect fire behavior",
        depth: 1,
        deadMext: 0.15,
        particles: [
            {...Dead1, ovendryLoad: 0.004591368227731864, savr: 2000, heat: 8000},
            {...Herb, ovendryLoad: 0.04591368227731864, savr: 1800, heat: 8000},
        ],
    },
    { number: 103,
        code: "gr3",
        group: "FBFM40",
        label: "Low load, very coarse, humid climate grass",
        desc: "Low load, very coarse, humid climate grass continuous, coarse humid climate grass, any shrubs do not affect fire behavior",
        depth: 2,
        deadMext: 0.3,
        particles: [
            {...Dead1, ovendryLoad: 0.004591368227731864, savr: 1500, heat: 8000},
            {...Dead10, ovendryLoad: 0.018365472910927456, heat: 8000},
            {...Herb, ovendryLoad: 0.06887052341597796, savr: 1300, heat: 8000},
        ],
    },
    { number: 104,
        code: "gr4",
        group: "FBFM40",
        label: "Moderate load, dry climate grass",
        desc: "Moderate load, dry climate grass, continuous, dry climate grass, fuelbed depth about 2 feet",
        depth: 2,
        deadMext: 0.15,
        particles: [
            {...Dead1, ovendryLoad: 0.01147842056932966, savr: 2000, heat: 8000},
            {...Herb, ovendryLoad: 0.0872359963269054, savr: 1800, heat: 8000},
        ],
    },
    { number: 105,
        code: "gr5",
        group: "FBFM40",
        label: "Low load, humid climate grass",
        desc: "Low load, humid climate grass, fuelbed depth is about 1-2 feet",
        depth: 1.5,
        deadMext: 0.4,
        particles: [
            {...Dead1, ovendryLoad: 0.018365472910927456, savr: 1800, heat: 8000},
            {...Herb, ovendryLoad: 0.11478420569329659, savr: 1600, heat: 8000},
        ],
    },
    { number: 106,
        code: "gr6",
        group: "FBFM40",
        label: "Moderate load, humid climate grass",
        desc: "Moderate load, continuous humid climate grass, not so coarse as GR5",
        depth: 1.5,
        deadMext: 0.4,
        particles: [
            {...Dead1, ovendryLoad: 0.004591368227731864, savr: 2200, heat: 9000},
            {...Herb, ovendryLoad: 0.15610651974288337, savr: 2000, heat: 9000},
        ],
    },
    { number: 107,
        code: "gr7",
        group: "FBFM40",
        label: "High load, dry climate grass",
        desc: "High load, continuous dry climate grass, grass is about 3 feet high",
        depth: 3,
        deadMext: 0.15,
        particles: [
            {...Dead1, ovendryLoad: 0.04591368227731864, savr: 2000, heat: 8000},
            {...Herb, ovendryLoad: 0.24793388429752067, savr: 1800, heat: 8000},
        ],
    },
    { number: 108,
        code: "gr8",
        group: "FBFM40",
        label: "High load, very coarse, humid climate grass",
        desc: "High load, very coarse, continuous, humid climate grass, spread rate and flame length may be extreme if grass is fully cured",
        depth: 4,
        deadMext: 0.3,
        particles: [
            {...Dead1, ovendryLoad: 0.02295684113865932, savr: 1500, heat: 8000},
            {...Dead10, ovendryLoad: 0.0459139, heat: 8000},
            {...Herb, ovendryLoad: 0.33516988062442604, savr: 1300, heat: 8000},
        ],
    },
    { number: 109,
        code: "gr9",
        group: "FBFM40",
        label: "Very high load, humid climate grass",
        desc: "Very high load, dense, tall, humid climate grass, about 6 feet tall, spread rate and flame length can be extreme if grass is fully cured",
        depth: 5,
        deadMext: 0.4,
        particles: [
            {...Dead1, ovendryLoad: 0.04591368227731864, savr: 1800, heat: 8000},
            {...Dead10, ovendryLoad: 0.04591368227731864, heat: 8000},
            {...Herb, ovendryLoad: 0.4132231404958677, savr: 1600, heat: 8000},
        ],
    },
    { number: 121,
        code: "gs1",
        group: "FBFM40",
        label: "Low load, dry climate grass-shrub",
        desc: "Low load, dry climate grass-shrub shrub about 1 foot high, grass load low, spread rate moderate and flame length low",
        depth: 0.9,
        deadMext: 0.15,
        particles: [
            {...Dead1, ovendryLoad: 0.009182736455463728, savr: 2000, heat: 8000},
            {...Herb, ovendryLoad: 0.02295684113865932, savr: 1800, heat: 8000},
            {...Stem, ovendryLoad: 0.02984403, savr: 1800, heat: 8000}
        ],
    },
    { number: 122,
        code: "gs2",
        group: "FBFM40",
        label: "Moderate load, dry climate grass-shrub",
        desc: "Moderate load, dry climate grass-shrub, shrubs are 1-3 feet high, grass load moderate, spread rate high, and flame length is moderate",
        depth: 1.5,
        deadMext: 0.15,
        particles: [
            {...Dead1, ovendryLoad: 0.02295684113865932, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.02295684113865932, heat: 8000},
            {...Herb, ovendryLoad: 0.027548209366391182, savr: 1800, heat: 8000},
            {...Stem, ovendryLoad: 0.04591368227731864, savr: 1800, heat: 8000}
        ],
    },
    { number: 123,
        code: "gs3",
        group: "FBFM40",
        label: "Moderate load, humid climate grass-shrub",
        desc: "Moderate load, humid climate grass-shrub, moderate grass/shrub load, grass/shrub depth is less than 2 feet, spread rate is high and flame length is moderate",
        depth: 1.8,
        deadMext: 0.4,
        particles: [
            {...Dead1, ovendryLoad: 0.013774104683195591, savr: 1800, heat: 8000},
            {...Dead10, ovendryLoad: 0.01147842056932966, heat: 8000},
            {...Herb, ovendryLoad: 0.06657483930211203, savr: 1600, heat: 8000},
            {...Stem, ovendryLoad: 0.057392102846648294, savr: 1600, heat: 8000}
        ],
    },
    { number: 124,
        code: "gs4",
        group: "FBFM40",
        label: "High load, humid climate grass-shrub",
        desc: "High load, humid climate grass-shrub, heavy grass/shrub load, depth is greater than 2 feet, spread rate is high and flame length very high",
        depth: 2.1,
        deadMext: 0.4,
        particles: [
            {...Dead1, ovendryLoad: 0.0872359963269054, savr: 1800, heat: 8000},
            {...Dead10, ovendryLoad: 0.013774104683195591, heat: 8000},
            {...Dead100, ovendryLoad: 0.004591368227731864, heat: 8000},
            {...Herb, ovendryLoad: 0.15610651974288337, savr: 1600, heat: 8000},
            {...Stem, ovendryLoad: 0.3259871441689623, savr: 1600, heat: 8000}
        ],
    },
    { number: 141,
        code: "sh1",
        group: "FBFM40",
        label: "Low load, dry climate shrub",
        desc: "Low load dry climate shrub, woody shrubs and shrub litter, fuelbed depth about 1 foot, may be some grass, spread rate and flame low",
        depth: 1,
        deadMext: 0.15,
        particles: [
            {...Dead1, ovendryLoad: 0.01147842056932966, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.01147842056932966, heat: 8000},
            {...Herb, ovendryLoad: 0.0068870523415977955, savr: 1800, heat: 8000},
            {...Stem, ovendryLoad: 0.05968778696051423, savr: 1600, heat: 8000}
        ],
    },
    { number: 142,
        code: "sh2",
        group: "FBFM40",
        label: "Moderate load, dry climate shrub",
        desc: "Moderate load dry climate shrub, woody shrubs and shrub litter, fuelbed depth about 1 foot, no grass, spread rate and flame low",
        depth: 1,
        deadMext: 0.15,
        particles: [
            {...Dead1, ovendryLoad: 0.06198347107438017, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.11019283746556473, heat: 8000},
            {...Dead100, ovendryLoad: 0.03443526170798898, heat: 8000},
            {...Stem, ovendryLoad: 0.17676767676767677, savr: 1600, heat: 8000}
        ],
    },
    { number: 143,
        code: "sh3",
        group: "FBFM40",
        label: "Moderate load, humid climate shrub",
        desc: "Moderate load, humid climate shrub, woody shrubs and shrub litter, possible pine overstory, fuelbed depth 2-3 feet, spread rate and flame low",
        depth: 2.4,
        deadMext: 0.4,
        particles: [
            {...Dead1, ovendryLoad: 0.02066115702479339, savr: 1600, heat: 8000},
            {...Dead10, ovendryLoad: 0.13774104683195593, heat: 8000},
            {...Stem, ovendryLoad: 0.28466483011937554, savr: 1400, heat: 8000}
        ],
    },
    { number: 144,
        code: "sh4",
        group: "FBFM40",
        label: "Low load, humid climate timber-shrub",
        desc: "Low load, humid climate timber shrub, woody shrubs and shrub litter, low to moderate load, possible pine overstory, fuelbed depth about 3 feet, spread rate high and flame moderate",
        depth: 3,
        deadMext: 0.3,
        particles: [
            {...Dead1, ovendryLoad: 0.03902662993572084, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.05280073461891643, heat: 8000},
            {...Dead100, ovendryLoad: 0.009182736455463728, heat: 8000},
            {...Stem, ovendryLoad: 0.11707988980716252, savr: 1600, heat: 8000}
        ],
    },
    { number: 145,
        code: "sh5",
        group: "FBFM40",
        label: "High load, dry climate shrub",
        desc: "High load, dry climate shrub litter and woody shrubs, heavy load with depth 4-6 feet, spread rate and flame very high, moisture extinction high",
        depth: 6,
        deadMext: 0.15,
        particles: [
            {...Dead1, ovendryLoad: 0.1652892561983471, savr: 750, heat: 8000},
            {...Dead10, ovendryLoad: 0.09641873278236915, heat: 8000},
            {...Stem, ovendryLoad: 0.13314967860422405, savr: 1600, heat: 8000}
        ],
    },
    { number: 146,
        code: "sh6",
        group: "FBFM40",
        label: "Low load, humid climate shrub",
        desc: "Low load, humid climate shrub, woody shrubs and shrub litter, dense shrubs, little or no herbaceous fuel, depth about 2 feet, spread rate and flame high",
        depth: 2,
        deadMext: 0.3,
        particles: [
            {...Dead1, ovendryLoad: 0.13314967860422405, savr: 750, heat: 8000},
            {...Dead10, ovendryLoad: 0.06657483930211203, heat: 8000},
            {...Stem, ovendryLoad: 0.06427915518824609, savr: 1600, heat: 8000}
        ],
    },
    { number: 147,
        code: "sh7",
        group: "FBFM40",
        label: "Very high load, dry climate shrub",
        desc: "Very high load, dry climate shrub, woody shrubs and shrub litter, very heavy shrub load, depth 4-6 feet, spread rate somewhat lower than SH6 and flame very high",
        depth: 6,
        deadMext: 0.15,
        particles: [
            {...Dead1, ovendryLoad: 0.16069788797061524, savr: 750, heat: 8000},
            {...Dead10, ovendryLoad: 0.24334251606978877, heat: 8000},
            {...Dead100, ovendryLoad: 0.10101010101010101, heat: 8000},
            {...Stem, ovendryLoad: 0.15610651974288337, savr: 1600, heat: 8000}
        ],
    },
    { number: 148,
        code: "sh8",
        group: "FBFM40",
        label: "High load, humid climate shrub",
        desc: "High load, humid climate shrub, woody shrubs and shrub litter, dense shrubs, little or no herbaceous fuel, depth about 3 feet, spread rate and flame high",
        depth: 3,
        deadMext: 0.4,
        particles: [
            {...Dead1, ovendryLoad: 0.0941230486685032, savr: 750, heat: 8000},
            {...Dead10, ovendryLoad: 0.15610651974288337, heat: 8000},
            {...Dead100, ovendryLoad: 0.03902662993572084, heat: 8000},
            {...Stem, ovendryLoad: 0.19972451790633605, savr: 1600, heat: 8000}
        ],
    },
    { number: 149,
        code: "sh9",
        group: "FBFM40",
        label: "Very high load, humid climate shrub",
        desc: "Very high load, humid climate shrub, woody shrubs and shrub litter, dense finely branched shrubs with fine dead fuel, 4-6 feet tall, herbaceous may be present, spread rate and flame high",
        depth: 4.4,
        deadMext: 0.4,
        particles: [
            {...Dead1, ovendryLoad: 0.20661157024793386, savr: 750, heat: 8000},
            {...Dead10, ovendryLoad: 0.11248852157943066, heat: 8000},
            {...Herb, ovendryLoad: 0.07116620752984389, savr: 1800, heat: 8000},
            {...Stem, ovendryLoad: 0.3213957759412305, savr: 1500, heat: 8000}
        ],
    },
    { number: 161,
        code: "tu1",
        group: "FBFM40",
        label: "Light load, dry climate timber-grass-shrub",
        desc: "Low load dry climate timber grass shrub, low load of grass and/or shrub with litter, spread rate and flame low",
        depth: 0.6,
        deadMext: 0.2,
        particles: [
            {...Dead1, ovendryLoad: 0.009182736455463728, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.04132231404958678, heat: 8000},
            {...Dead100, ovendryLoad: 0.06887052341597796, heat: 8000},
            {...Herb, ovendryLoad: 0.009182736455463728, savr: 1800, heat: 8000},
            {...Stem, ovendryLoad: 0.04132231404958678, savr: 1600, heat: 8000}
        ],
    },
    { number: 162,
        code: "tu2",
        group: "FBFM40",
        label: "Moderate load, humid climate timber-shrub",
        desc: "Moderate load, humid climate timber-shrub, moderate litter load with some shrub, spread rate moderate and flame low",
        depth: 1,
        deadMext: 0.3,
        particles: [
            {...Dead1, ovendryLoad: 0.0436179981634527, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.08264462809917356, heat: 8000},
            {...Dead100, ovendryLoad: 0.057392102846648294, heat: 8000},
            {...Stem, ovendryLoad: 0.009182736455463728, savr: 1600, heat: 8000}
        ],
    },
    { number: 163,
        code: "tu3",
        group: "FBFM40",
        label: "Moderate load, humid climate timber-grass-shrub",
        desc: "Moderate load, humid climate timber grass shrub, moderate forest litter with some grass and shrub, spread rate high and flame moderate",
        depth: 1.3,
        deadMext: 0.3,
        particles: [
            {...Dead1, ovendryLoad: 0.050505050505050504, savr: 1800, heat: 8000},
            {...Dead10, ovendryLoad: 0.0068870523415977955, heat: 8000},
            {...Dead100, ovendryLoad: 0.01147842056932966, heat: 8000},
            {...Herb, ovendryLoad: 0.029843893480257115, savr: 1600, heat: 8000},
            {...Stem, ovendryLoad: 0.050505050505050504, savr: 1400, heat: 8000}
        ],
    },
    { number: 164,
        code: "tu4",
        group: "FBFM40",
        label: "Dwarf conifer understory",
        desc: "Dwarf conifer with understory, short conifer trees with grass or moss understory, spread rate and flame moderate",
        depth: 0.5,
        deadMext: 0.12,
        particles: [
            {...Dead1, ovendryLoad: 0.20661157024793386, savr: 2300, heat: 8000},
            {...Stem, ovendryLoad: 0.09182736455463728, savr: 2000, heat: 8000}
        ],
    },
    { number: 165,
        code: "tu5",
        group: "FBFM40",
        label: "Very high load, dry climate timber-shrub",
        desc: "Very high load, dry climate timber shrub, heavy forest litter with shrub or small tree understory, spread rate and flame moderate",
        depth: 1,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.18365472910927455, savr: 1500, heat: 8000},
            {...Dead10, ovendryLoad: 0.18365472910927455, heat: 8000},
            {...Dead100, ovendryLoad: 0.13774104683195593, heat: 8000},
            {...Stem, ovendryLoad: 0.13774104683195593, savr: 750, heat: 8000}
        ],
    },
    { number: 181,
        code: "tl1",
        group: "FBFM40",
        label: "Low load, compact conifer litter",
        desc: "Low load compact conifer litter, compact forest litter, light to moderate load, 1-2 inches deep, may represent a recent burn, spread rate and flame low",
        depth: 0.2,
        deadMext: 0.3,
        particles: [
            {...Dead1, ovendryLoad: 0.04591368227731864, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.10101010101010101, heat: 8000},
            {...Dead100, ovendryLoad: 0.1652892561983471, heat: 8000},
        ],
    },
    { number: 182,
        code: "tl2",
        group: "FBFM40",
        label: "Low load broadleaf litter",
        desc: "Low load broadleaf litter, broadleaf, hardwood litter, spread rate and flame low",
        depth: 0.2,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.06427915518824609, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.10560146923783285, heat: 8000},
            {...Dead100, ovendryLoad: 0.10101010101010101, heat: 8000},
        ],
    },
    { number: 183,
        code: "tl3",
        group: "FBFM40",
        label: "Moderate load conifer litter",
        desc: "Moderate load conifer litter, moderate load conifer litter, light load of coarse fuels, spread rate is very low and flame low",
        depth: 0.3,
        deadMext: 0.2,
        particles: [
            {...Dead1, ovendryLoad: 0.02295684113865932, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.10101010101010101, heat: 8000},
            {...Dead100, ovendryLoad: 0.12855831037649218, heat: 8000},
        ],
    },
    { number: 184,
        code: "tl4",
        group: "FBFM40",
        label: "Small downed logs",
        desc: "Small downed logs moderate load of fine litter and coarse fuels, small diameter downed logs, spread rate and flame low",
        depth: 0.4,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.02295684113865932, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.06887052341597796, heat: 8000},
            {...Dead100, ovendryLoad: 0.1928374655647383, heat: 8000},
        ],
    },
    { number: 185,
        code: "tl5",
        group: "FBFM40",
        label: "High load conifer litter",
        desc: "High load conifer litter, light slash or dead fuel, spread rate and flame low",
        depth: 0.6,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.05280073461891643, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.11478420569329659, heat: 8000},
            {...Dead100, ovendryLoad: 0.20202020202020202, heat: 8000},
        ],
    },
    { number: 186,
        code: "tl6",
        group: "FBFM40",
        label: "High load broadleaf litter",
        desc: "Moderate load broadleaf litter, spread rate and flame moderate",
        depth: 0.3,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.11019283746556473, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.055096418732782364, heat: 8000},
            {...Dead100, ovendryLoad: 0.055096418732782364, heat: 8000},
        ],
    },
    { number: 187,
        code: "tl7",
        group: "FBFM40",
        label: "Large downed logs",
        desc: "Large downed logs, heavy load forest litter, larger diameter downed logs, spread rate and flame low",
        depth: 0.4,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.013774104683195591, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.06427915518824609, heat: 8000},
            {...Dead100, ovendryLoad: 0.371900826446281, heat: 8000},
        ],
    },
    { number: 188,
        code: "tl8",
        group: "FBFM40",
        label: "Long-needle litter",
        desc: "Long needle litter, moderate load long needle pine litter, may have small amounts of herbaceous fuel, spread rate moderate and flame low",
        depth: 0.3,
        deadMext: 0.35,
        particles: [
            {...Dead1, ovendryLoad: 0.2662993572084481, savr: 1800, heat: 8000},
            {...Dead10, ovendryLoad: 0.06427915518824609, heat: 8000},
            {...Dead100, ovendryLoad: 0.050505050505050504, heat: 8000},
        ],
    },
    { number: 189,
        code: "tl9",
        group: "FBFM40",
        label: "Very high load broadleaf litter",
        desc: "Very high load broadleaf litter, may be heavy needle drape, spread rate and flame moderate",
        depth: 0.6,
        deadMext: 0.35,
        particles: [
            {...Dead1, ovendryLoad: 0.305325987144169, savr: 1800, heat: 8000},
            {...Dead10, ovendryLoad: 0.1515151515151515, heat: 8000},
            {...Dead100, ovendryLoad: 0.19054178145087236, heat: 8000},
        ],
    },
    { number: 201,
        code: "sb1",
        group: "FBFM40",
        label: "Low load activity fuel",
        desc: "Low load activity fuel, light dead and down activity fuel, fine fuel is 10-20 t/ac, 1-3 inches in diameter, depth < 1 foot, spread rate moderate and flame low",
        depth: 1,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.06887052341597796, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.13774104683195593, heat: 8000},
            {...Dead100, ovendryLoad: 0.505050505050505, heat: 8000},
        ],
    },
    { number: 202,
        code: "sb2",
        group: "FBFM40",
        label: "Moderate load activity or low load blowdown",
        desc: "Moderate load activity fuel or low load blowdown, 7-12 t/ac, 0-3 inch diameter class, depth about 1 foot, blowdown scattered with many still standing, spread rate moderate and flame low",
        depth: 1,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.20661157024793386, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.1951331496786042, heat: 8000},
            {...Dead100, ovendryLoad: 0.18365472910927455, heat: 8000},
        ],
    },
    { number: 203,
        code: "sb3",
        group: "FBFM40",
        label: "High load activity fuel or moderate load blowdown",
        desc: "High load activity fuel or moderate load blowdown, heavy dead down activity fuel or moderate blowdown, 7-12 t/ac, 0-.25 inch diameter class, depth > 1 foot, blowdown moderate trees compacted to near the ground, spread rate and flame high",
        depth: 1.2,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.2525252525252525, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.12626262626262624, heat: 8000},
            {...Dead100, ovendryLoad: 0.13774104683195593, heat: 8000},
        ],
    },
    { number: 204,
        code: "sb4",
        group: "FBFM40",
        label: "High load blowdown",
        desc: "High load blowdown, heavy blowdown fuel, blowdown is total fuelbed not compacted, foliage and fine fuel still attached to blowdown, spread rate and flame very high ",
        depth: 2.7,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.24104683195592286, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.16069788797061524, heat: 8000},
            {...Dead100, ovendryLoad: 0.24104683195592286, heat: 8000},
        ],
    },
    { number: 301,
        code: "crown",
        group: "CROWN",
        label: "Crown canopy fuel",
        desc: "Crown canopy fuel model used by Rothermel`s crown fire spread rate model.",
        depth: 1,
        deadMext: 0.25,
        particles: [
            {...Dead1, ovendryLoad: 0.138, savr: 2000, heat: 8000},
            {...Dead10, ovendryLoad: 0.092, heat: 8000},
            {...Dead100, ovendryLoad: 0.23, heat: 8000},
            {...Stem, ovendryLoad: 0.092, savr: 1500, heat: 8000}
        ],
    },
]

import fs from 'fs'
import { StandardFuelModelData, StandardFuelModelDescMap } from './StandardFuelModelData.js'

let lines = [
    '// ----------------------------------------------------------------------------',
    '// Standard Fire Behavior Fuel Models',
    '// as defined by Albini, Anderson, Scott & Burgan,',
    '// and used in BehavePlus, LANDFIRE, FARSITE, FlamMap.',
    '// ----------------------------------------------------------------------------',
    '',
    '// ----------------------------------------------------------------------------',
    '// Part 1: FuelModelParticle Class Definition',
    '// ----------------------------------------------------------------------------',
    '',
    '// Every fuel model has one or more types of FuelModelParticle.  Below is the',
    '// prototype (template) object used to create each FuelModelParticle, and a',
    '// description of their properties.',
    '',
    'const FuelModelParticle = {',
    '    // The "type" property is used to match the particle with the appropriate fraction cured class.',
    '    // The standard fire behavior fuel models use "dead1h", "dead10h", "dead100h", "stem", and "herb",',
    '    // types, but custom fuel models may assign new type keys as needed, such as "cheatgrass",',
    '    // or "fineChaparralStem". In this cases, the CuringConditions object would then look like:',
    '    //     curingConditions = {herb: 0.5, cheatgrass: 0.75, fineChaparralStem: 1}',
    '    type: "dead1h",',
    '',
    '    // The "life" property is one of the following strings: "dead", "live", or "curable"',
    '    life: "dead",',
    '',
    '    // The "ovendryLoad" is in (lb/ft2) [where lb/ft2 = 0.004591368227731864 * ton/ac]',
    '    ovendryLoad: 0,',
    '',
    '    // The "savr" is the surface area-to-volume ratio (ft2/ft3)',
    '    savr: 1,',
    '',
    '    // The "heat" is the low heat content, aka the "heat of combustion" (BTU/lb)',
    '    heat: 8000,',
    '',
    '    // The "density" is the fuel particle fiber density (lb/ft3)',
    '    density: 32,',
    '',
    '    // The "totalMineral" is the fuel particle total mineral content (lb minerals / lb ovendry fuel)',
    '    totalMineral: 0.0555,',
    '',
    '    // The "effectiveMineral" is fuel particle "effective" (non-silica) mineral content (lb silica-free minerals / lb ovendry wood)',
    '    effectiveMineral: 0.01,',
    '',
    '    // The "deadMoistureClass" is the key to the moisture content applied when this particle is dead.',
    '    // The standard fuel models use "dead1h", "dead10h", and "dead100h" dead fuel moisture class keys,',
    '    // but custom fuel models may create new keys such as "duff", "litter", or "fineChaparralStem".',
    '    // In this case the user`s MoistureConditions object would look like: {dead1h: 0.05, dead10h: 0.07,',
    '    // dead100h: 0.12, herb: 1.5, stem: 5, litter: 0.2, duff: 0.25, fineChaparralStem: 0.12}.',
    '    deadMoistureClass: "dead1h",',
    '',
    '    // The "liveMoistureClass" is the key to the moisture content applied when this particle is live.',
    '    // The standard fuel models use "herb" and "stem" live moisture class keys, but custom fuel models',
    '    // may create new keys such as "liveCheatgrass" or "liveFineChaparralStem".  In this case the user`s',
    '    // MoistureConditions object would look like: {dead1h: 0.05, dead10h: 0.07, dead100h: 0.12,',
    '    // herb: 1.5, stem: 2,5, liveCheatgrass: 1.2, liveFineChaparralStem: 2.0}',
    '    liveMoistureClass: "stem"}',
    '',
    '// The heat-of-combustion, density, and two mineral content properties do not vary',
    '// significantly across vegetative fuels and are generally treated as constants.',
    '',
    '// The fire spread model recognizes two "categories" of fuel; "dead" and "live".',
    '// The standard fire behavior fuel models recognize 3 "classes" of dead fuels,',
    '// and two classes of live fuels, as described below.',
    '',
    '// ----------------------------------------------------------------------------',
    '// Part 1.1 Dead Category FuelParticles',
    '// ----------------------------------------------------------------------------',
    '',
    '// Dead category fuels are classified based upon their fuel moisture "time-lag" classes',
    '// (1-, 10, or 100-h) indicating their response time to changes in ambient temperature',
    '// humidity, solar radiation, and precipitation.  The time-lag, in turn, depends',
    '// primarily upon dead particle size as expressed by its surface-area-to-volume ratio.',
    '',
    '// Dead 1-h fuel moisture time-lag class particles have a surface area-to-volume ratio',
    '// less than 192 ft2/ft3 (equivalent to a 0.25-in diameter cylinder). The standard fuel model',
    '// surface-area-to-volume ratios for dead 1-h fuels range from 750 to 3500 ft2/ft3',
    '// (0.064 to 0.0137 inch diameter).',
    '// The following template object is used to create standard dead 1-h time-lag fuel particles:',
    'export const Dead1 = {...FuelModelParticle, type: "dead1h", life: "dead",',
    '    deadMoistureClass: "dead1h", liveMoistureClass: "dead1h"}',
    '',
    '// Dead 10-h fuel moisture time-lag class particles have a surface area-to-volume ratio',
    '// between 48 and 192 ft2/ft3 (1 to 0.25 inch diameter).  The standard fire behavior fuel models',
    '// use a fixed surface-area-to-volume ratio of 109 1/ft (0.44-in diameter) for dead 10-h fuels.',
    '// The following template object is used to create standard dead 10-h time-lag fuel particles:',
    'export const Dead10 = {...FuelModelParticle, type: "dead10h", life: "dead", savr: 109,',
    '    deadMoistureClass: "dead10h", liveMoistureClass: "dead10h"}',
    '',
    '// Dead 100-h fuel moisture time-lag class particles have a surface area-to-volume ratio',
    '// between 192 and 16 ft2/ft3 (1 to 3 inch diameter).  The standard fire behavior fuel models',
    '// use a fixed surface-area-to-volume ratio of 30 (1.6-in diameter) for dead 100-h fuels.',
    '// The following template object is used to create standard dead 100-h time-lag fuel particles:',
    'export const Dead100 = {...FuelModelParticle, type: "dead100h", life: "dead", savr: 30,',
    '    deadMoistureClass: "dead100h", liveMoistureClass: "dead100h"}',
    '',
    '// ----------------------------------------------------------------------------',
    '// Part 1.2 Live Category FuelParticles',
    '// ----------------------------------------------------------------------------',
    '',
    '// Live category fuels are able to regulate their moisture content independently',
    '// (more or less) of synoptic ambient weather conditions.',
    '',
    '// "Stem" fuels refer to the living, above-ground woody branches, twigs, and',
    '// stems of shrubs and trees. While their moisture contents may range seasonally',
    '// from 50% to 300%, they generally do not cure or die out during the season.',
    '// Standard fire behavior fuel model surface area-to-volume ratios for stems range from',
    '// 750 to 2000 ft2/ft3 (0.064 to 0.024 inch diameter).',
    '// The following template object is used to create standard live stem particles:',
    'export const Stem = {...FuelModelParticle, type: "stem", life: "live",',
    '    deadMoistureClass: "dead1h", liveMoistureClass: "stem"}',
    '',
    '// "Herb" fuels include grasses, forbs, and ferns that may cure during the season.',
    '// The BehavePlus wildland fire modeling system considers herbs to be fully live',
    '// when their moisture content exceeds 120%, and fully cured (dead) when it drops below 30%.',
    '// Standard fire behavior fuel model surface area-to-volume ratios for herbs range from',
    '// range from 1300 to 2000 ft2/ft3 (0.369 to 0.024 inches).',
    '// The following template object is used to create standard live or curable herb particles:',
    'export const Herb = {...FuelModelParticle, type: "herb", life: "curable",',
    '    deadMoistureClass: "dead1h", liveMoistureClass: "herb"}',
    '',
    '// ----------------------------------------------------------------------------',
    '// Part 2 FuelModel Class Definition',
    '// ----------------------------------------------------------------------------',
    '',
    '// Standard fuel models are differentiated by their fuel bed depth (ft), dead fuel',
    '// moisture content of extinction, and number and types of FuelParticles.',
    '',
    '// eslint-disable-next-line no-unused-vars',
    'const FuelModel = {',
    '    number: 0,      // a standard, assigned fuel model number, used as a lookup key',
    '    code: "",       // a standard, assigned fuel model code, also used as a lookup key',
    '    label: "",      // a brief label',
    '    group: "",      // one of "FBFM13", "FBFM40", "LANDFIRE", or "CUSTOM"',
    '    desc: "",       // a more detailed description',
    '    depth: 0.4,     // fuel bed depth (ft)',
    '    deadMext: 0.15, // dead fuel "moisture content of extinction" (lb water / lb ovendry fuel)',
    '    particles: [],  // array of FuelParticle objects',
    '}',
    '',
    '// ----------------------------------------------------------------------------',
    '// 3 The Standard FuelModels',
    '// ----------------------------------------------------------------------------',
    '',
    'export const StandardFuelModels = [\n',
]

let str = lines.join('\n')
for(let m of StandardFuelModelData) {
    const [number, code, group, label, depth, deadMext, load1, load10, load100, loadHerb, loadStem, savr1, savrHerb, savrStem, deadHeat, liveHeat] = m
    const desc = StandardFuelModelDescMap.get(code)
    str += `    { number: ${number},\n`
    str += `        code: "${code}",\n`
    str += `        group: "${group}",\n`
    str += `        label: "${label}",\n`
    str += `        desc: "${desc}",\n`
    str += `        depth: ${depth},\n`
    str += `        deadMext: ${deadMext},\n`
    str += `        particles: [\n`
    if (load1) str += `            {...Dead1, ovendryLoad: ${load1}, savr: ${savr1}, heat: ${deadHeat}},\n`
    if (load10) str += `            {...Dead10, ovendryLoad: ${load10}, heat: ${deadHeat}},\n`
    if (load100) str += `            {...Dead100, ovendryLoad: ${load100}, heat: ${deadHeat}},\n`
    if (loadHerb) str += `            {...Herb, ovendryLoad: ${loadHerb}, savr: ${savrHerb}, heat: ${liveHeat}},\n`
    if (loadStem) str += `            {...Stem, ovendryLoad: ${loadStem}, savr: ${savrStem}, heat: ${liveHeat}}\n`
    str += `        ],\n`
    str += `    },\n`
}
str += ']\n'

const outputFile = '../src/StandardFuelModels.js'
try {
    fs.writeFileSync(outputFile, str)
} catch (err) {
    console.error(err)
}
console.log(`Wrote standard fuel models to '${outputFile}'.`)

function showMinMaxSavr() {
    let maxHerb = 0, maxStem = 0, max1=0, minHerb = 9999, minStem = 9999, min1=9999
    for(let m of StandardFuelModelData) {
        const [number, code, label, depth, deadMext, load1, load10, load100, loadHerb, loadStem, savr1, savrHerb, savrStem, deadHeat, liveHeat] = m
        maxHerb = Math.max(maxHerb, savrHerb)
        if (savrHerb) minHerb = Math.min(minHerb, savrHerb)
        maxStem = Math.max(maxStem, savrStem)
        if (savrStem) minStem = Math.min(minStem, savrStem)
        max1 = Math.max(max1, savr1)
        if (savr1) min1 = Math.min(min1, savr1)
    }
    console.log('herb',minHerb,maxHerb,'stem',minStem,maxStem, '1-h',min1,max1)
}
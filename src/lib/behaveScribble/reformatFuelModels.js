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
    '// Every fuel model has one or more types of FuelModelParticle with the following properties:',
    '',
    'const FuelModelParticle = {',
    '    type: "",       // key to match this particle with the appropriate fraction cured class',
    '    load: 0,        // ovendry fuel load (lb/ft2) [where lb/ft2 = 0.004591368227731864 * ton/ac]',
    '    savr: 1,        // surface-area-to-volume ratio (ft2/ft3)',
    '    heat: 8000,     // low heat content, heat of combustion (BTU/lb)',
    '    dens: 32,       // ovendry density (lb/ft3)',
    '    stot: 0.0555,   // fuel particle total minerl content (lb minerals / lb ovendry fuel)',
    '    seff: 0.01,     // fuel particle effective mineral content (lb silica-free minerals / lb ovendry wood)',
    '    cured: 1,       // fraction of the fuel particle load that is dead or cured [0-1]', 
    '    deadfm: "",     // key to match this particle to the appropriate fuel moisture class when dead',
    '    livefm: ""}     // key to match this particle to the appropriate fuel moisture class when live',
    '',
    '// The "type" property is used to match the particle with the appropriate fraction cured class.',
    '// The standard fire behavior fuel models use "dead1h", "dead10h", "dead100h", "stem", and "herb",',
    '// but custom fuel models may assign new keys as needed, such as "cheatgrass", or "fineChaparral".',
    '// In this case, when invoking "new FuelBed(modelKey, curedObj)", the "curedObj" could',
    '// then look like: {herb: 0.5, cheatgrass: 0.75, fineChaparral: 1}',
    '',
    '// The "deadfm" and "livefm" properties are used to match the particle with the appropriate',
    '// fuel moisture content class.  The standard fire behavior fuel models use "dead1h", "dead10h",',
    '// "dead100h", "herb" and "stem", but custom fuel models may assign new keys as needed,',
    '// such as "duff", "litter", "liveCheatgrass", or "deadCheatgrass". When calling',
    '// FuelBed.updateMoisture(moisObj), the moisObj could then look like:',
    '// {dead1h: 0.05, dead10h: 0.07, dead100h: 0.12, herb: 1.5, stem: 2,5, duff: 0.25,',
    '//  litter: 0.15, liveCheatgrass: 1.5, deadCheatgrass: 0.05}.',
    '',
    '// The heat-of-combustion, density, and two mineral content properties do not vary',
    '// significantly across vegetative fuels and are generally treated as constants.',
    '',
    '// The fire spread model recognizes two "categories" of fuel; dead and live.',
    '// The standard fire behavior fuel models recognize 3 "classes" of dead fuels,',
    '// and two classes of live fuels, as described below.',
    '',
    '// ----------------------------------------------------------------------------',
    '// Part 1.1 Dead Category FuelParticles',
    '// ----------------------------------------------------------------------------',
    '',
    '// Dead category fuels are classified based upon their fuel moisture time-lag classes',
    '// (1-, 10, or 100-h) indicating their response time to changes in ambient temperature',
    '// humidity, solar radiation, and precipitation.  The time-lag, in turn, depends',
    '// primarily upon dead particle size as expressed by its surface-area-to-volume ratio.',
    '// All dead fuels have a "cured" fraction property of 1.',
    '',
    '// Dead 1-h fuel moisture time-lag class particles have a surface area-to-volume ratio',
    '// less than 192 1/ft (equivalent to a 0.25-in diameter cylinder), and the standard fuel model',
    '// surface-area-to-volume ratios range from 750 to 3500 1/ft (0.064 to 0.0137 inch diameter).',
    '// Here is the template object for creating a standard dead 1-h time-lag fuel particle:',
    'const Dead1 = {...FuelModelParticle, type: "dead1h", cured: 1, deadfm: "dead1h", livefm: "dead1h"}',
    '',
    '// Dead 10-h fuel moisture time-lag class particles have a surface area-to-volume ratio',
    '// between 48 and 192 1/ft (1 to 0.25 inch diameter).  The standard fire behavior fuel models',
    '// use a fixed surface-area-to-volume ratio of 109 1/ft (0.44-in diameter).',
    '// Here is the template object for creating a standard dead 10-h time-lag fuel particle:',
    'const Dead10 = {...FuelModelParticle, type: "dead10h", cured: 1, savr: 109, deadfm: "dead10h", livefm: "dead10h"}',
    '',
    '// Dead 100-h fuel moisture time-lag class particles have a surface areato-volume ratio',
    '// between 192 and 16 1/ft (1 to 3 inch diameter).  The standard fire behavior fuel models',
    '// use a fixed surface-area-to-volume ratio of 30 (1.6-in diameter).',
    '// Here is the template object for creating a standard dead 100-h time-lag fuel particle:',
    'const Dead100 = {...FuelModelParticle, type: "dead100h", cured: 1, savr: 30, deadfm: "dead100h", livefm: "dead100h"}',
    '',
    '// ----------------------------------------------------------------------------',
    '// Part 1.2 Live Category FuelParticles',
    '// ----------------------------------------------------------------------------',
    '',
    '// Live category fuels are able to regulate their moisture content more or less',
    '// independently of synoptic ambient weather conditions.',
    '',
    '// "Stem" fuels refer to the living, above-ground woody branches, twigs, and',
    '// stems of shrubs and trees. While their moisture contents may range seasonally',
    '// from 50% to 300%, they generally do not cure or die out during the season.',
    '// Standard fire behavior fuel model surface area-to-volume ratios for stems range from',
    '// 750 to 2000 1/ft (0.064 to 0.024 inch diameter).',
    '// Here is the template object for creating a standard live stem fuel particle:',
    'const Stem = {...FuelModelParticle, type: "stem", cured: 0, deadfm: "dead1h", livefm: "stem"}',
    '',
    '// "Herb" fuels include grasses, forbs, and ferns that may cure during the season.',
    '// Herbs are usually fully live when their moisture content exceeds 120%, and are',
    '// fully cured when it drops below 30%.',
    '// Standard fire behavior fuel model surface area-to-volume ratios for herbs range from',
    '// range from 1300 to 2000 1/ft (0.369 to 0.024 inches).',
    '// Here is the template object for creating a standard live herb fuel particle:',
    'const Herb = {...FuelModelParticle, type: "herb", cured: 0, deadfm: "dead1h", livefm: "herb"}',
    '',
    '// ----------------------------------------------------------------------------',
    '// Part 2 FuelModel Class Definition',
    '// ----------------------------------------------------------------------------',
    '',
    '// Standard fuel models are differentiated by their fuel bed depth (ft), dead fuel',
    '// moisture content of extinction, and FuelParticle types and quantities.',
    '',
    '// eslint-disable-next-line no-unused-vars',
    'const FuelModel = {',
    '    number: 0,      // a standard, assigned fuel model number, used as a lookup key',
    '    code: "",       // a standard, assigned fuel model code, also used as a lookup key',
    '    label: "",      // a brief label',
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
    const [number, code, label, depth, deadMext, load1, load10, load100, loadHerb, loadStem, savr1, savrHerb, savrStem, deadHeat, liveHeat] = m
    const desc = StandardFuelModelDescMap.get(code)
    str += `    { number: ${number},\n`
    str += `        code: "${code}",\n`
    str += `        label: "${label}",\n`
    str += `        desc: "${desc}",\n`
    str += `        depth: ${depth},\n`
    str += `        deadMext: ${deadMext},\n`
    str += `        particles: [\n`
    if (load1) str += `            {...Dead1, load: ${load1}, savr: ${savr1}, heat: ${deadHeat}},\n`
    if (load10) str += `            {...Dead10, load: ${load10}, heat: ${deadHeat}},\n`
    if (load100) str += `            {...Dead100, load: ${load100}, heat: ${deadHeat}},\n`
    if (loadHerb) str += `            {...Herb, load: ${loadHerb}, savr: ${savrHerb}, heat: ${liveHeat}},\n`
    if (loadStem) str += `            {...Stem, load: ${loadStem}, savr: ${savrStem}, heat: ${liveHeat}}\n`
    str += `        ],\n`
    str += `    },\n`
}
str += ']\n'
try {
    fs.writeFileSync('./StandardFuelModels.js', str)
} catch (err) {
    console.error(err)
}

// let maxHerb = 0, maxStem = 0, max1=0, minHerb = 9999, minStem = 9999, min1=9999
// for(let m of StandardFuelModelData) {
//     const [number, code, label, depth, deadMext, load1, load10, load100, loadHerb, loadStem, savr1, savrHerb, savrStem, deadHeat, liveHeat] = m
//     maxHerb = Math.max(maxHerb, savrHerb)
//     if (savrHerb) minHerb = Math.min(minHerb, savrHerb)
//     maxStem = Math.max(maxStem, savrStem)
//     if (savrStem) minStem = Math.min(minStem, savrStem)
//     max1 = Math.max(max1, savr1)
//     if (savr1) min1 = Math.min(min1, savr1)
// }
// console.log('herb',minHerb,maxHerb,'stem',minStem,maxStem, '1-h',min1,max1)
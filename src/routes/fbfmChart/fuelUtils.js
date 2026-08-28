export const FuelModelGroupKeys = {
    '1': '13', '2': '13','3': '13','4': '13','5': '13','6': '13','7': '13','8': '13','9': '13','10': '13','11': '13','12': '13','13': '13',
    'gr1': 'gr', 'gr2': 'gr', 'gr3': 'gr', 'gr4': 'gr', 'gr5': 'gr', 'gr6': 'gr', 'gr7': 'gr', 'gr8': 'gr', 'gr9': 'gr',
    'gs1': 'gs', 'gs2': 'gs', 'gs3': 'gs', 'gs4': 'gs',
    'sh1': 'sh', 'sh2': 'sh', 'sh3': 'sh', 'sh4': 'sh', 'sh5': 'sh', 'sh6': 'sh', 'sh7': 'sh', 'sh8': 'sh', 'sh9': 'sh',
    'tu1': 'tu', 'tu2': 'tu', 'tu3': 'tu', 'tu4': 'tu', 'tu5': 'tu',
    'tl1': 'tl', 'tl2': 'tl', 'tl3': 'tl',  'tl4': 'tl', 'tl5': 'tl', 'tl6': 'tl', 'tl7': 'tl', 'tl8': 'tl', 'tl9': 'tl',
    'sb1': 'sb', 'sb2': 'sb', 'sb3': 'sb', 'sb4': 'sb'
}
// Given a fuelKey, returns the fuel group key
export function getFuelModelGroupKey(fuelKey) {
    return FuelModelGroupKeys[fuelKey]
}

export const FuelGroupModelKeys = {
    '13': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
    gr: ['gr1', 'gr2', 'gr3', 'gr4', 'gr5', 'gr6',  'gr7', 'gr8', 'gr9'],
    gs: ['gs1', 'gs2', 'gs3', 'gs4'],
    sh: ['sh1', 'sh2', 'sh3', 'sh4', 'sh5',  'sh6', 'sh7', 'sh8', 'sh9'],
    tu: ['tu1', 'tu2', 'tu3', 'tu4', 'tu5'],
    tl: ['tl1', 'tl2', 'tl3', 'tl4', 'tl5', 'tl6', 'tl7', 'tl8', 'tl9'],
    sb: ['sb1', 'sb2', 'sb3', 'sb4']
}
// Given a fuel model group key ('13', 'gr', 'gs', 'sh',. 'tu', 'tl', 'sb')
// returns an array of all that group's fuelkeys
export function getFuelGroupModelKeys(groupKey) {
    return FuelGroupModelKeys[groupKey]
}

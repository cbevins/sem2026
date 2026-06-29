export function makeFuelMoisture(
        moistureDead1h, moistureDead10h, moistureDead100h, // dead fuel moisture content (fraction)
        moistureLiveHerb, moistureLiveStem, // live fuel moisture contents (fraction)
        others=[],  // any additional moisture class [key, value] pairs
        // eslint-disable-next-line no-unused-vars
        logger=null, propsLevel=0){
    const pod = {moistureDead1h, moistureDead10h, moistureDead100h,
        moistureLiveHerb, moistureLiveStem}
    // 'others' is an array of [moistureClassKey, moistureFraction] pairs
    for(let [key, value] of others) {
        pod[key] = value
    }
    return pod
}
// eslint-disable-next-line no-unused-vars
export function makeFuelCuring(curedHerb, others=[], logger=null, propsLevel=0) {
    const pod = {curedHerb}
    // 'others' is an array of [curingClassKey, curedFraction] pairs
    for(let [key, value] of others) {
        pod[key] = value
    }
    return pod
}
/**
 * 
 * @param {obj} canopyPod Object with {height, base, cover, bulkDensity, and heatContent} input properties
 * @returns Object with updated {length, ratio, fill, sheltersFuel, midflameWsrf,
 *  fuelLoad, heatPerUnitArea}
 */
export function updateCanopy(canopyPod) {
    // Get input properties
    let {height=0, base=0, cover=0, bulkDensity=0, heatContent=8000} = canopyPod

    // Canopy midflame wrf
    let length = Math.max(0, height - base)
    let ratio = (height > 0) ? length / height : 0
    let fill = cover * ratio / 3
    let sheltersFuel = cover >= 0.01 && fill >= 0.05 && height >= 6
    let midflameWsrf = (! sheltersFuel) ? 1
        : 0.555 / (Math.sqrt(fill * height) * Math.log((20 + 0.36 * height) / (0.13 * height)))

    let fuelLoad = bulkDensity * length    // canopy fuel load (lb/ft2)
    let heatPerUnitArea = fuelLoad * heatContent   // BTU/ft2

    let pod = {
        height, base, cover, length, ratio, fill, sheltersFuel, midflameWsrf,
        bulkDensity, heatContent, fuelLoad, heatPerUnitArea}
    return pod
}

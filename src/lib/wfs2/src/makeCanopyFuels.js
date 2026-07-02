export function makeCanopyFuels(canopyPod, propsLevel=0) {
    // Get required properties
    let {canopyHeight:ht=0, canopyBase:base=0, canopyCover:cover=0,
        canopyBulkDensity:bulk=0, canopyHeatContent:heat=8000} = canopyPod

    // Canopy midflame wrf
    let length = Math.max(0, ht - base)
    let ratio = (ht>0) ? length/ht : 0
    let fill = cover * ratio / 3
    let sheltered = cover >= 0.01 && fill >= 0.05 && ht >= 6
    let canopyMidflameWsrf = (! sheltered) ? 1
        : 0.555 / (Math.sqrt(fill * ht) * Math.log((20 + 0.36 * ht) / (0.13 * ht)))

    let canopyFuelLoad = bulk * length    // canopy fuel load (lb/ft2)
    let canopyHeatPerUnitArea = canopyFuelLoad * heat   // BTU/ft2

    let pod = {
        canopyFuelLoad,
        canopyHeatPerUnitArea,
        canopyMidflameWsrf,
    }
    if (propsLevel > 0) {
        pod = { ...pod,
            canopyFill: fill,
            canopySheltersFuel: sheltered,    
        }
    }
    if (propsLevel > 1) {
        pod = { ...pod,
            canopyLength: length,
            canopyRatio: ratio,
        }
    }
    return pod
}

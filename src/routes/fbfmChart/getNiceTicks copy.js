export function getNiceTicks(min, max, targetCount = 5) {
    const range = max - min
    if (range === 0) return { min, max, step: 1, ticks: [min] }

    const roughStep = range / targetCount
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)))
    const residual = roughStep / magnitude

    let niceResidual
    if (residual <= 1) niceResidual = 1
    else if (residual <= 2) niceResidual = 2
    else if (residual <= 5) niceResidual = 5
    else niceResidual = 10

    const step = niceResidual * magnitude
    const niceMin = Math.floor(min / step) * step
    const niceMax = Math.ceil(max / step) * step

    const ticks = []
    for (let val = niceMin; val <= niceMax + step * 1e-9; val += step) {
        ticks.push(Number(val.toFixed(10)))
    }

    return { min: niceMin, max: niceMax, step, ticks }
}

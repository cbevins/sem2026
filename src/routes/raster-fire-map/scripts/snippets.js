function rounding() {
    const values = [1.4, 1.5, 1.6, -1.4, -1.5, -1.6]
    const results = []
    for (let v of values) {
        results.push({value: v,
            round: Math.round(v),
            trunc: Math.trunc(v),
            ceil: Math.ceil(v),
            floor: Math.floor(v)
        })
    }
    console.table(results)
}
rounding()

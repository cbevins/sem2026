import fs from 'fs'

const Fbfm40 = [
        1,2,3,4,5,6,7,8,9,10,11,12,13,    // 0-12
        91,92,93,98,99,   // urban/developed, snow/ice, ag/crop, open water, bare ground
        101,102,103,104,105,106,107,108,109, // 26
        121,122,123,124, // 30
        141,142,143,144,145,146,147,148,149, // 39
        161,162,163,164,165,    // 5
        181,182,183,184,185,186,187,188,189, // 53
        201,202,203,204]        // 57

// Reads ArcInfo ASCII formatted file into an array of lines to be parsed
function readAAIGridIntoLines(fileName) {
    let data
    try {
        // Synchronously read the file using 'ascii' encoding
        data = fs.readFileSync(fileName, 'ascii');
    } catch (err) {
        // Always wrap in a try-catch for synchronous operations to handle missing files
        console.error('Error reading file:', err);
    }
    return data.split('\n')
}

function compile(fileName, lines, validValues) {
    // Read the raster properties from the first 6 file lines
    const prop = {file: fileName}
    for(let i=0; i<6; i++) {
        const fields = lines[i].split(' ')
        prop[fields[0]] = fields[fields.length-1]
    }
    prop.ncols = parseInt(prop.ncols)
    prop.nrows = parseInt(prop.nrows)

    // Determine max valid values
    // For FBFM40, validValues.length = 58 and maxValue is 204
    let maxValue = validValues[0]
    for(let value of validValues)
        maxValue = Math.max(maxValue, value)

    const encode = new Array(maxValue+1).fill(0)
    for(let i=0; i<validValues.length; i++) {
        const value = validValues[i]
        // console.log(`validValue[${i}] is FBFM40 ${value} : encode[${value}] is validValue[${i}]`)
        encode[value] = i// Fbfm[19] = 101, while encode[101] = 19
    }

    // Create a frequency of occurrence and a transition matrix
    const dim = validValues.length
    const counts = new Array(dim).fill(0)
    const matrix = new Array(dim)
    for(let i=0; i<dim; i++)
        matrix[i] = new Array(dim).fill(0)
    console.log(`Transition Matrix is ${dim} x ${dim}`)

    // Process each triplet of lines in a Moore neighborhood
    let top = lines[6].split(' ')
    let mid = lines[7].split(' ')
    let bot
    for(let i=8; i<prop.nrows; i++) {
        bot = lines[i].split(' ')
        for(let col=1; col<prop.ncols-1; col++) {
            if (mid[col] === prop.NODATA_value) continue
            const m = encode[mid[col]]
            counts[m]++
            for(let n of [top[col-1],top[col],top[col+1],mid[col-1],mid[col+1],bot[col-1],bot[col],bot[col+1]]) {
                if (n !== prop.NODATA_value) {
                    matrix[m][encode[n]]++
                }
            }
        }
        top = mid
        mid = bot
    }

    let total = 0
    const freq = []
    for(let i=0; i<counts.length; i++) total += counts[i]
    for(let i=0; i<counts.length; i++) {
        const count = counts[i]
        const pct = Math.trunc(100*100*(count/total)/100)
        freq.push({value: validValues[i], count, pct})
    }
    return {prop, matrix, freq}
}

console.log(process.argv[0], new Date())
const t0 = performance.now()
const fileName = './Missoula/LF2024_FBFM40_CONUS/LF2024_FBFM40_CONUS.asc'
const lines = readAAIGridIntoLines(fileName)
const t1 = performance.now()
console.log('readAAIGridIntoLines():', (t1-t0).toFixed(2), 'msec')

const {prop, matrix, freq} = compile(fileName, lines, Fbfm40)
const t2 = performance.now()
console.log('compile():', (t2-t1).toFixed(2), 'msec')
console.log('Properties', prop)
console.log('Encode Frequencies:')
console.table(freq)

const t3 = performance.now()
const table = []
for(let i=0; i<freq.length; i++) {
    const f = freq[i]
    const self = matrix[i][i]
    let total = 0
    for(let j=0; j<matrix[i].length; j++) {
        total += matrix[i][j]
    }
    if (total) {
        const pct = (self/total).toFixed(6)
        table.push({fbfm40: f.value, freq: f.count, toSelf: pct})
    }
}
console.table(table)

console.log('Total time', (t3-t0).toFixed(2))

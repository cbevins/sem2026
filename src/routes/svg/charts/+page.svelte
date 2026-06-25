<script>

const In = {x:0, y:0, text:'', wd: 120, ht:20, fontsize: 10}
const inputs = [
    {...In, x: 100, y: 100, text: 'fuelCuring'},
    {...In, x: 100, y: 150, text: 'fuelKey'},

    // Live fuel moisture module
    {...In, x: 100, y: 200, text: 'moistureLiveHerb'},
    {...In, x: 100, y: 250, text: 'moistureLiveStem'},

    // Dead fuel moisture module
    {...In, x: 100, y: 300, text: 'moistureDead1h'},
    {...In, x: 100, y: 350, text: 'moistureDead10h'},
    {...In, x: 100, y: 400, text: 'moistureDead100h'},

    {...In, x: 100, y: 450, text: 'windBearing'},
    {...In, x: 100, y: 600, text: 'aspect'},

    // Midflame wind speed module
    {...In, x: 100, y: 450, text: 'windSource'},
    {...In, x: 100, y: 500, text: 'midflameWindSpeed'},
    {...In, x: 100, y: 500, text: 'midflameWindReduction'},
    {...In, x: 100, y: 600, text: 'windSpeed10m'},
    {...In, x: 100, y: 600, text: 'windSpeed20ft'},
    
    // Slope steepness module
    {...In, x: 100, y: 550, text: 'slopeRatio'},
    {...In, x: 100, y: 550, text: 'slopeDegrees'},
    {...In, x: 100, y: 600, text: 'mapScale'},
    {...In, x: 100, y: 600, text: 'mapCountourInterval'},
    {...In, x: 100, y: 600, text: 'mapCountours'},
    {...In, x: 100, y: 600, text: 'mapDistance'},
]
const boxMap = new Map()

// Canopy module (wind speed reduction portion)
const colWd =100
const colPad = 0
const rowHt = 20
const rowPad = 50
const mt = 10
const ml = 10
const canopyBoxes = [
    {key: 'base', c: 0, r: 0, text: 'canopyBaseHeight'},
    {key: 'height', c: 2, r: 0, text: 'canopyHeight'},
    {key: 'cover', c: 4, r: 0, text: 'canopyCover'},
    {key: 'ratio', c: 1, r: 1, text: 'canopyRatio'},
    {key: 'fill', c: 3, r: 2, text: 'canopyFill'},
    {key: 'shelters', c: 3, r: 3, text: 'canopySheltersFuel'},
    {key: 'mwrf', c: 1, r: 4, text: 'canopyWindReductionFactor'},
]
addBoxes(canopyBoxes)
function addBoxes(boxes) {
    for(let i=0; i<boxes.length; i++) {
        const item = boxes[i]
        const x = ml + item.c * (colWd + colPad)
        const y = mt + item.r * (rowHt + rowPad)
        const left = {x: x, y: y+rowHt/2}
        const right = {x: x+colWd, y: y+rowHt/2}
        const top = {x: x+colWd/2, y}
        const bot = {x: x+colWd/2, y: y+rowHt}
        const entry = {...item, x, y, wd: colWd, ht:rowHt, left, right, top, bot}
        boxMap.set(item.key, entry)
        boxes[i] = entry
    }
}
console.log(canopyBoxes)

const canopyLines = [
    {box1: 'base', port1: 'bot', box2: 'ratio', port2: 'top'},
    {box1: 'height', port1: 'bot', box2: 'ratio', port2: 'top'},
]
function addLines(lines) {
    for(let i=0; i<lines.length; i++) {
        const item = lines[i]
        const box1 = boxMap.get(item.box1)
        const box2 = boxMap.get(item.box2)
        const {x:x1, y:y1} = box1[item.port1]
        const {x:x3, y:y3} = box2[item.port2]
        const x2 = (x1+x3)/2
        const y2 = (y1+y3)/2
        lines[i] = {...item, x1, y1, x2, y2, x3, y3}
    }
}
addLines(canopyLines)

</script>
<div class='ml-4 mt-4 mb-4'>
    <div class='text-xl border rounded bg-gray-300'>
        BehavePlus Surface Module
    </div>

    <svg width=700 height=1000>
        <rect x=0 y=0 width=700 height=1000 fill='none' stroke='black'/>
        {#each canopyBoxes as box}
            <rect x={box.x} y={box.y} width={box.wd} height={box.ht}
                fill='none' stroke='black'/>
            <text x={box.x+0.5*box.wd} y={box.y+0.5*box.ht}
                text-anchor='middle' alignment-baseline='middle'
                font-size=10>
                {box.text}</text>
        {/each}
        {#each canopyLines as line}
            <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke='black'/>
            <line x1={line.x2} y1={line.y2} x2={line.x3} y2={line.y3} stroke='black'/>
        {/each}
    </svg>
</div>
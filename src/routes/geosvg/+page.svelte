<script>
    import { geoJsonExample } from "./geoJsonExample"
    import { GeoSvg } from "./GeoSvg.js"
    let geosvg = new GeoSvg(500, 500, 250, 250, 1)
</script>

<div class='text-xl border rounded'>GeoSVG</div>
<div>
    <ul>
        <li>svg width = {geosvg.svg.width}</li>
        <li>svg height = {geosvg.svg.height}</li>
        <li>focus east = {geosvg.focus.east}</li>
        <li>focus north = {geosvg.focus.north}</li>
        <li>units/pixel = {geosvg.upp}</li>
        <li>west edge svg x = {geosvg.west()}</li>
        <li>east edge svg x = {geosvg.east()}</li>
        <li>south edge svg y = {geosvg.south()}</li>
        <li>north edge svg y = {geosvg.north()}</li>
    </ul>
</div>

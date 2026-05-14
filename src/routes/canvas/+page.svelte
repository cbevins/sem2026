<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    const title = 'Canvas Fire Growth Demos'
    const items = [{
        route: '/canvas/fire-ellipse',
        title: 'Fire Ellipse Growth (5/5/2026) [CURRENT PROJECT]',
        brief: 'Uses a FireEllipse wavelet to expand a fire front.',
    },{
        route: '/canvas/ray-cast',
        title: 'Fire Ellipse Ray-Cast (4/3/2026)',
        brief: 'Attempt at fire ellipse growth using ray-casting techniques.',
    },{
        route: '/canvas/vector-grid',
        title: 'Vectors to Visit All Grid Cells (4/9/2026)',
        brief: 'Attempt to develop vector walking algorithm.',
    },{
        route: '/canvas/ellipse-scan-lines',
        title: 'Ellipse Scan Lines for HTML Canvas (4/1/2026)',
        brief: 'Demo of rotated fire ellipse scan lines',
    },{
        route: '/canvas/ellipse-perimeter',
        title: 'Fire Ellipse Perimeter Animation (4/1/2026)',
        brief: 'Canvas animation of fire ellipse being rotated around the compass.',
    },{
        route: '/canvas/bresenham',
        title: 'Bresenham Line-of-Sight (4/2/2026)',
        brief: "Interactive line-of-sight demo using Bresenham's algorithm",
    },{
        route: '/canvas/d3-geojason',
        title: 'D3 GeoJSON World Map on HTML Canvas (3/20/2026)',
        brief: 'Using D3 to project and plot GeoJSON a world map.',
    },{
        route: '/canvas/fire-front',
        title: 'Fire Front Detection Using HTML Canvas (3/20/2026)',
        brief: 'Initial attempts at fire perimeter expansion modeling.'
    },{
        route: '/canvas/geojson-to-canvas',
        title: 'GeoJSON Polygon to HTML Canvas (3/20/26)',
        brief: 'Drawing a GeoJSON ellipse on an HTML canvas.'
    },{
        route: '/canvas/grid-paths',
        title: 'Canvas Grid Line-of-Sight Paths (3/25/2026)',
        brief: 'Demo of line-of-site paths from grid central cell.',
    }]
</script>
<MenuPage {items} {title}/>

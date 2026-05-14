<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = 'SEM2006 Projects'
    let items = [{
        route: '/raster-fire-map',
        title: 'Raster Fire Map [CURRENT PROJECT] (5/14/26)',
        brief: 'Fire front expansion on a FireMap that displays onto a HTML Canvas',
    },{
        route: '/canvas',
        title: 'Canvas Fire Growth',
        brief: 'Exploring methods of using HTML Canvas element to simulate fire perimeter growth',
    },{
        route: '/geofire',
        title: 'Geographical Fire Spread (4/13/26)',
        brief: 'Exploring methods of using HTML Canvas element to simulate fire perimeter growth',
    },{
        route: '/paper',
        title: 'Paper Exploration (4/15/2026)',
        brief: 'Exploring the Paper.js package',
    },{
        route: '/geosvg',
        title: 'GeoSVG',
        brief: 'Tools to draw GeoJSON Features onto a scalable, pannable SVG.'
    },{
        route: '/fundamentals',
        title: 'Fundamentals of Wildland Fire Modeling (2/26/2026)',
        brief: 'Development from scratch of a fire behavior and growth model.'
    },{
        route: '/fire',
        title: 'Fire Behavior Projects',
        brief: 'Demos of various wildland fire behavior models',
    },{
        route: '/svg',
        title: 'SVG Classes & Utilities',
        brief: 'Demos of various SVG utility classes'
    },{
        route: '/svelte',
        title: 'Svelte Components',
        brief: 'Demos of various SVelte components',
    }]
</script>
<MenuPage {items} {title}/>
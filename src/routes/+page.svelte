<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = 'SEM2006 Projects'
    let items = [{
        route: '/canvas',
        title: 'Canvas Fire Growth',
        brief: 'Exploring methods of using HTML Canvas element to simulate fire perimeter growth',
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
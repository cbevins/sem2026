<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = 'SEM2006 SVG Classes & Utilities'
    let items = [{
        route: '/svg/pcsmapper',
        title: 'Projected Coordinate System Mapper',
        brief: 'Class and demo of creating pannable/zoomable SVG content '
        + 'based on project coordinate eastings, northings, and bearings.',
    },{
        route: '/svg/bearing',
        title: 'PCS Easting, Northing, Bearing Demo',
        brief: 'Demo and test'
    },{
        route: '/svg/normal-to-tangent',
        title: 'Fire Perimeter Point Normal-to-Tangent Demo',
        brief: 'Demo and test'
    },{
        route: '/svg/eventfulsvg',
        title: 'EventfulSvg',
        brief: 'A component responds to both (a) mouse and keyboard events on its SVG '
            + 'and (b) input controls in its parent component.',
    }]
</script>
<MenuPage {items} {title}/>
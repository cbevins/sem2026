<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = 'SEM2006 SVG Classes & Utilities'
    let items = [{
        route: '/svg/mapviewer',
        title: 'SVG Map Viewer',
        brief: 'Class for creating pannable/zoomable SVG content '
        + 'based on eastings/northings/bearings',
    },{
        route: '/svg/viewbox',
        title: 'SVG Viewbox Sandbox',
        brief: 'Fun (?) with SVG viewbox',
    },{
        route: '/svg/eventfulsvg',
        title: 'EventfulSvg',
        brief: 'A component responds to both (a) mouse and keyboard events on its SVG '
            + 'and (b) input controls in its parent component.',
    }]
</script>
<MenuPage {items} {title}/>
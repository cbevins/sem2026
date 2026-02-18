<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = 'SEM2006 SVG Classes & Utilities'
    let items = [{
        route: '/svg/eventfulsvg',
        title: 'EventfulSvg',
        brief: 'A component responds to both (a) mouse and keyboard events on its SVG '
            + 'and (b) input controls in its parent component.',
    }]
</script>
<MenuPage {items} {title}/>
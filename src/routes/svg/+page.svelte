<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = 'SEM2006 SVG Classes & Utilities'
    let items = [{
        route: '/svg/eventfulsvg',
        title: 'EventfulSvg',
        brief: 'A component responds to both (a) mouse and keyboard events on its SVG '
            + 'and (b) input controls in its parent component.',
    },{
        route: '/svg/viewport',
        title: 'ViewPort',
        brief: 'The ViewPort class supports SvgEvent by maintaining the image '
            + 'pan and zoom state  and enabling drawing in client world coordinates.'
    }]
</script>
<MenuPage {items} {title}/>
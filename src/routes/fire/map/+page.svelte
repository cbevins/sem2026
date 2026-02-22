<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    const title = 'Fire Front Mapping Demos'
    const items = [{
        route: '/fire/map/coordinates',
        title: 'Fire Mapping Coordinate Systems',
        brief: 'Explores point and angle conversions between (1) projected geographic coordinate systems '
            + 'used to display fire perimeters on the landscape and '
            + '(2) local mathematical Cartesian system as used to make fire perimeter calculations.'
    }]
</script>
<MenuPage {items} {title}/>

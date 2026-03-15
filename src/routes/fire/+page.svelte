<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    const title = 'Fire Ellipse Demos'
    const items = [{
        route: '/fire/perimeter-growth',
        title: 'Fire Perimeter Growth Demo - 3/12/26',
        brief: 'Each fire perimeter point is expanded in a direction determined by'
            + ' the midpoint of the line segment connecting the previous and next perimeter point.'
    },{
        route: '/fire/ellipse/growth2',
        title: 'Fire Growth Attempt - 2/23/26',
        brief: 'Initial attempts at fire perimeter expansion modeling.'
    },{
        route: '/fire/map',
        title: 'Fire Map (2/22/26)',
        brief: 'Yet another attempt at fire front modeling.'
    },{
        route: '/fire/ellipse/beta-theta-psi',
        title: 'Fire Ellipse Beta-Theta-Psi Perimeter',
        brief: 'A visual comparison of fire ellipse perimeter points '
            + 'derived from beta, theta, and/or psi angle increments.'
            + 'Also demonstrates use of EventfulViewport.svelte.'
    },{
        route: '/fire/ellipse/expansion',
        title: 'Fire Ellipse Expansion Explorer',
        brief: 'Initial attempts at fire perimeter expansion  modeling.'
    },{
        route: '/fire/ellipse/growth',
        title: 'Fire Ellipse Growth',
        brief: 'A visual demo if fire ellipse perimeter growth.'
    }]
</script>
<MenuPage {items} {title}/>

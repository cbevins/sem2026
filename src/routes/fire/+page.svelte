<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    const title = 'Fire Ellipse Demos'
    const items = [{
        route: '/fire/ellipse/beta-theta-psi',
        title: 'Fire Ellipse Beta-Theta-Psi Perimeter',
        brief: 'A visual comparison of fire ellipse perimeter points '
            + 'derived from beta, theta, and/or psi angle increments.'
            + 'Also demonstrates use of EventfulViewport.svelte.'
    }]
</script>
<MenuPage {items} {title}/>

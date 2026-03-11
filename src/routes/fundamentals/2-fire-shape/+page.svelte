<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = '2 - Modeling Fire Shape and Growth'
    let items = [{
        route: '/fundamentals/2-fire-shape/1-uniform-no-wind',
        title: '1 - Fire Shape Under Uniform Conditions with No-Wind, No-Slope',
        brief: 'Illustrates simplest case scenario of a point ignition fire'
         + ' expanding under uniform fuel and moisture conditions with no wind or slope.'
    },{
        route: '/fundamentals/2-fire-shape/2-huygens-growth',
        title: "2 - Apply Huygen's Principle in Fire Growth Modeling",
        brief: "Demonstrates application of Huygen's Principle to remove the "
            + "restrictions of uniform conditions."
    }]
</script>
<MenuPage {items} {title}/>
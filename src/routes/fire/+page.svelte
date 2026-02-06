<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    const title = 'Fire Ellipse Demos'
    const items = [{
        route: '/fire/ellipse/perimeter',
        title: 'Fire Ellipse Perimeter',
        brief: 'FireBehaviorMod perimeter points',
    },{
        route: '/fire/ellipse/module',
        title: 'Fire Ellipse Module Table',
        brief: 'Table of FireEllipseMod nodes',
    }]
</script>
<MenuPage {items} {title}/>

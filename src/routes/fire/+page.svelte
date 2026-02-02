<script>
    import MenuPage from "../MenuPage.svelte"
    const title = 'Fire Ellipse Demos'
    const items = [{
        route: '/fire/ellipse/perimeter',
        title: 'Fire Ellipse Perimeter',
        brief: 'FireBehaviorMod perimeter points',
    },{
        route: '/fire/ellipse/module',
        title: 'Fire Ellipse Module Table',
        brief: 'Table of FireEllipseMod nodes',
    },{
        route: '#',
        title: 'Fire Ellipse Project 3 Title',
        brief: 'Fire Ellipse Project 3 Brief',
    }]
</script>
<MenuPage {items} {title}/>

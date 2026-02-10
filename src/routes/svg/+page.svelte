<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = 'SEM2006 SVG Classes & Utilities'
    let items = [{
        route: '/svg/svgevent',
        title: 'SvgEvent',
        brief: 'SvgEvent provides an interactive SVG image that handles '
            + 'mouse and keyboard events.  Useful for zooming, panning, '
            + 'and creating specialized butons, sliders, etc.'
    },{
        route: '/svg/svgscope',
        title: 'SvgScope (Deprecated)',
        brief: 'SvgScope is my original attempt at a Svelte component '
            + 'that enables zooming and panning of SVG images.'
    },{
        route: '/svg/viewport',
        title: 'ViewPort',
        brief: 'ViewPort uses SvgEvent to interactively pan and zoom its image '
            + 'in its native world coordinates.'
    }]
</script>
<MenuPage {items} {title}/>
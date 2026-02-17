<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = 'SEM2006 SVG Classes & Utilities'
    let items = [{
        route: '/svg/eventfulsvg',
        title: 'EventfulSvg',
        brief: 'A component responds to both (a) mouse and keyboard events on its SVG '
            + 'and (b) input controls in its parent component.',
    },{
        route: '/svg/svgevent',
        title: 'SvgEvent',
        brief: 'The SvgEvent Svelte component provides an interactive SVG image '
            + 'that passes mouse and keyboard events onto a drawing client. '
            + 'Useful for zooming and panning around SVG images (see Viewport), '
            + 'and for creating specialized controls such as buttons, sliders, etc.'
    },{
        route: '/svg/viewport',
        title: 'ViewPort',
        brief: 'The ViewPort class supports SvgEvent by maintaining the image '
            + 'pan and zoom state  and enabling drawing in client world coordinates.'
    },{
        route: '/svg/svgscope',
        title: 'SvgScope (Deprecated)',
        brief: 'SvgScope is my original attempt at a Svelte component '
            + 'that enables zooming and panning of SVG images.'
    }]
</script>
<MenuPage {items} {title}/>
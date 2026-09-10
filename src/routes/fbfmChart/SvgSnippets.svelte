<!-- SVG element snippets -->
<!-- IMPORTANT! Must delcare script as a *module* -->
<script module>
    export { svgText }
</script>

{#snippet svgText({str='',
    clipPath='none',        // 'none' | Container element layout references via URI syntax (e.g., url(#clip-id)).
    direction='ltr',        // 'ltr' | 'rtl'
    display='inline',       // 'inline' | 'block' | 'none' | Other standard layout display tokens.
    dominantBaseline='central',// 'auto' | 'use-script' | 'no-change' | 'reset-size' |
                            // 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical' |
                            // 'central' | 'middle' | 'text-after-edge' | 'text-before-edge'
    fill='black',           // 'none' | Hex codes (#ffffff), RGB/RGBA, color names (red),
                            // url(#gradient-id), or currentColor
    fillOpacity=1,          // Any fractional number between 0.0 (fully transparent)
                            // and 1.0 (fully opaque), or percentages.
    filter='none',          // 'none' | Filter element layout references via URI syntax (e.g., url(#blur-filter)).
    fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize=16,            // any explicit length (e.g., 12px, 2em), or a percentage.
                            // Absolute keywords (xx-small, x-small, small, medium, large, x-large, xx-large),
                            // relative keywords (smaller, larger),
    fontStretch='normal',   // normal, ultra-condensed, extra-condensed, condensed, semi-condensed,
                            // semi-expanded, expanded, extra-expanded, ultra-expanded
    fontStyle='normal',     // 'normal', 'italic', 'oblique'
    fontVariant='normal',   // normal, small-caps
    fontWeight='light',     // normal (=400) | bold | bolder | lighter |
                            //  or numeric values (100, 200, 300, 400, 500, 600, 700, 800, 900).
    lengthAdjust='spacing', // 'spacing', 'spacingAndGlyphs'
    letterSpacing='normal', // normal or any explicit layout length value (e.g., 2px, 0.5em).
    mask='none',            // 'none' | Mask element layout references via URI syntax (e.g., url(#mask-id)).
    opacity=1,              // any fractional number between 0.0 and 1.0, or percentages.
    rotate=0,               // a single angle in degrees (e.g., 45), or a space-separated list of angles applied to individual characters.
    stroke='black',         // hex codes, RGB/RGBA, color names, none, url(#gradient-id), or currentColor.
    strokeDasharray='none', // 'none' | A comma or space-separated list of lengths/percentages defining dash/gap patterns (e.g., 5,5).strokeLinecap='butt',   // 'butt' | 'round' | 'square'
    strokeDashoffset=0 ,    // Any explicit valid length value or percentage.strokeLinejoin='miter', // 'miter' | 'round' | 'bevel'
    strokeWidth=1,          // any positive explicit length value or percentage.
    textAnchor="start",     // 'start' | 'middle' | 'end'
    textLength='auto',      // 'auto' | any valid length or %
    textRendering='auto',   // 'auto' | 'optimizeSpeed' | 'optimizeLegibility' |
                            // 'geometricPrecision'
    transform='',           // '' or fFunctional transformation listings
                            // (translate(x, y), scale(x, y), rotate(angle), skewX(angle), skewY(angle), matrix()).
    visibility='visible',   // visible | hidden | collapse
    wordSpacing='normal',   // normal or any explicit layout length value (e.g., 2px, 0.5em).
    writingMode='horizontal-tb', // horizontal-tb | vertical-rl | vertical-lr
    x=0,                    // any valid coordinate length or percentage, eg 10, 50%
    y=0,                    // any valid coordinate length or percentage, eg 10, 50%
})}
    <text
        clip-path={clipPath}
        direction={direction}
        display={display}
        dominant-baseline={dominantBaseline}
        fill={fill}
        fill-opacity={fillOpacity}
        filter={filter}
        font-family={fontFamily}
        font-size={fontSize}
        font-stretch={fontStretch}
        font-style={fontStyle}
        font-variant={fontVariant}
        font-weight={fontWeight}
        length-adjust={lengthAdjust}
        letter-spacing={letterSpacing}
        mask={mask}
        opacity={opacity}
        rotate={rotate}
        stroke={stroke}
        stroke-dasharray={strokeDasharray}
        stroke-dashoffset={strokeDashoffset}
        stroke-width={strokeWidth}
        text-anchor={textAnchor}
        text-length={textLength}
        text-rendering={textRendering}
        transform={transform}
        visibility={visibility}
        word-spacing={wordSpacing}
        writing-mode={writingMode}
        x={x}
        y={y}
    >{str}</text>
{/snippet}

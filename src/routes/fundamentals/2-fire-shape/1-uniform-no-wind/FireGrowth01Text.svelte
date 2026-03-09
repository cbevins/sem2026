<script>
    import {P} from '$lib/index.js'
    let {children} = $props()
</script>

    <div class='h-48 mt-2 px-2 py-2 overflow-auto border rounded'>
        <P>
        The primary purposes of a wildland fire gowth model are to
        <ul class="list-disc list-inside">
            <li>predict the fire perimeter location at some point in the future, and</li>
            <li>forecast when the fire perimeter will likely arrive at one or more
                points-of-interest, such as buildings and roads.</li>
        </ul>
        </P><P>
        Secondarily, it would also be good to know the fire intensity (and therefore, flame length)
        along the perimeter to better understand possible control issues and fire effects.
        </P><P>
        Ultimately, our fire growth model will have to deal with:
        <ul class="list-disc list-inside">
            <li>spatial variability of fuel type, load, particle size, and packing density;</li>
            <li>spatial and temporal variability of fuel moisture content;</li>
            <li>spatial variability of terrain aspect and steepness;</li>
            <li>spatial and temporal variability of wind speed and direction; and</li>
            <li>an initial known (observed) perimeter that is irregularly-shaped and often convex.</li>
        </ul>
        </P><P>
            But, for our first wildland fire model, lets start out as simply as possible...
        </P><P>
            Envision a large, perfectly level field supporting a tall crop
            of fully-cured annual grasses of the same species and height.
            There is absolutely no wind blowing when you drop a lighted match
            at the center of the field, and a fire springs to life.
        </P><P>
            Over the next few minutes, what shape do you think the resulting fire will assume?
        </P><P>
            Indeed, it is intuitively evident the resulting fire will assume a circular shape
            as long as the prevailing conditions hold.
        </P><P>
            Modeling the growth of a point-ignition, circular fire on a landscape over time is quite simple.
            We only require
            (1) a known ignition point,
            (2) an observed fire spread rate, and
            (3) an elapsed time since ignition
            to fully determine
            (1) every point of its perimeter at any time, and
            (2) when the perimeter will arrive at any point of interest on the landscape.
            In fact, with minor enhancements, this model could simulate diurnal changes
            in humidity and fine fuel moisture by varying the spread rate over a 24 hour period.
        </P><P>
            Thus, while quite simple, our version 0.01 model meets all our primary requirements,
            <i>as long as we have a single point ignition</i>.
            determine (1) each point on its perimeter at any time, and
            (2) when the perimeter arrives at any point on the landscape.
            With minor enhancement,
        </P>
    </div>

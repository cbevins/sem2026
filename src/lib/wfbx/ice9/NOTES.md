# Purpose and Objectives of Fire Behavior Modeling

If we can observe/measure the spread rate, bearing, flame length, and length-to-width ratio of an ongoing fire, we can estimate its size, position, and intensity at some future time.  We can also estimate some of its effects such as scorch height, tree mortality, smoke emissions, etc.

For planning, training, and risk analysis, we need models to predict (rather than observe) fire spread rate, bearing, flame length, and length-to-width ratio.

Note 1 - The ObservedFire and SurfaceFire modules provide the spread rate, bearing, fireline intensity, flame length, and midflame (or effective) wind speed necessary to derive FireShape.
We can then examine various FireVectors from the FireShape to determine their spread rate, fireline intensity, flame length, distance, position, scorch height, and tree mortality.

Note 2 - Air temperature and scorch height are applied ONLY to FireVectors.

                  ObservedFire              SurfaceFire
                        |                       |
                        +----------/OR/---------+
                                    |
                                    V 
                                FireShape
                                    |
                                    V
                                FireSize <--------- Elapsed time, Ignition point
                                    |
                                    V
                                Fire Vectors <----- Angle from head
                                    |
                                    V
                                Fire Effects <----- Air tempertaure, Midflame wind speed

# Fire Model Sensitivity to 10-h and 100-h Fuel Moisture

Assume that the best precision we have for 1-h fuel moistures is 1% of ovendry weight.
- For each fuel model, what is the change in moisture damping coefficient for a 1-percentage point change in 1-h fuel moisture (i.e., from 1 to 2, or from 10 to 11, or from mext-1 to mext)
- How much change is required in 10-h fuel moisture to cause the same change in moisture damping?
- How much change is required in 100-h fuel moisture to cause the same change in moisture damping?

Use those changes as cetageory sizes.

Generate a table of size class weighting factors for each fuel model.
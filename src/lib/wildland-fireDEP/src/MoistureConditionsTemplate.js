/**
 * Plain-old Data object the defines the moisture contents for each fuel particle
 * dead and live moisture classes.
 */
export const MoistureConditionsTemplate = {
    dead1h: 0.05,   // dead 1-h time-lag fuel particle moisture content (lb water / lb ovendry weight)
    dead10h: 0.07,  // dead 10-h time-lag fuel particle moisture content (lb water / lb ovendry weight)
    dead100h: 0.09, // dead 100-h time-lag fuel particle moisture content (lb water / lb ovendry weight)
    herb: 0.5,      // live herb fuel particle moisture content (lb water / lb ovendry weight)
    stem: 1.5       // live stem fuel particle moisture content (lb water / lb ovendry weight)
}

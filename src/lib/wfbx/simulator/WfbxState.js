export const WfbxState = {
    deadMoisture: {
        category: 0.1,
        dead1h: 0.05,
        dead10h: 0.07,
        dead100h: 0.09,
    },
    liveMoisture: {
        category: 3,
        curable: 3,
        herb: 0.5,
        stem: 1.5,
    },
    midflame: {
        windSpeed: 880,
        wsrf: 1,
    },
    observedFireBehavior: {
        head: {
            spreadRate: 1,
            bearing: 0,
            flameLength: 0,
            firelineIntensity: 0,
        },
        lengthWidthRatio: 1,
    },
    slope: {
        direction: {
            aspect: 180,
            upslope: 0,
        },
        map: {
            contoursCrossed: 2.5,
            contourInterval: 100,
            distance: 1000,
            scale: 24000,
        },
        steepness: {
            degrees: 0,
            ratio: 0,
        }
    },
    surface1: {
        curedHerb: 0,
        fuelKey: 10,
        fireBehavior: {
            head: {
                spreadRate: 1,
                bearing: 0,
                flameLength: 0,
                firelineIntensity: 0,
            },
        },
    },
    surface2: {
        curedHerb: 0,
        fuelKey: 124,
        fireBehavior: {
            head: {
                spreadRate: 1,
                bearing: 0,
                flameLength: 0,
                firelineIntensity: 0,
            },
        },
    },
    // Following is either a reference to surface1 or derived from surface1 and surface2
    surfaceFire: {
        fireBehavior: {
            head: {
                spreadRate: 1,
                bearing: 0,
                flameLength: 0,
                firelineIntensity: 0,
            },
        },
    },
    wind: {
        direction: {
            bearingDegrees: 90,
            sourceCompass: 'W',
            sourceDegrees: 270,
        },
        speed: {
            at10m: 0,
            at20ft: 0,
        },
    },
    fireShape: {
        source: null,  // either surfaceFire.fireBehavior or observedFireBehavior
    },
    fireSize: {
        elapsedTime: 1,
    }
}

export function makeActiveCrownFire(crownFireBehavior, surfaceFireBehavior,
        canopyFuels, windSpeed20ft, propsLevel=0) {

    // Rothermel's crown fire spread rate (ft/min)
    const activeRos = 3.34 * crownFireBehavior.headingSpreadRate

    // Active crown fire heat per unit area is the sum of the surface fire HPUA
    // and the entire active canopy HPUA (i.e., canopy load * canopy heat content),
    // and IS NOT the fuel model 10 HPUA.
    const activeHpua = canopyFuels.canopyHeatPerUnitArea + surfaceFireBehavior.heatPerUnitArea

    // Crown fire fireline intensity (Btu/ft/s)
    const activeFli = activeHpua * (activeRos / 60)

    // Crown fire flame length using Thomas (1963)
    const activeFlame = activeFli <= 0 ? 0 : 0.2 * Math.pow(activeFli, 2 / 3)

    // Rothermel's power-of-the-fire (ft-lb/ft2/s)
    const firePower = activeFli / 129

    // Rothermel's power-of-the-wind (ft-lb/ft2/s)
    const diff = Math.max(0, (windSpeed20ft - activeRos) / 60) // Difference must be in ft/s
    const windPower = 0.00106 * diff * diff * diff

    const powerRatio = (windPower>0) ? (firePower / windPower) : 0

    let pod = {
        activeSpreadRate: activeRos,
        activeFirelineIntensity: activeFli,
        activeFlameLength: activeFlame,
        activeHeatPerUnitArea: activeHpua,
    }
    if (propsLevel>0) {
        pod = {...pod,
            isPlumeDominated: powerRatio >= 1,
            isWindDriven: powerRatio < 1,
        }
    }
    if (propsLevel>1) {
        pod = {...pod,
            powerOfTheFire: firePower,
            powerOfTheWind: windPower,
            fireWindPowerRatio: powerRatio
        }

    }
    return pod
}


export class FireBehavior {
    constructor(fireBed, windSlopeConditions={}, config={}) {
        // Default parameters
        this.config = {applySpreadRateLimit: true}
        this.windSlopeConditions =
            {midflameWindSpeed: 880, midflameWindBearing: 90,
            aspect: 180, slopeRatio: 0.5, airTemp: 77}
        this.setWindSlopeConditions(fireBed, windSlopeConditions)
    }

    setWindSlopeConditions(fireBed, windSlopeConditions) {
        // inputs
        this.windSlopeConditions = {...this.windSlopeConditions, windSlopeConditions}
        this.noWindSpreadRate = fireBed.noWindSpreadRate
        this.reactionIntensity = fireBed.reactionIntensity
        // primary outputs
        this.spreadRate = 0
        this.bearing = 0
        this.lengthWidthRatio = 1
        this.firelineIntensity = 0
        this.flameLength = 0
        this.scorchHeight = 0
        this.heatPerUnitArea = 0
        // secondary outputs
        this.effectiveWindSpeed = 0
        this.headAngleFromUpslope = 0
        return this
    }
}

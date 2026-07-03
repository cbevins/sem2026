/**
 * WfsBuilder builds an execution instruction stack from a configuration.
 */
import { WfsConfigs } from './WfsConfigs.js'

export class WfsBuilder {
    constructor() {
        // client input
        this.configs = WfsConfigs
        this.inputValues = {}
        this.callback = null
        // outputs
        this.stack = new Set()
        this.inputProps = []
        this.methods = []
        this.state = {}
        // internal
        this.stackIds = []
    }
    
    build(configs) {
        this.stack = new Set()
        this.configs = configs
        if (this.configs.surfaceModule === 'active')
            this.addSurfaceModule()
        // if (this.configs.crownModule === 'active')
        //     this.addCrownModule()
        // if (this.configs.sizeModule === 'active')
        //     this.addSizeModule()
    }

    //-------------------------------------------------------------------
    // Private
    //-------------------------------------------------------------------

    push(prop) {
        const key = `get ${prop}`
        if (!this.stack.has(key)) {
            this.stack.add(key)
            this.stackIds.push([prop, this.stack.size-1])
        }
    }

    pop(tag) {
        for (let i=this.stackIds.length-1; i>=0; i--) {
            const [prop, id] = this.stackIds.pop()
            this.stack.add(`next ${prop} ${id}`)
            if (prop === tag)
                break
        }
    }

    set(method) {
        this.stack.add(`call ${method}`)
    }

    store(tag) {
        this.stack.add(`store ${tag}`)
    }

    //-------------------------------------------------------------------

    addSurfaceModule() {
        if (this.configs.surfaceModule === 'active') {
            this.set('fuelCatalog')
            this.set('fuelCuringClasses')
            this.set('fuelMoistureClasses')
            
            if (this.configs.surfaceCrownModule === 'active') {
                this.set('surfaceCrownFuelModel')
                this.set('surfaceCrownFuelBed')
            }

            // Fuel models
            this.push('fuelKey1')
            this.set('surfaceFuel1FuelModel')
            if (this.configs.fuelModels === 'two') {
                this.push('fuelKey2')
                this.set('surfaceFuel2FuelModel')
            }
            
            // Fuel curing
            if (this.configs.fuelCuring === 'estimated') {
                this.addLiveFuelMoisture()
                this.set('fuelCuringFromMoisture')
            } else {
                this.push('curedHerb')
                this.push('curedCheatgrass')
                this.set('fuelCuringFromInput')
            }

            // Fuel bed
            this.set('surfaceFuel1FuelBed')
            if (this.configs.fuelModels === 'two') {
                this.set('surfaceFuel2FuelBed')
            }

            // Fuel moistures
            this.addLiveFuelMoisture()
            this.addDeadFuelMoisture()

            // Fuel ignition
            this.set('surfaceFuel1FuelIgnition')
            if (this.configs.fuelModels === 'two') {
                this.set('surfaceFuel2FuelIgnition')
            }
            if (this.configs.surfaceCrownModule === 'active') {
                this.set('crownFuelIgnition')
            }

            // Wind, slope
            this.addWindDirection()
            this.addSlopeDirection()
            this.addSlopeSteepness()
            this.addMidflameWindSpeed()

            // Fire behavior
            this.set('surfaceFuel1FireBehavior')
            if (this.configs.fuelModels === 'two') {
                this.set('surfaceFuel2FireBehavior')
                this.push('fuel1Cover')
                this.push('fuelWeightingMethod')
                this.set('weightedFireBehavior')
            } else {
                this.set('unweightedFireBehavior')
            }
            if (this.configs.surfaceCrownModule === 'active') {
                this.set('crownFireBehavior')
            }

            if (this.configs.surfaceSizeModule === 'active') {
                this.push('ignEast')
                this.push('ignNorth')
                this.push('elapsedTime')
                this.set('surfaceFireSize')

                if(this.configs.surfaceVectorHeadModule === 'active')
                    this.set('fireVectorHead')
                if(this.configs.surfaceVectorBackModule === 'active')
                    this.set('fireVectorBack')
                if(this.configs.surfaceVectorRightModule === 'active')
                    this.set('fireVectorRight')
                if(this.configs.surfaceVectorLeftModule === 'active')
                    this.set('fireVectorLeft')
                if(this.configs.surfaceVectorBetaModule === 'active') {
                    this.push('angleFromHead')
                    this.set('fireVectorBeta')
                }
                if(this.configs.surfaceVectorBeta6Module === 'active'
                || this.configs.surfaceVectorBeta6Module === 'active'
                || this.configs.surfaceVectorBeta6Module === 'active') {
                    this.push('angleFromHead')
                    if(this.configs.surfaceVectorBeta6Module === 'active')
                        this.set('fireVectorBeta6')
                    if(this.configs.surfaceVectorPsiModule === 'active')
                        this.set('fireVectorPsi')
                    if(this.configs.surfaceVectorThetaModule === 'active')
                        this.set('fireVectorTheta')
                    
                    this.store('fireVectors')
                    this.pop('angleFromHead')
                }
            }

            this.store('surface')

            // Add next up through the named this.push()
            this.pop('fuelKey1')
        }
    }

    addCanopy() {
        this.push('canopyHeight')
        this.push('canopyBase')
        this.push('canopyCover')
        this.set('canopyFromHeightBase')
    }

    addDeadFuelMoisture() {
        if (this.configs.moistureDeadFuelsInput === 'particles') {
            this.push('moistureDead1h')
            this.push('moistureDead10h')
            this.push('moistureDead100h')
            this.set('moistureDeadFuelsFromParticle')
        } else {
            this.push('moistureDeadCategory')
            this.set('moistureDeadFuelsFromCategory')
        }
    }

    addLiveFuelMoisture() {
        if (this.configs.moistureLiveFuelsInput === 'particles') {
            this.push('moistureLiveStem')
            this.push('moistureLiveHerb')
            this.set('moistureLiveFuelsFromParticles')
        } else {
            this.push('moistureLiveCategory')
            this.set('moistureLiveFuelsFromCategory')
        }
    }

    addMidflameWindSpeed() {
        if (this.configs.midflameWindSpeedInput === 'input') {
            this.push('midflameWindSpeed')
        } else {
            this.addWindSpeed()
            if(this.configs.midflameWsrfInput === 'input') {
                this.push('midflameWsrf')
                this.set('midflameWindSpeedFromWsrf')
            } else {
                this.push('fuelKey1')
                this.set('surfaceFuel1FuelModel')
                this.addCanopy()
                this.set('midflameWsrf')
            }
        }
    }

    addSlopeDirection() {
        if (this.configs.slopeDirectionInput === 'aspect') {
            this.push('slopeAspect')
            this.set('slopeDirectionFromAspect')
        } else if (this.configs.slopeDirectionInput === 'upslope') {
            this.push('slopeUpslope')
            this.set('slopeDirectionFromUpslope')
        }
    }

    addSlopeSteepness() {
        if (this.configs.slopeSteepnessInput === 'degrees') {
            this.push('slopeDegrees')
            this.set('slopeSteepnessFromDegrees')
        } else if (this.configs.slopeSteepnessInput === 'ratio') {
            this.push('slopeRatio')
            this.set('slopeSteepnessFromRatio')
        } else if (this.configs.slopeSteepnessInput === 'map') {
            this.push('mapScale')
            this.push('mapContourInterval')
            this.push('mapContoursCrossed')
            this.push('mapDistance')
            this.set('slopeSteepnessFromMap')
        }
    }

    addWindDirection() {
        if (this.configs.windDirectionInput === 'bearing') {
            this.push('windBearingDegrees')
            this.set('windDirectionByBearingDegrees')
        } else if (this.configs.windDirectionInput === 'source') {
            this.push('windSourceDegrees')
            this.set('windDirectionBySourcegDegrees')
        } else if (this.configs.windDirectionInput === 'compass') {
            this.push('windBearingCompass')
            this.set('windDirectionByBearingCompass')
        }
    }

    addWindSpeed() {
        if (this.configs.windSpeedInput === '10m') {
            this.push('windSpeed10m')
            this.set('windSpeedAt10m')
        } else if (this.configs.windSpeedInput === '20ft') {
            this.push('windSpeed20ft')
            this.set('windSpeedAt20ft')
        }
    }
}

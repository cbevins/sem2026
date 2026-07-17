export class WfbxRunner {
  constructor(config) {
    this.config = config
    // Also contains fuelCuringClasses, deadMoistureClasses, liveMoistureClasses
    this.fuelCatalog = new FuelCatalog()
    this.state = new State()
  }
  
  run(input) {
    this.input = input
    this.processFuelModelInput()
  }
  processFuelModelInput() {
    for(let fuelKeyOne of this.input.fuelKeyOne) {
      this.fuelOne.key = fuelKeyOne
      this.updateFuelModelOne()
      for(let fuelKeyTwo of this.input.fuelKeyTwo) {
          this.fuelKeyTwo = fuelKeyTwo
          this.updateFuelModelTwo()
          processFuelCuringInput()
      }
    }
  }
  processFuelCuringInput() {
    const fuelCuringFrom = this.config.fuelCuringFrom
    if (fuelCuringFrom === 'input') {
        for (let curedHerb of this.input.curedHerb) {
          this.fuelCuring.curedHerb = curedHerb
          this.updateFuelModelOne()
          this.updateFuelModelTwo()
          this.processFuelMoistureInput()
        }
    } else if (fuelCuringFrom === 'liveHerbMoisture') {
      if(this.config.liveFuelMoistureFrom === 'category') {
        for(let moistureLiveCategory of this.input.moistureLiveCategory) {
          this.liveFuelMoisture.category = moistureLiveCategory
          this.liveCategoryMoistureHasBeenInput = true
          this.updateLiveFuelMoistureFromCategory()
          this.updateFuelCuringFromLiveHerbMoisture()
          this.updateFuelBedOne()
          this.updateFuelBedTwo()
          this.processFuelMoistureInput()
        }
      } else {
        for(let moistureLiveHerb of this.input.moistureLiveHerb) {
          this.liveFuelMoisture.herb = moistureLiveHerb
          this.liveHerbMoistureHasBeenInput = true
          this.updateFuelCuringFromLiveHerbMoisture()
          this.updateFuelBedOne()
          this.updateFuelBedTwo()
          this.processFuelMoistureInput()
        }
      }
  }

  processFuelMoistureInput() {
      if ()
  }
  run(input) {
    makeCrownFuelBed(state)
    for(let fuelKeyOne of input.fuelKeyOne) {
      makeFuelModelOne(state, fuelKeyOne)
      for(let fuelKeyTwo of input.fuelKeyOne) {
        makeFuelModelTwo(state, fuelKeyTwo)
        for (let fuelCuringCuredHerb of input.fuelCuringCuredHerb) {
          for (let fuelCuringCuredCheatgrass of input.fuelCuringCuredCheatgrass) {
            makeFuelBedsFromFuelModelsAndCuring(state)
            for (let fuelMoistureLiveStem of input.fuelMoistureLiveStem) {
              for (let fuelMoistureLiveHerb of input.fuelMoistureLiveHerb) {
                for (let fuelMoistureDead100h of input.fuelMoistureDead100h) {
                  for (let fuelMoistureDead10h of input.fuelMoistureDead10h) {
                    for (let fuelMoistureDead1h of input.fuelMoistureDead1h) {
                      makeFuelIgnitionsFromFuelMoisture(state)
                      makeActiveCrownFireFuelIgnition(state)
                      for (let slopeDirectionFromAspect of input.slopeDirectionFromAspect) {
                        updateSlopeDirectionFromAspect(state)
                        for (let windDirectionFromBearingDegrees of input.windDirectionFromBearingDegrees) {
                          updateWindDirectionFromBearingDegrees(state)
                          for (let slopeSteepnessFromRatio of input.slopeSteepnessFromRatio) {
                            updateSlopeSteepnessFromRatio(state)
                            for (let midflameWindSpeed of input.midflameWindSpeed) {
                              makeFireBehavior(state)
                              makeActiveCrownFireBehavior(state)
                              for (let windSpeedFrom20ft of input.windSpeedFrom20ft) {
                                updateWindSpeedFrom20ft(state)
                              } // next windSpeedFrom20ft 
                            } // next midflameWindSpeed 
                          } // next slopeSteepnessFromRatio 
                        } // next windDirectionFromBearingDegrees 
                      } // next slopeDirectionFromAspect 
                    } // next fuelMoistureDead1h 
                  } // next fuelMoistureDead10h 
                } // next fuelMoistureDead100h
              } // next fuelMoistureLiveHerb
            } // next fuelMoistureLiveStem
          } // next fuelCuringCuredCheatgrass
        } // next fuelCuringCuredHerb
      } // next fuelKeyOne

import { StandardFuelModelCatalog } from "./StandardFuelModelCatalog.js"
import { FuelBed } from "./FuelBed.js"

// 1 - Instantiate a fire behavior fuel model catalog
const catalog = new StandardFuelModelCatalog()

// 2 - select a fuel model
const fuelModel = catalog.get('gr4')

// 2 - Create a fuel bed with a cured live fuel fraction
const fuelBed = new FuelBed({fuelModel, })

export const ExpectedFuelBed010 = {
    depth: 1,
    liveMextFactor: 6.908948234294801,
    ovendryLoad: 0.552,
    packingRatio: 0.01725,
    packingRatioOpt: 0.0073478593798598172,
    packingRatioFraction: 2.3476224990480286,
    propagatingFluxRatio: 0.048317062998571636,
    reactionVelocityExp: 0.35878365060452616,
    reactionVelocityMax: 15.13331887756658,
    reactionVelocityOpt: 12.674359628667819,
    savr: 1764.3319812126388,
    savr15: 74108.915800396862,
    surfaceArea: 13.4665,
    dead: {
        fineFuelLoad: 0.15704963842638839,
        heat: 8000,
        // heatSouce: 0,
        mext: 0.25,
        mineralDamping: 0.41739692790939131,
        netLoad: 0.13859233668341708,
        ovendryLoad: 0.46,
        reactionIntensityDry: 5539.9575948899355,   // currently is 18387.6
        savr: 1888.8602386934672,
        surfaceArea: 9.154,
        // volume: 0
    },
    live: {
        heat: 8000,
        // heatSouce: 0,
        mineralDamping: 0.41739692790939131,
        netLoad: (1 - 0.0555) * 0.092,
        ovendryLoad: 0.092,
        reactionIntensityDry: 3677.5200629895871,
        savr: 1500,
        // volume: 0
    }
}
export const ExpectedFireBed010 = {
    heatSink: 412.34037227937284,
    // heatSource: 0,
    heatPreIgn: 746.993428042342,
    reactionIntensity: 5794.6954002291168,
    noWindSpreadRate: 0.67900860922904482,
    dead: {
        fineFuelMoisture: 0.05389207884883955,
        fineWaterLoad: 0.008463731497256665,
        // heatPreIgn: 0,
        moisture: 0.051626884422110553,
        moistureDamping: 0.65206408989980214,
        reactionIntensity: 3612.4074071954024,
        // reactionIntensityDry: 5539.9575948899355,
    },
    live: {
        moistureDamping: 0.59341294014849078,
        mext: 5.1935979022741359,
        reactionIntensity: 2182.287993033714,
    }
}
//---------------------------------------------
export const Expected010 = {
    heatSink: 412.34037227937284,
    // liveMextFactor: 6.908948234294801,
    qig: 746.993428042342,
    reactionIntensity: 5794.6954002291168,
    ros0: 0.67900860922904482,
    dead: {
        fineMois: 0.05389207884883955,
        fineWaterLoad: 0.008463731497256665,
        mois: 0.051626884422110553,
        moistureDamping: 0.65206408989980214,
        reactionIntensity: 3612.4074071954024,
        // reactionIntensityDry: 5539.9575948899355,
    },
    live: {
        effMineral: 0.01,
        moistureDamping: 0.59341294014849078,
        mext: 5.1935979022741359,
        reactionIntensity: 2182.287993033714,
        // reactionIntensityDry: 3677.5200629895871,
    }
}

export const Expected124 = {
    heatSink: 319.21640437931171,
    liveMextFactor: 2.1558023634049093,
    packingRatio: 0.0087454632909178334,
    packingRatioOpt: 0.0078357185983373434,
    packingRatioRatio: 1.11610226696675,
    propagatingFluxRatio: 0.035258653482453904,
    qig: 319.21640437931171 / 0.27985482530937067,
    reactionIntensity: 12976.692888496578,
    reactionVelocityExp:  0.38177694461561407,
    reactionVelocityMax: 14.944549319976806,
    reactionVelocityOpt: 14.908876941781589,
    ros0: 1.4333245773924823,
    savr: 1631.1287341340956,
    surfaceArea: 29.062930440771346,
    dead: {
        fineMois: 0.050405399380187531,
        fineWaterLoad: 0.0098866289779641001,
        mineralDamping: 0.41739692790939131,
        mois: 0.050100676116867547,
        moistureDamping: 0.74884711762612932,
        netLoad: (1 - 0.0555) * 0.20777819078484744,
        reactionIntensity: 7316.0935560142625,
        reactionIntensityDry: 9769.8093293148086,
        savr: 1682.0151742581315,
        surfaceArea: 11.030790863177224,
    },
    live: {
        effMineral: 0.01,
        mext: 1.6581421656244677,
        mineralDamping: 0.41739692790939131,
        moistureDamping: 0.33380976126895767,
        netLoad: (1 - 0.0555) * 0.36064279155188239,
        reactionIntensity: 5660.5993324823157,
        reactionIntensityDry: 16957.560830348066,
        savr: 1600,
    }
}

export const ExpectedFuelBed124 = {
    depth: 2.1,
    savr: 1631.1287341340956,
    surfaceArea: 29.062930440771346,
    dead: {
        surfaceArea: 11.030790863177224,
        savr: 1682.0151742581315,
        // netLoad: (1 - 0.0555) * 0.20777819078484744,
    },
    live: {
        savr: 1600,
        // netLoad: (1 - 0.0555) * 0.36064279155188239,
    }
}

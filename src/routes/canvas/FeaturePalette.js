
export const DefaultFeaturePalette = [
    {code: 0, label: 'grass', burnable: true, rgba: [
        [  0, 255,   0, 255], // unburned
        [255,   0,   0, 255], // burning
        [150,  75,   0, 255], // burned,
        [  0, 255,   0, 255]] // unburnable
    },
    {code: 1, label: 'water', burnable: false, rgba: [
        [  0,   0, 255, 255], // unburned
        [  0,   0, 255, 255], // burning
        [  0,   0, 255, 255], // burned
        [  0,   0, 255, 255]] // unburnable
    }
]

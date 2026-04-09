export const RayCastFeaturePalette = [
    {code: 0, label: 'water', burnable: false, rgba: [
        [  0,   0, 255, 255], // unburned
        [  0,   0, 255, 255], // burning
        [  0,   0, 255, 255], // burned
        [  0,   0, 255, 255]] // unburnable
    },
    {code: 1, label: 'grass', burnable: true, rgba: [
        [124, 252,   0, 255], // unburned 'grass green'
        [255,   0,   0, 255], // burning
        [150,  75,   0, 255], // burned,
        [  0, 255,   0, 255]] // unburnable
    },
    {code: 2, label: 'timber', burnable: true, rgba: [
        [ 34, 139,  34, 255], // unburned 'forest green'
        [255,   0,   0, 255], // burning
        [150,  75,   0, 255], // burned,
        [  0, 255,   0, 255]] // unburnable
    },
    {code: 3, label: 'shrub', burnable: true, rgba: [
        [138, 154,  91, 255], // unburned 'sage green'
        [255,   0,   0, 255], // burning
        [150,  75,   0, 255], // burned,
        [  0, 255,   0, 255]] // unburnable
    },
    {code: 4, label: 'cheat grass', burnable: true, rgba: [
        [201, 204,  63, 255], // unburned 'pear'
        [255,   0,   0, 255], // burning
        [150,  75,   0, 255], // burned,
        [  0, 255,   0, 255]] // unburnable
    },
]

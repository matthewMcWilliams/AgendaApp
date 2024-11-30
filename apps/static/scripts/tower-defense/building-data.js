import Button from './Button.js'

export default [
    {
        name: 'Thorny',
        cost: 4,
        color: 'blue',
        button: new Button(1, 2, 3, 4, 'blue'),
        index: 0,
        range: 3,

        upgradePath: [
            {
                option1: {
                    message: '6: Increase Damage',
                    feature: 'damage',
                    value: 7,
                    cost: 6
                },
                option2: {
                    message: '4: Increase Range',
                    feature: 'range',
                    value: 4,
                    cost: 4
                }
            },
            {
                option1: {
                    message: '8: Add Splash Damage (50%)',
                    feature: 'splash',
                    value: 1.5,
                    cost: 8
                },
                option2: {
                    message: '7: Reduce Cooldown',
                    feature: 'cooldown',
                    value: 0.8,
                    cost: 7
                }
            },
            {
                option1: {
                    message: '12: Gain Thorn Barrage Ability',
                    feature: 'ability',
                    value: 'Thorn Barrage',
                    cost: 12
                },
                option2: {
                    message: '12: Triple Damage vs Lead Balloons',
                    feature: 'damageMultiplier',
                    value: 3,
                    cost: 12
                }
            }
        ]
    },
    {
        name: 'Magnified Laser',
        cost: 6,
        color: 'red',
        button: new Button(1, 2, 3, 4, 'red'),
        index: 1,
        range: 5,

        upgradePath: [
            {
                option1: {
                    message: '5: Increase Damage',
                    feature: 'damage',
                    value: 0.8,
                    cost: 5
                },
                option2: {
                    message: '5: Reduce Cooldown',
                    feature: 'cooldown',
                    value: 0.15,
                    cost: 5
                }
            },
            {
                option1: {
                    message: '6: Increase Range',
                    feature: 'range',
                    value: 6,
                    cost: 6
                },
                option2: {
                    message: '8: Add Burning Effect (1 dmg/s for 2s)',
                    feature: 'burning',
                    value: 1,
                    cost: 8
                }
            },
            {
                option1: {
                    message: '12: Gain Overcharge Ability (Triple Speed)',
                    feature: 'ability',
                    value: 'Overcharge',
                    cost: 12
                },
                option2: {
                    message: '10: Double Damage vs Fast Balloons',
                    feature: 'damageMultiplier',
                    value: 2,
                    cost: 10
                }
            }
        ]
    },
    {
        name: 'Railgun',
        cost: 10,
        color: 'grey',
        button: new Button(1, 2, 3, 4, 'grey'),
        index: 2,
        range: 8,

        upgradePath: [
            {
                option1: {
                    message: '10: Increase Damage',
                    feature: 'damage',
                    value: 80,
                    cost: 10
                },
                option2: {
                    message: '12: Add Splash Effect (50%)',
                    feature: 'splash',
                    value: 1.5,
                    cost: 12
                }
            },
            {
                option1: {
                    message: '10: Reduce Cooldown',
                    feature: 'cooldown',
                    value: 4,
                    cost: 10
                },
                option2: {
                    message: '8: Increase Range',
                    feature: 'range',
                    value: 10,
                    cost: 8
                }
            },
            {
                option1: {
                    message: '15: Gain Piercing Shot Ability',
                    feature: 'ability',
                    value: 'Piercing Shot',
                    cost: 15
                },
                option2: {
                    message: '15: Add Stun Effect (1 sec)',
                    feature: 'stun',
                    value: 1,
                    cost: 15
                }
            }
        ]
    },
    {
        name: 'Splash Cannon',
        cost: 8,
        color: 'yellow',
        button: new Button(1, 2, 3, 4, 'yellow'),
        index: 3,
        range: 4,
        upgradePath: [
            {
                option1: {
                    message: '5: Increase Damage',
                    feature: 'damage',
                    value: 12,
                    cost: 5
                },
                option2: {
                    message: '4: Increase Splash Radius',
                    feature: 'splashRadius',
                    value: 3,
                    cost: 4
                }
            },
            {
                option1: {
                    message: '8: Reduce Cooldown',
                    feature: 'cooldown',
                    value: 1.5,
                    cost: 8
                },
                option2: {
                    message: '6: Increase Range',
                    feature: 'range',
                    value: 5,
                    cost: 6
                }
            },
            {
                option1: {
                    message: '12: Add Burn Effect (3 dmg/s for 3s)',
                    feature: 'burning',
                    value: 3,
                    cost: 12
                },
                option2: {
                    message: '10: Gain Splash Barrage Ability',
                    feature: 'ability',
                    value: 'Splash Barrage',
                    cost: 10
                }
            }
        ]
    },
    {
        name: 'Slow Tower',
        cost: 7,
        color: 'cyan',
        button: new Button(1, 2, 3, 4, 'cyan'),
        index: 4,
        range: 5,

        upgradePath: [
            {
                option1: {
                    message: '5: Increase Slow Effect (50%)',
                    feature: 'slowEffect',
                    value: 0.5,
                    cost: 5
                },
                option2: {
                    message: '6: Increase Range',
                    feature: 'range',
                    value: 6,
                    cost: 6
                }
            },
            {
                option1: {
                    message: '10: Extend Slow Duration',
                    feature: 'slowDuration',
                    value: 3,
                    cost: 10
                },
                option2: {
                    message: '8: Add Minor Splash Slow Effect',
                    feature: 'splashSlow',
                    value: 1.5,
                    cost: 8
                }
            },
            {
                option1: {
                    message: '12: Gain Freeze Ability (2-sec full stop)',
                    feature: 'ability',
                    value: 'Freeze',
                    cost: 12
                },
                option2: {
                    message: '10: Double Slow Effect on Fast Balloons',
                    feature: 'slowMultiplier',
                    value: 2,
                    cost: 10
                }
            }
        ]
    },
    {
        name: 'Sniper Tower',
        cost: 6,
        color: 'green',
        button: new Button(1, 2, 3, 4, 'green'),
        index: 5,
        range: 7,

        upgradePath: [
            {
                option1: {
                    message: '6: Increase Damage',
                    feature: 'damage',
                    value: 8,
                    cost: 6
                },
                option2: {
                    message: '4: Increase Range',
                    feature: 'range',
                    value: 10,
                    cost: 4
                }
            },
            {
                option1: {
                    message: '6: Double Crit Chance',
                    feature: 'critChance',
                    value: 0.5,
                    cost: 6
                },
                option2: {
                    message: '8: Add Armor Piercing',
                    feature: 'armorPierce',
                    value: 1.5,
                    cost: 8
                }
            },
            {
                option1: {
                    message: '10: Gain Targeted Shot Ability (Focus)',
                    feature: 'ability',
                    value: 'Focus',
                    cost: 10
                },
                option2: {
                    message: '12: Increase Damage vs Fast Balloons',
                    feature: 'damageMultiplier',
                    value: 2,
                    cost: 12
                }
            }
        ]
    },
    {
        name: 'Chain Lightning Tower',
        cost: 9,
        color: 'purple',
        button: new Button(1, 2, 3, 4, 'purple'),
        index: 6,
        range: 5,

        upgradePath: [
            {
                option1: {
                    message: '6: Increase Damage',
                    feature: 'damage',
                    value: 10,
                    cost: 6
                },
                option2: {
                    message: '8: Increase Jump Range',
                    feature: 'jumpRange',
                    value: 3,
                    cost: 8
                }
            },
            {
                option1: {
                    message: '10: Add Chain Lightning (3 extra hits)',
                    feature: 'chainHits',
                    value: 3,
                    cost: 10
                },
                option2: {
                    message: '12: Reduce Cooldown',
                    feature: 'cooldown',
                    value: 1,
                    cost: 12
                }
            },
            {
                option1: {
                    message: '15: Gain Chain Burst Ability (Fires 5 Chain Bolts)',
                    feature: 'ability',
                    value: 'Chain Burst',
                    cost: 15
                },
                option2: {
                    message: '12: Increase Chain Hits vs Fast Balloons',
                    feature: 'chainHitsMultiplier',
                    value: 2,
                    cost: 12
                }
            }
        ]
    }
];

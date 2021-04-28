/* eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars */
'use strict'

var $protobuf = require('protobufjs/light')

var $root = ($protobuf.roots['default'] || ($protobuf.roots['default'] = new $protobuf.Root()))
    .addJSON({
        com: {
            nested: {
                ix: {
                    nested: {
                        quotation: {
                            nested: {
                                proto: {
                                    nested: {
                                        ProductRealTimePrice: {
                                            fields: {
                                                code: {
                                                    type: 'string',
                                                    id: 1
                                                },
                                                msgCode: {
                                                    type: 'string',
                                                    id: 2
                                                },
                                                trace: {
                                                    type: 'string',
                                                    id: 3
                                                },
                                                qt: {
                                                    type: 'int64',
                                                    id: 4
                                                },
                                                kt: {
                                                    type: 'int64',
                                                    id: 5
                                                },
                                                wt: {
                                                    type: 'int64',
                                                    id: 6
                                                },
                                                content: {
                                                    type: 'PriceContent',
                                                    id: 7
                                                }
                                            }
                                        },
                                        PriceContent: {
                                            fields: {
                                                a1: {
                                                    type: 'float',
                                                    id: 1
                                                },
                                                a2: {
                                                    type: 'float',
                                                    id: 2
                                                },
                                                a3: {
                                                    type: 'float',
                                                    id: 3
                                                },
                                                a4: {
                                                    type: 'float',
                                                    id: 4
                                                },
                                                a5: {
                                                    type: 'float',
                                                    id: 5
                                                },
                                                a6: {
                                                    type: 'float',
                                                    id: 6
                                                },
                                                a7: {
                                                    type: 'float',
                                                    id: 7
                                                },
                                                a8: {
                                                    type: 'float',
                                                    id: 8
                                                },
                                                a9: {
                                                    type: 'float',
                                                    id: 9
                                                },
                                                a10: {
                                                    type: 'float',
                                                    id: 10
                                                },
                                                b1: {
                                                    type: 'float',
                                                    id: 11
                                                },
                                                b2: {
                                                    type: 'float',
                                                    id: 12
                                                },
                                                b3: {
                                                    type: 'float',
                                                    id: 13
                                                },
                                                b4: {
                                                    type: 'float',
                                                    id: 14
                                                },
                                                b5: {
                                                    type: 'float',
                                                    id: 15
                                                },
                                                b6: {
                                                    type: 'float',
                                                    id: 16
                                                },
                                                b7: {
                                                    type: 'float',
                                                    id: 17
                                                },
                                                b8: {
                                                    type: 'float',
                                                    id: 18
                                                },
                                                b9: {
                                                    type: 'float',
                                                    id: 19
                                                },
                                                b10: {
                                                    type: 'float',
                                                    id: 20
                                                },
                                                av1: {
                                                    type: 'int64',
                                                    id: 21
                                                },
                                                av2: {
                                                    type: 'int64',
                                                    id: 22
                                                },
                                                av3: {
                                                    type: 'int64',
                                                    id: 23
                                                },
                                                av4: {
                                                    type: 'int64',
                                                    id: 24
                                                },
                                                av5: {
                                                    type: 'int64',
                                                    id: 25
                                                },
                                                av6: {
                                                    type: 'int64',
                                                    id: 26
                                                },
                                                av7: {
                                                    type: 'int64',
                                                    id: 27
                                                },
                                                av8: {
                                                    type: 'int64',
                                                    id: 28
                                                },
                                                av9: {
                                                    type: 'int64',
                                                    id: 29
                                                },
                                                av10: {
                                                    type: 'int64',
                                                    id: 30
                                                },
                                                bv1: {
                                                    type: 'int64',
                                                    id: 31
                                                },
                                                bv2: {
                                                    type: 'int64',
                                                    id: 32
                                                },
                                                bv3: {
                                                    type: 'int64',
                                                    id: 33
                                                },
                                                bv4: {
                                                    type: 'int64',
                                                    id: 34
                                                },
                                                bv5: {
                                                    type: 'int64',
                                                    id: 35
                                                },
                                                bv6: {
                                                    type: 'int64',
                                                    id: 36
                                                },
                                                bv7: {
                                                    type: 'int64',
                                                    id: 37
                                                },
                                                bv8: {
                                                    type: 'int64',
                                                    id: 38
                                                },
                                                bv9: {
                                                    type: 'int64',
                                                    id: 39
                                                },
                                                bv10: {
                                                    type: 'int64',
                                                    id: 40
                                                },
                                                sym: {
                                                    type: 'int32',
                                                    id: 41
                                                },
                                                cur: {
                                                    type: 'float',
                                                    id: 42
                                                },
                                                av: {
                                                    type: 'int64',
                                                    id: 43
                                                },
                                                tm: {
                                                    type: 'int64',
                                                    id: 44
                                                },
                                                stm: {
                                                    type: 'int64',
                                                    id: 45
                                                },
                                                mt: {
                                                    type: 'int64',
                                                    id: 46
                                                },
                                                highPrice: {
                                                    type: 'float',
                                                    id: 47
                                                },
                                                openPrice: {
                                                    type: 'float',
                                                    id: 48
                                                },
                                                lowPrice: {
                                                    type: 'float',
                                                    id: 49
                                                },
                                                closePrice: {
                                                    type: 'float',
                                                    id: 50
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })

module.exports = $root

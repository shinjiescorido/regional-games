module.exports = {
	bcBetsData: [
		{
			"bet": "player",
			"bet_money": 100,
			"win_money": 0,
			"user_money": 10004960
		}
	],
	dtBetsData: [{
		"bet": "tiger",
		"bet_money": 100,
		"win_money": 0,
		"user_money": 200
	}],
	sicboBetsData: [
		{"bet": "odd", "bet_money": 100, "win_money": 0, "user_money": 10000},
		{"bet": "big", "bet_money": 100, "win_money": 0, "user_money": 9900}
	],
	paigowBetsData: [
		{"bet": "up", "bet_money": 100, "win_money": 0, "user_money": 14989500},
		{"bet": "heaven", "bet_money": 100, "win_money": 0, "user_money": 14989500},
		{"bet": "down", "bet_money": 100, "win_money": 0, "user_money": 14989500}
	],
	pokerBetsData: {
		"ante": {
			"bet": 30000,
			"win": 0,
			"user_money": "9092500.00"
		},
		"flop": {
			"bet": 60000,
			"win": 0,
			"cancel": 0,
			"user_money": 9062500
		},
		"turn": {
			"bet": 30000,
			"win": 0,
			"cancel": 0,
			"user_money": 9002500
		},
		"river": {
			"bet": 30000,
			"win": 0,
			"cancel": 0,
			"user_money": 8972500
		},
		"bonus": {
			"bet": 0,
			"win": 0,
			"user_money": 0
		}
	},
	pokerNewroundData: {
		"gameName": "Poker",
		"eventName": "newround",
		"tableId": 1,
		"roundId": 43337,
		"roundNum": 1, //changeds
		"bettimer": 10,
		"status": "S"
	},
	sicboNewroundData: {
		"gameName": "Sicbo",
		"eventName": "newround",
		"tableId": "1",
		"roundId": 85408,
		"roundNum": 1, //changeds
		"betTimer": 30,
		"status": "S"
	},
	paigowNewroundData: {
		"gameName": "Pai-Gow",
		"eventName": "newround",
		"tableId": "1",
		"roundId": 85408,
		"roundNum": 1, //changeds
		"betTimer": 30,
		"status": "S"
	},
	dtNewroundData: {
		"gameName": "Dragon-Tiger",
		"eventName": "newround",
		"tableId": "1",
		"roundId": 355967,
		"roundNum": 1, //changeds
		"bettimer": 20,
		"status": "S"
	},
	bcNewroundData: {
		"gameName": "Baccarat",
		"eventName": "newround",
		"tableId": 1,
		//"roundId": 1646781,
		"roundNum": 1, //changeds
		"bettimer": 30,
		"status": "S"
	},
	sicboResultsData: {
		"eventName": "displayresults",
		"gameName": "Sicbo",
		"tableId": "1",
		"roundId": 85407,
		"roundNum": 2, //changed
		"dealerId": 145,
		"status": "E",
		"gameResult": {
			"winner": "124",
			"side_win": [
				"group-1234",
				"domino-1&2",
				"domino-1&4",
				"domino-2&4",
				"dice-1",
				"dice-2",
				"dice-4",
				"odd",
				"small",
				"sum-7"
			]
		},
		"gameInfo": {
			"dice": "124",
			"bets": [],
			"gameInfo": "{\"one\": 1, \"two\": 2, \"three\": 4}",
			"roundId": 85407,
			"roundNum": 388762,
			"tableId": 1,
			"createdAt": "2018-03-17T10:34:04.000Z",
			"updatedAt": "2018-03-17T10:34:46.000Z",
			"gameResult": {
				"winner": "124",
				"side_win": [
					"group-1234",
					"domino-1&2",
					"domino-1&4",
					"domino-2&4",
					"dice-1",
					"dice-2",
					"dice-4",
					"odd",
					"small",
					"sum-7"
				]
			}
		},
		"regionalResult": {},
		"mark": {
			"game_info": "{\"one\":\"1\",\"two\":\"2\",\"three\":\"4\"}"
		},
		"totalWinning": 0
	},
	paigowResultsData: {
		"eventName": "displayresults",
		"gameName": "Pai-Gow",
		"tableId": "1",
		"roundId": 85407,
		"roundNum": 2, //changed
		"dealerId": 145,
		"status": "E",
		"gameResult": {
			"pairs": ["up", "heaven"],
			"winner": ["up", "heaven"]
		},
		"gameInfo": {
			"seat": "down",
			"dices": ["2", "2"],
			"tiles": {"up": ["5", "5"], "down": ["4", "7"], "banker": ["7", "4"], "heaven": ["5", "5"]}
		},
		"regionalResult": {},
		"mark": {
			"game_info": {
				"seat": "down",
				"dices": ["2", "2"],
				"tiles": {"up": ["5", "5"], "down": ["4", "7"], "banker": ["7", "4"], "heaven": ["5", "5"]},
				"game_result": {
					"pairs": ["up", "heaven"],
					"winner": ["up", "heaven"]
				}
			},
			"totalWinning": 0
		},
		dtResultsData: {
			"gameName": "Dragon-Tiger",
			"eventName": "displayresult",
			"tableId": "1",
			"dealerId": 180,
			"roundId": 355966,
			"roundNum": 2, //changed
			"gameInfo": {
				"burn": "0023",
				"tiger": "0018",
				"dragon": "0000"
			},
			"gameResult": {
				"winner": "tiger",
				"side_bets": {
					"dragon": {
						"suite": "club",
						"size": "small",
						"parity": "odd"
					},
					"tiger": {
						"suite": "heart",
						"size": "small",
						"parity": "even"
					}
				}
			},
			"mark": {
				"num": 6,
				"mark": "n"
			},
			"totalWinning": 0,
			"status": "E",
			"userInfo": null,
			"regionalResult": {
				"gameInfo": {
					"burn": "0023",
					"tiger": "0018",
					"dragon": "0000"
				},
				"created_at": "2018-03-17 10:04:09",
				"updated_at": "2018-03-17 10:04:40",
				"tableId": 2,
				"roundId": 355966,
				"roundNum": 160209,
				"winner": "tiger",
				"cards": {
					"dragon": {
						"id": "0000",
						"value": 1,
						"suite": "club",
						"parity": "odd",
						"size": "small"
					},
					"tiger": {
						"id": "0018",
						"value": 6,
						"suite": "heart",
						"parity": "even",
						"size": "small"
					}
				},
				"bets": [],
				"gameResult": {
					"winner": "tiger",
					"side_bets": {
						"dragon": {
							"suite": "club",
							"size": "small",
							"parity": "odd"
						},
						"tiger": {
							"suite": "heart",
							"size": "small",
							"parity": "even"
						}
					}
				}
			},
			"dealerName": "Clavel"
		},
		pokerResultsData: {
			"gameName": "Poker",
			"eventName": "displayresults",
			"tableId": 1,
			"dealerId": 1,
			"roundId": 43336,
			"roundNum": 2, //changed
			"gameInfo": {
				"burn": [
					"0030",
					"0015",
					"0026"
				],
				"flop": [
					"0005",
					"0003",
					"0046"
				],
				"turn": "0002",
				"river": "0032",
				"dealer": [
					"0027",
					"0013"
				],
				"player": [
					"0039",
					"0045"
				]
			},
			"gameResult": {
				"cards": [
					"7S",
					"7D",
					"AS",
					"8S",
					"6C"
				],
				"cardsCode": [
					"0045",
					"0032",
					"0039",
					"0046",
					"0005"
				],
				"winner": "player",
				"handtype": "Pair",
				"pocketAmount": 0,
				"bonusAmount": 0,
				"bonusplusAmount": 0
			},
			"mark": {
				"mark": "P"
			},
			"status": "E",
			"totalWinning": 0,
			"userInfo": [],
			"dealerName": "Emilia",
			"regionalResult": {
				"created_at": "2018-03-17T10:34:51.000Z",
				"updated_at": "2018-03-17T10:36:27.000Z",
				"tableId": 1,
				"roundId": 43336,
				"roundNum": 86933,
				"playerHands": {
					"cardPool": [
						{
							"value": "A",
							"suit": "s",
							"rank": 13,
							"wildValue": "A"
						},
						{
							"value": "8",
							"suit": "s",
							"rank": 7,
							"wildValue": "8"
						},
						{
							"value": "7",
							"suit": "s",
							"rank": 6,
							"wildValue": "7"
						},
						{
							"value": "7",
							"suit": "d",
							"rank": 6,
							"wildValue": "7"
						},
						{
							"value": "6",
							"suit": "c",
							"rank": 5,
							"wildValue": "6"
						},
						{
							"value": "4",
							"suit": "c",
							"rank": 3,
							"wildValue": "4"
						},
						{
							"value": "3",
							"suit": "c",
							"rank": 2,
							"wildValue": "3"
						}
					],
					"cards": [
						{
							"value": "7",
							"suit": "s",
							"rank": 6,
							"wildValue": "7"
						},
						{
							"value": "7",
							"suit": "d",
							"rank": 6,
							"wildValue": "7"
						},
						{
							"value": "A",
							"suit": "s",
							"rank": 13,
							"wildValue": "A"
						},
						{
							"value": "8",
							"suit": "s",
							"rank": 7,
							"wildValue": "8"
						},
						{
							"value": "6",
							"suit": "c",
							"rank": 5,
							"wildValue": "6"
						}
					],
					"suits": {
						"s": [
							{
								"value": "A",
								"suit": "s",
								"rank": 13,
								"wildValue": "A"
							},
							{
								"value": "8",
								"suit": "s",
								"rank": 7,
								"wildValue": "8"
							},
							{
								"value": "7",
								"suit": "s",
								"rank": 6,
								"wildValue": "7"
							}
						],
						"d": [
							{
								"value": "7",
								"suit": "d",
								"rank": 6,
								"wildValue": "7"
							}
						],
						"c": [
							{
								"value": "6",
								"suit": "c",
								"rank": 5,
								"wildValue": "6"
							},
							{
								"value": "4",
								"suit": "c",
								"rank": 3,
								"wildValue": "4"
							},
							{
								"value": "3",
								"suit": "c",
								"rank": 2,
								"wildValue": "3"
							}
						]
					},
					"values": [
						[
							{
								"value": "A",
								"suit": "s",
								"rank": 13,
								"wildValue": "A"
							}
						],
						null,
						null,
						null,
						null,
						null,
						[
							{
								"value": "8",
								"suit": "s",
								"rank": 7,
								"wildValue": "8"
							}
						],
						[
							{
								"value": "7",
								"suit": "s",
								"rank": 6,
								"wildValue": "7"
							},
							{
								"value": "7",
								"suit": "d",
								"rank": 6,
								"wildValue": "7"
							}
						],
						[
							{
								"value": "6",
								"suit": "c",
								"rank": 5,
								"wildValue": "6"
							}
						],
						null,
						[
							{
								"value": "4",
								"suit": "c",
								"rank": 3,
								"wildValue": "4"
							}
						],
						[
							{
								"value": "3",
								"suit": "c",
								"rank": 2,
								"wildValue": "3"
							}
						],
						null,
						null
					],
					"wilds": [],
					"name": "Pair",
					"game": {
						"descr": "standard",
						"cardsInHand": 5,
						"handValues": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						],
						"wildValue": null,
						"wildStatus": 1,
						"wheelStatus": 0,
						"sfQualify": 5,
						"lowestQualified": null,
						"noKickers": false
					},
					"sfLength": 0,
					"alwaysQualifies": true,
					"rank": 2,
					"descr": "Pair, 7's",
					"isPossible": true
				},
				"bankerHands": {
					"cardPool": [
						{
							"value": "A",
							"suit": "h",
							"rank": 13,
							"wildValue": "A"
						},
						{
							"value": "8",
							"suit": "s",
							"rank": 7,
							"wildValue": "8"
						},
						{
							"value": "7",
							"suit": "d",
							"rank": 6,
							"wildValue": "7"
						},
						{
							"value": "6",
							"suit": "c",
							"rank": 5,
							"wildValue": "6"
						},
						{
							"value": "4",
							"suit": "c",
							"rank": 3,
							"wildValue": "4"
						},
						{
							"value": "3",
							"suit": "c",
							"rank": 2,
							"wildValue": "3"
						},
						{
							"value": "2",
							"suit": "d",
							"rank": 1,
							"wildValue": "2"
						}
					],
					"cards": [
						{
							"value": "A",
							"suit": "h",
							"rank": 13,
							"wildValue": "A"
						},
						{
							"value": "8",
							"suit": "s",
							"rank": 7,
							"wildValue": "8"
						},
						{
							"value": "7",
							"suit": "d",
							"rank": 6,
							"wildValue": "7"
						},
						{
							"value": "6",
							"suit": "c",
							"rank": 5,
							"wildValue": "6"
						},
						{
							"value": "4",
							"suit": "c",
							"rank": 3,
							"wildValue": "4"
						}
					],
					"suits": {
						"h": [
							{
								"value": "A",
								"suit": "h",
								"rank": 13,
								"wildValue": "A"
							}
						],
						"s": [
							{
								"value": "8",
								"suit": "s",
								"rank": 7,
								"wildValue": "8"
							}
						],
						"d": [
							{
								"value": "7",
								"suit": "d",
								"rank": 6,
								"wildValue": "7"
							},
							{
								"value": "2",
								"suit": "d",
								"rank": 1,
								"wildValue": "2"
							}
						],
						"c": [
							{
								"value": "6",
								"suit": "c",
								"rank": 5,
								"wildValue": "6"
							},
							{
								"value": "4",
								"suit": "c",
								"rank": 3,
								"wildValue": "4"
							},
							{
								"value": "3",
								"suit": "c",
								"rank": 2,
								"wildValue": "3"
							}
						]
					},
					"values": [
						[
							{
								"value": "A",
								"suit": "h",
								"rank": 13,
								"wildValue": "A"
							}
						],
						null,
						null,
						null,
						null,
						null,
						[
							{
								"value": "8",
								"suit": "s",
								"rank": 7,
								"wildValue": "8"
							}
						],
						[
							{
								"value": "7",
								"suit": "d",
								"rank": 6,
								"wildValue": "7"
							}
						],
						[
							{
								"value": "6",
								"suit": "c",
								"rank": 5,
								"wildValue": "6"
							}
						],
						null,
						[
							{
								"value": "4",
								"suit": "c",
								"rank": 3,
								"wildValue": "4"
							}
						],
						[
							{
								"value": "3",
								"suit": "c",
								"rank": 2,
								"wildValue": "3"
							}
						],
						[
							{
								"value": "2",
								"suit": "d",
								"rank": 1,
								"wildValue": "2"
							}
						],
						null
					],
					"wilds": [],
					"name": "High Card",
					"game": {
						"descr": "standard",
						"cardsInHand": 5,
						"handValues": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						],
						"wildValue": null,
						"wildStatus": 1,
						"wheelStatus": 0,
						"sfQualify": 5,
						"lowestQualified": null,
						"noKickers": false
					},
					"sfLength": 0,
					"alwaysQualifies": true,
					"rank": 1,
					"descr": "A High",
					"isPossible": true
				},
				"winner": [
					{
						"cardPool": [
							{
								"value": "A",
								"suit": "s",
								"rank": 13,
								"wildValue": "A"
							},
							{
								"value": "8",
								"suit": "s",
								"rank": 7,
								"wildValue": "8"
							},
							{
								"value": "7",
								"suit": "s",
								"rank": 6,
								"wildValue": "7"
							},
							{
								"value": "7",
								"suit": "d",
								"rank": 6,
								"wildValue": "7"
							},
							{
								"value": "6",
								"suit": "c",
								"rank": 5,
								"wildValue": "6"
							},
							{
								"value": "4",
								"suit": "c",
								"rank": 3,
								"wildValue": "4"
							},
							{
								"value": "3",
								"suit": "c",
								"rank": 2,
								"wildValue": "3"
							}
						],
						"cards": [
							{
								"value": "7",
								"suit": "s",
								"rank": 6,
								"wildValue": "7"
							},
							{
								"value": "7",
								"suit": "d",
								"rank": 6,
								"wildValue": "7"
							},
							{
								"value": "A",
								"suit": "s",
								"rank": 13,
								"wildValue": "A"
							},
							{
								"value": "8",
								"suit": "s",
								"rank": 7,
								"wildValue": "8"
							},
							{
								"value": "6",
								"suit": "c",
								"rank": 5,
								"wildValue": "6"
							}
						],
						"suits": {
							"s": [
								{
									"value": "A",
									"suit": "s",
									"rank": 13,
									"wildValue": "A"
								},
								{
									"value": "8",
									"suit": "s",
									"rank": 7,
									"wildValue": "8"
								},
								{
									"value": "7",
									"suit": "s",
									"rank": 6,
									"wildValue": "7"
								}
							],
							"d": [
								{
									"value": "7",
									"suit": "d",
									"rank": 6,
									"wildValue": "7"
								}
							],
							"c": [
								{
									"value": "6",
									"suit": "c",
									"rank": 5,
									"wildValue": "6"
								},
								{
									"value": "4",
									"suit": "c",
									"rank": 3,
									"wildValue": "4"
								},
								{
									"value": "3",
									"suit": "c",
									"rank": 2,
									"wildValue": "3"
								}
							]
						},
						"values": [
							[
								{
									"value": "A",
									"suit": "s",
									"rank": 13,
									"wildValue": "A"
								}
							],
							null,
							null,
							null,
							null,
							null,
							[
								{
									"value": "8",
									"suit": "s",
									"rank": 7,
									"wildValue": "8"
								}
							],
							[
								{
									"value": "7",
									"suit": "s",
									"rank": 6,
									"wildValue": "7"
								},
								{
									"value": "7",
									"suit": "d",
									"rank": 6,
									"wildValue": "7"
								}
							],
							[
								{
									"value": "6",
									"suit": "c",
									"rank": 5,
									"wildValue": "6"
								}
							],
							null,
							[
								{
									"value": "4",
									"suit": "c",
									"rank": 3,
									"wildValue": "4"
								}
							],
							[
								{
									"value": "3",
									"suit": "c",
									"rank": 2,
									"wildValue": "3"
								}
							],
							null,
							null
						],
						"wilds": [],
						"name": "Pair",
						"game": {
							"descr": "standard",
							"cardsInHand": 5,
							"handValues": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							],
							"wildValue": null,
							"wildStatus": 1,
							"wheelStatus": 0,
							"sfQualify": 5,
							"lowestQualified": null,
							"noKickers": false
						},
						"sfLength": 0,
						"alwaysQualifies": true,
						"rank": 2,
						"descr": "Pair, 7's",
						"isPossible": true
					}
				],
				"winSide": "player",
				"bets": [],
				"playerBonusHand": [
					"AS",
					"7S"
				],
				"playerCardRank": 0,
				"bonusplusAmount": 0,
				"gameInfo": {
					"burn": [
						"0030",
						"0015",
						"0026"
					],
					"flop": [
						"0005",
						"0003",
						"0046"
					],
					"turn": "0002",
					"river": "0032",
					"dealer": [
						"0027",
						"0013"
					],
					"player": [
						"0039",
						"0045"
					]
				},
				"gameResult": {
					"cards": [
						"7S",
						"7D",
						"AS",
						"8S",
						"6C"
					],
					"cardsCode": [
						"0045",
						"0032",
						"0039",
						"0046",
						"0005"
					],
					"winner": "player",
					"handtype": "Pair",
					"pocketAmount": 0,
					"bonusAmount": 0,
					"bonusplusAmount": 0
				},
				"mark": {
					"mark": "P"
				},
				"meta": [
					{
						"roundId": 43336,
						"roundNum": 86933,
						"gameInfo": {
							"burn": [
								"0030",
								"0015",
								"0026"
							],
							"flop": [
								"0005",
								"0003",
								"0046"
							],
							"turn": "0002",
							"river": "0032",
							"dealer": [
								"0027",
								"0013"
							],
							"player": [
								"0039",
								"0045"
							]
						},
						"gameResult": {
							"cards": [
								"0045",
								"0032",
								"0039",
								"0046",
								"0005"
							],
							"winner": "player",
							"handtype": "Pair"
						}
					},
					{
						"roundId": 43335,
						"roundNum": 86932,
						"gameInfo": {
							"burn": [
								"0040",
								"0014",
								"0027"
							],
							"flop": [
								"0017",
								"0016",
								"0051"
							],
							"turn": "0049",
							"river": "0010",
							"dealer": [
								"0008",
								"0044"
							],
							"player": [
								"0031",
								"0029"
							]
						},
						"gameResult": {
							"cards": [
								"0049",
								"0010",
								"0029",
								"0016",
								"0051"
							],
							"winner": "player",
							"handtype": "Two Pair"
						}
					},
					{
						"roundId": 43334,
						"roundNum": 86931,
						"gameInfo": {
							"burn": [
								"0031",
								"0024",
								"0030"
							],
							"flop": [
								"0038",
								"0021",
								"0003"
							],
							"turn": "0016",
							"river": "0039",
							"dealer": [
								"0027",
								"0045"
							],
							"player": [
								"0002",
								"0020"
							]
						},
						"gameResult": {
							"cards": [
								"0003",
								"0016",
								"0039",
								"0038",
								"0021"
							],
							"winner": "tie",
							"handtype": "Pair"
						}
					}
				],
				"finalResult": {
					"game_result": {
						"cards": [
							"0045",
							"0032",
							"0039",
							"0046",
							"0005"
						],
						"winner": "player",
						"handtype": "Pair"
					},
					"status": "E"
				}
			}
		},
		bcResultsData: {
			"eventName": "displayresults",
			"gameName": "Baccarat",
			"tableId": 1,
			"roundId": 1647362,
			"roundNum": 2, //changed
			"status": "E",
			"gameInfo": {
				"player": {
					"total": 7,
					"cards": [
						{
							"id": "0011",
							"value": 12,
							"suite": "club",
							"parity": "even",
							"size": "big",
							"bcValue": 0
						},
						{
							"id": "0016",
							"value": 4,
							"suite": "heart",
							"parity": "even",
							"size": "small",
							"bcValue": 4
						},
						{
							"id": "0028",
							"value": 3,
							"suite": "diamond",
							"parity": "odd",
							"size": "small",
							"bcValue": 3
						}
					]
				},
				"banker": {
					"total": 7,
					"cards": [
						{
							"id": "0044",
							"value": 6,
							"suite": "spade",
							"parity": "even",
							"size": "small",
							"bcValue": 6
						},
						{
							"id": "0017",
							"value": 5,
							"suite": "heart",
							"parity": "odd",
							"size": "small",
							"bcValue": 5
						},
						{
							"id": "0005",
							"value": 6,
							"suite": "club",
							"parity": "even",
							"size": "small",
							"bcValue": 6
						}
					]
				}
			},
			"gameResult": {
				"winner": "tie",
				"pairs": [],
				"supersix": false,
				"bonus": {
					"type": null,
					"diff": null,
					"oddsbonus": null
				},
				"size": "big"
			},
			"regionalResult": {
				"game_info": {
					"banker1": "0002",
					"banker2": "0042",
					"player1": "0027",
					"player2": "0000",
					"player3": "0001"
				},
				"winner": "tie",
				"round_no": 580885,
				"table": 8,
				"created_at": "2018-03-17 09:57:15",
				"resulted_at": "2018-03-17 09:57:59",
				"pairs": [],
				"natural": [],
				"banker": {
					"total": 7,
					"cards": [
						{
							"id": "0044",
							"value": 6,
							"suite": "spade",
							"parity": "even",
							"size": "small",
							"bcValue": 6
						},
						{
							"id": "0017",
							"value": 5,
							"suite": "heart",
							"parity": "odd",
							"size": "small",
							"bcValue": 5
						},
						{
							"id": "0005",
							"value": 6,
							"suite": "club",
							"parity": "even",
							"size": "small",
							"bcValue": 6
						}
					]
				},
				"player": {
					"total": 7,
					"cards": [
						{
							"id": "0011",
							"value": 12,
							"suite": "club",
							"parity": "even",
							"size": "big",
							"bcValue": 0
						},
						{
							"id": "0016",
							"value": 4,
							"suite": "heart",
							"parity": "even",
							"size": "small",
							"bcValue": 4
						},
						{
							"id": "0028",
							"value": 3,
							"suite": "diamond",
							"parity": "odd",
							"size": "small",
							"bcValue": 3
						}
					]
				},
				"bets": [],
				"supersix": false,
				"bonus": {
					"type": null,
					"diff": null,
					"oddsbonus": null
				},
				"size": "big"
			},
			"dealerName": "Belle",
			"mark": {
				"num": 7,
				"mark": "t",
				"natural": []
			},
			"totalWinning": 0,
			"userInfo": []
		}
	}
}
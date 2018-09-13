"use strict";

	/*
	|--------------------------------------------------------------------------
	| BetsCalculator v1.1
	|--------------------------------------------------------------------------
	| Author : Michael Neri
	| Processing of bets
	|
	*/

const _  		= require("lodash");
const db        = require("../../db" );
const request 	= require("request-promise");
const moment 	= require("moment");
const fs 		= require("fs");
let seq = db.paigow.sequelize;

module.exports = {
	betlogs : null,
	bets 	: {},
	multipliers : {
		normal: 1,
		pair: 2,
		double: 3,
		triple: 7
	},
	commissions : {
		p: 0,
		b: 0,
		j: 0.05,
		null: 0.05
	},

	fnNoMoreBet (tableId, roundNum, dealerId) {
		db.paigow.rounds.find({
			where : {
				table_id : tableId, round_num : roundNum
			},
			include : [{
				model : db.paigow.bets,
				include : [{
					model : db.paigow.rooms,
					include : [{
						model : db.paigow.users,
						include : [{
							model : db.paigow.vendors,
							attributes : ["id", "commission"],
							plain : true
						}],
						attributes : ["id", "money"],
						plain : true
					}],
					attributes : ["id", "user_id", "bet_range"]
				}],
				attributes : ["id", "round_id", "room_id", "play_type", "user_id", "bet_history", "total_bet", "total_winning", "created_at", "updated_at", "bet_range"]
			}],
			attributes : ["id", "round_num"],
			plain : true
		}).then(rounds => {
			if (_.isEmpty(rounds)) {
				return;
				//rej('empty round bankerbets');
			}

			let bets = _.filter(rounds.bets, (bet) => {
				return bet.room_id;
			});

			if (_.isEmpty(bets)) {
				return;
				//rej('empty bets for bankerbets');
			}

			this.fnInsertBankerBets(this.processBankerBets(bets))
					.then(()=>{})
					.catch(e => console.log(JSON.stringify(e, null, "\t")));
		}).catch((e) => {
			console.log(JSON.stringify(e, null, "\t"));
		});
	},

	/**
	 * @info sum of bets per room; returns array of Objects
	 * @param bets
	 * @returns {*}
	 */
	processBankerBets(bets) {
		return _(bets)
				.groupBy('room_id')
				.mapValues((room_bets) => {
					let betsWrapper = _(room_bets)
							.map((bet) => {
								return  JSON.parse(bet.bet_history);
							})
							.flatten();
					//row to be inserted

					return {
						user_id 		: room_bets[0].room.user_id,
						room_id 		: room_bets[0].room_id,
						round_id 		: room_bets[0].round_id,
						//created_at 	: moment().utcOffset(0).format("YYYY-MM-DD HH:mm:ss"),
						total_bet 		: betsWrapper.sumBy('bet_money'),
						total_winning 	: 0,
						total_win 		: 0,
						total_lost 		: 0,
						play_type 		: 'b',
						bet_range		: room_bets[0].room.bet_range,
						commission_info : JSON.parse(room_bets[0].room.user.vendor.commission),
						bet_history 	: betsWrapper
								.groupBy('bet')
								.map((objs, key) => {
									return {
										'bet'		: key,
										'bet_money'	: _.sumBy(objs, 'bet_money'),
										'win_money'	: 0,
										'lose_money': 0,
										'count' 	: _.size(objs)
									};
								}).value()
					};
				})
				.values()
				.value();
	},

	fnInsertBankerBets(roomBets) {
		return new Promise((res, rej)=>{
			db.paigow.bets.bulkCreate(roomBets, {individualHooks: false}).then(result => {
				//console.log('===============>', result);
				res(result);
			}).catch(e => {
				console.log(JSON.stringify(e, null, "\t"));
				rej(e);
			});
		});
	},

	processBets (args) {
		let gameResult = args.gameResult;
		let result =  args.regionalResult;
		let tableId = args.tableId;
		let roundNum = args.roundNum;
		let gameInfo = args.gameInfo;
		let dealerName = args.dealerName;

		result.updated_at = moment().utcOffset(0).format("YYYY-MM-DD HH:mm:ss");
        result.created_at = moment(result.created_at).utcOffset(0).format("YYYY-MM-DD HH:mm:ss");

		//let winValue = result.cards[(result.winner == "tie" || result.winner == "suited tie") ? "dragon" : result.winner].value;
		let roundWins = 0;
		let roundBets = 0;

		if (_.isEmpty(result.bets)) {
			let emptyBetsQuery = "";

			emptyBetsQuery = " UPDATE rounds AS r";
			emptyBetsQuery += "   SET r.status = 'E'";
			emptyBetsQuery += "     , r.game_result = '" + JSON.stringify(gameResult) + "'";
			emptyBetsQuery += "     , r.game_info = '" + JSON.stringify(gameInfo) + "'";
			emptyBetsQuery += "     , r.updated_at = NOW()";
			emptyBetsQuery += " WHERE r.table_id = " + tableId;
			emptyBetsQuery += "   AND r.round_num = " + roundNum;

			return seq.transaction({
				isolationLevel : db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
			}).then(t => {
				return seq.query(emptyBetsQuery, { transaction: t }).then(() =>
					t.commit()
				).catch(e => {
					t.rollback();
					throw "error";
                });
			})
			.then(() => {
				result.gameResult = gameResult;
				this.sendToAPIServer('Pai-Gow', result, [], dealerName);
				return {roundNum,roundWins,userInfo:[]};
			})
			.catch(e => {
				throw "error";
			});
		}

		let queryBH       = "";
		let queryTB       = "";
		let queryTW       = "";
		let queryTWinning = "";
		let queryTR       = "";
		let queryCom	  = "";
		let queryTLoss    = "";
		let idArray       = [];
		let userMoney     = "";
		let userIds       = [];
		let userInfo      = [];
		let apiUserInfo   = [];
		let totalWin      = 0;

		_.each(result.bets, (bets, index) => {
			let resultBets     = [];
			let betData        = bets.get();
			let data           = JSON.parse(betData.bet_history);
			let totalBetAmount = 0;
			totalWin           = 0;
			let win_money      = 0;
			let totalRolling   = 0;
			let tempp          = 0;
			let winningBet     = 0;
			let betLost        = 0;
			let totalUserMoney = 0;
			let commission	   = 0;
			

			_.each(data, (betData, index) => {
				win_money = this.getWinMoney(
						result,
						betData.bet_money,
						betData.bet.trim(),
						bets.room_id && ['b','p'].indexOf(bets.play_type) > -1 ? bets.play_type : null
				);
				totalWin 		+= win_money;
				totalBetAmount 	+= betData.bet_money;
				totalUserMoney 	+= (betData.user_money) ? betData.user_money : 0;

				if (win_money) {
					betData.win_money = win_money + (bets.play_type == 'b' ? 0 : betData.bet_money);
					winningBet += betData.bet_money;
				}

				if (bets.play_type != 'b' && !win_money) {
					// if player loses
					betData.win_money = 0;
					betLost += betData.bet_money;
				}

				//loss is opposite of win for banker bets
				if(bets.play_type == 'b' && !win_money){
					betData.win_money = 0;
					betData.lose_money = this.getWinMoney(result, betData.bet_money, betData.bet.trim(), 'p');
					betLost += betData.lose_money
				}

				resultBets.push(betData);
			});

			//commission rooms
			if(bets.room_id && ['b','p'].indexOf(bets.play_type) > -1){
				let tax = this.fnTax(totalWin, betLost, this.getDBCom(betData, bets.play_type));
				totalWin = tax.gross;
				commission = tax.tot_com;
			}

			let moneyForUser = (bets.play_type == 'b' ? 0 : winningBet)+totalWin;

			userInfo.push({
				id         		: bets.user_id,
				money  			: (bets.play_type == 'b' ?  bets.user.money + moneyForUser - betLost : bets.user.money + moneyForUser),
				total_winning   : Math.round((bets.play_type == 'b' ?  moneyForUser - betLost : moneyForUser) * 100) / 100,
				total_lost 		: betLost,
				user_type       : bets.user_type,
				bets 			: data,
				gameResult
			});

			let betuser = bets.user.get();
			bets.created_at = moment(bets.created_at).utcOffset(0).format("YYYY-MM-DD HH:mm:ss");

			apiUserInfo.push({
				id				: betuser.id,
				user_id       	: bets.user_id,
				user_name     	: betuser.user_name,
				user_type       : bets.user_type,
				vendor_id     	: betuser.vendor_id,
				commission    	: commission,
				commission_info : typeof(bets.commission) == "string" ? JSON.parse(bets.commission) : bets.commission,
				currency      	: betuser.currency || betuser.vendor.currency,
				bet_range     	: bets.bet_range,
				play_type       : bets.play_type,
				bets          	: data,
				total_bet     	: totalBetAmount,
				total_win       : (bets.play_type == "b" ? moneyForUser - betLost : moneyForUser),
				total_rolling 	: totalRolling,
				total_lost    	: betLost,
				transaction_id	: bets.transaction_id,
				session_id	  	: bets.session_id,
				created_at    	: bets.created_at,
				multiplier    	: betuser.denomination || betuser.vendor.multiplier
			});
			
			let temptotalWin = (betuser.vendor.integration_type == "transfer") ?
					(bets.play_type == "b" ? moneyForUser - betLost : moneyForUser) : 0;

			//let temptotalWin = moneyForUser;
			userIds.push(bets.user_id);
			userMoney 		+= "WHEN " + bets.user_id + " THEN u.money + " + temptotalWin + " ";
			queryBH 		+= "WHEN " + bets.id + " THEN \'" +  JSON.stringify(resultBets) + "\' ";
			queryTB 		+= "WHEN " + bets.id + " THEN " +  totalBetAmount + " ";
			queryTW 		+= "WHEN " + bets.id + " THEN " +
					(bets.play_type == "b" ? totalWin - betLost : totalWin) + " ";//total_winning
			queryTLoss 		+= "WHEN " + bets.id + " THEN " +  betLost + " ";
			queryTWinning 	+= "WHEN " + bets.id + " THEN " +  moneyForUser + " ";
			queryTR 		+= "WHEN " + bets.id + " THEN " +  totalRolling + " ";
			queryCom += "WHEN " + bets.id + " THEN " + commission + " ";
			roundWins += moneyForUser;
			roundBets += totalBetAmount;
			idArray.push(bets.id);
		});

		let rawQuery = "";
		rawQuery = " UPDATE paigow.bets AS b";
		rawQuery += "  JOIN nihtan_api.users AS u";
		rawQuery += "    ON b.user_id = u.id";
		rawQuery += "  JOIN paigow.rounds AS r";
		rawQuery += "    ON b.round_id = r.id";
		rawQuery += "   SET b.bet_history = (CASE b.id " + queryBH + " END)";
		rawQuery += "     , b.total_bet = (CASE b.id " + queryTB + " END)";
		rawQuery += "     , b.total_winning = (CASE b.id " + queryTW + " END)";
		rawQuery += "     , b.total_win = (CASE b.id " + queryTWinning + " END)";
		rawQuery += "     , b.total_lost = (CASE b.id " + queryTLoss + " END)";
		rawQuery += "     , b.total_rolling = (CASE b.id " + queryTR + " END)";
		rawQuery += "     , b.commission = (CASE b.id " + queryCom + " END)";
		rawQuery += "     , u.money = (CASE u.id " + userMoney + " END)";
		rawQuery += "     , r.status ='E'";
		rawQuery += "     , r.game_result = '" + JSON.stringify(gameResult) + "'";
		rawQuery += "     , r.game_info = '" + JSON.stringify(gameInfo) + "'";
		rawQuery += "     , b.updated_at = NOW()";
		rawQuery += "     , u.updated_at = NOW()";
		rawQuery += "     , r.updated_at = NOW()";
		rawQuery += " WHERE r.table_id = " + tableId;
		rawQuery += "   AND r.round_num = " + roundNum;
		//db.sequelize.query("UPDATE game_marks SET mark = JSON_ARRAY_INSERT(mark, '$[200]', JSON_MERGE(JSON_OBJECT(\"num\", " + winValue + "), JSON_OBJECT(\"mark\", \"" + markData + "\"))), updated_at = NOW() WHERE id = " + shoeId);

		return seq.transaction({
			autocommit : true,
			isolationLevel : db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
		})
		.then(t => {
			return seq.query(rawQuery, { transaction : t })
			.then(() =>{
				t.commit();
				return {roundWins,roundNum,userInfo};
			})
			.catch(e => {
				t.rollback();
				throw "error";
            });
		})
		.then(() => {
			result.gameResult = gameResult;
			this.sendToAPIServer('Pai-Gow', result, apiUserInfo, dealerName);
			 return {roundWins,roundNum,userInfo};
		})
		.catch(e => {
			t.rollback();
			throw "error";
		});
	},

    /**
     * Pass data for current round to Nihtan API Server.
     *
     * @param game
     * @param result
     * @param data
     */
    sendToAPIServer (game, result, data,dealer) {
        let jsonData = {
            method : "POST",
            uri : process.env.API_HISTORY_URL,
		body : {
                game,
                table       : result.tableId,
                round_no    : result.roundNum,
                game_info   : result.gameInfo,
                game_result : result.gameResult,
                created_at  : result.created_at,
                resulted_at : result.updated_at,
				dealer 		: dealer,
                data 		: data
            },
            json : true
        };
		console.log(' sent to api ----------------------------------------- ')
		console.log(JSON.stringify(jsonData, null, "\t"));
		console.log(' ----------------------------------------------------- ');
		//return;
        request(jsonData).then(() => {
			this.apiLog(jsonData);
		}).catch(e =>
			this.apiLog({ error : e.name, cause : e.cause, params : jsonData })
		);
	},
	apiLog (data) {
		return;
		let fn = "logs/" + moment().utcOffset(0).format("YY-MM-DD") + "-ApiRequest.log";
		if (fs.existsSync(fn)) {
			fs.appendFile(fn, "--START\n" + moment().utcOffset(0).format("YYYY-MM-DD HH:mm:ss") + ":\n" + JSON.stringify(data, null, "\t") + "\n--END\n\n", err => {
				if (err) {
					throw err;
				}
			});
		}
		else {
			fs.writeFile(fn, "--START\n" + moment().utcOffset(0).format("YYYY-MM-DD HH:mm:ss") + ":\n" + JSON.stringify(data, null, "\t") + "\n--END\n\n", err => {
				if (err) {
					throw err;
				}
			});
		}
	},

	/**
	 * @info sum of bets per room; returns array of Objects
	 * @param bets
	 * @returns {*}
	 */
	processBankerBets(bets) {
		return _(bets)
				.groupBy('room_id')
				.mapValues((room_bets) => {
					let betsWrapper = _(room_bets)
							.map((bet) => {
								return  JSON.parse(bet.bet_history);
							})
							.flatten();
					//row to be inserted

					return {
						user_id 		: room_bets[0].room.user_id,
						room_id 		: room_bets[0].room_id,
						round_id 		: room_bets[0].round_id,
						//created_at 	: moment().utcOffset(0).format("YYYY-MM-DD HH:mm:ss"),
						total_bet 		: betsWrapper.sumBy('bet_money'),
						total_winning 	: 0,
						total_win 		: 0,
						total_lost 		: 0,
						play_type 		: 'b',
						bet_range		: room_bets[0].room.bet_range,
						commission_info : JSON.parse(room_bets[0].room.user.vendor.commission),
						bet_history 	: betsWrapper
								.groupBy('bet')
								.map((objs, key) => {
									return {
										'bet'		: key,
										'bet_money'	: _.sumBy(objs, 'bet_money'),
										'win_money'	: 0,
										'lose_money': 0,
										'count' 	: _.size(objs)
									};
								}).value()
					};
				})
				.values()
				.value();
	},

	/**
	 * @info if play type is null then classic payout
	 * @param result
	 * @param amount
	 * @param bet
	 * @param type
	 * @returns {number}
	 */
	getWinMoney (result, amount, bet, type) {
		if(!amount)
			return 0;

		//side win
		let isSideWin = bet.split('-').length > 1;
		if(isSideWin && (type != 'b' ? result.sideWin.indexOf(bet) > -1 : result.sideWin.indexOf(bet) == -1)){
			return amount * this.multipliers[bet.split('-').length > 2 ? 'triple' : 'double'];// * (1 - this.commissions[type]);
		}

		//side win lost
		if(isSideWin)
			return 0;

		//pairs win
		if(type != 'b' && result.pairs.indexOf(bet) > -1 && result.winner.indexOf(bet) > -1)
			return amount * this.multipliers.pair * (1 - this.commissions[type]);

		//normal win
		if(type != 'b' ? result.winner.indexOf(bet) > -1 : result.winner.indexOf(bet) == -1)
			return amount * this.multipliers.normal * (1 - this.commissions[type]);

		return 0;
	},

	/**
	 * @info commission info from Database for rooms when 'player as banker' room
	 * @param betData
	 * @param type
	 * @returns {*}
	 */
	getDBCom (betData, type) {
		let data = JSON.parse(betData.commission_info);

		if (!data) return this.commissions[type];

		return {
			p: data[1].paigow.player / 100,
			b: data[1].paigow.banker / 100
		}[type];
	},

	/**
	 * @info calculates the commission from the profit when 'player as banker' room
	 * @param totalWin
	 * @param betLost
	 * @param DBCom
	 * @returns {{profit: number, gross: *, tot_com: number}}
	 */
	fnTax (totalWin, betLost, DBCom) {
		let data = {
			profit : totalWin - betLost,
			gross : totalWin,
			tot_com : 0
		};

		if(data.profit > 0) {
			data.tot_com = data.profit * DBCom;
			data.gross -= data.tot_com;
		}

		return data;
	}
};

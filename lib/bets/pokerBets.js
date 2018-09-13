"use strict";

/*
|--------------------------------------------------------------------------
| poker calc v1.1
|--------------------------------------------------------------------------
| Author : Shinji Escorido
| Processing of bets
|
*/

const _         = require("lodash");
const db        = require("../../db" );
const request   = require("request-promise");
const moment    = require("moment");
const fs        = require("fs");
let seq         = db.poker.sequelize;
let pokerORM    = db.poker;
let nihtanApi 	= db.nihtanApi;

module.exports = {
	payoutHandler : {
		player(data) {
			let anteBonusOdds = data.anteBonusOdds;
			let anteBonusPlusAmount =+ data.anteBonusPlusAmount || 0; //bp
			let bh            = data.bh;
			let bonusAmount   = data.bonusAmount;
			let bonus = data.bonus;

			let totalWin      = 0;
			let totalBet      = bh.ante.bet + bh.flop.bet + bh.turn.bet + bh.river.bet + bh[bonus].bet + (bh.bonusplus ? bh.bonusplus.bet : 0);
			let lostBet       = 0;
			let totalWinning  = bh.flop.bet + bh.turn.bet + bh.river.bet;
			let totalRolling  = bh.ante.bet + bh.flop.bet + bh.turn.bet + bh.river.bet + bh[bonus].bet + (bh.bonusplus ? bh.bonusplus.bet : 0);
			let totalLost     = 0;

	    	bh.flop.win  = bh.flop.bet * 2;
			bh.turn.win  = bh.turn.bet * 2;
			bh.river.win = bh.river.bet * 2;

	    	if (anteBonusOdds) {
	    		bh.ante.win = bh.ante.bet * 2;
	    		totalWinning += bh.ante.bet;
	    	}
	    	else {
	    		bh.ante.win = bh.ante.bet;
	    	    totalRolling = totalRolling - bh.ante.bet;
	    	}

	    	if (bonusAmount) {
	    		let bonusWin = bh[bonus].bet * bonusAmount;
	    		bh[bonus].win = bonusWin + bh[bonus].bet;
	    		totalWinning += bonusWin;
	    	}
	    	else {
	    		lostBet = bh[bonus].bet;
	    	}

			if (anteBonusPlusAmount && bonus == 'pocket') {
				let bonusPlusWin = (bh.bonusplus ? bh.bonusplus.bet : 0) * anteBonusPlusAmount;
				bh.bonusplus.win = bonusPlusWin + (bh.bonusplus ? bh.bonusplus.bet : 0);
				totalWinning += bonusPlusWin;
			}
			else {
				lostBet += (bh.bonusplus ? bh.bonusplus.bet : 0);
			}

	    	totalWin  = totalBet + totalWinning - lostBet;
	    	totalLost = lostBet;

	    	return {
	    		totalWin,
	    		totalLost,
	    		totalBet,
	    		totalWinning,
	    		totalRolling,
	    		bh
	    	};
	    },
	    tie(data){
	    	let bh           = data.bh;
	    	let bonusAmount  = data.bonusAmount;
			let anteBonusPlusAmount = +data.anteBonusPlusAmount || 0;//bp
			let bonus = data.bonus;

	    	let totalBet     = bh.ante.bet + bh.flop.bet + bh.turn.bet + bh.river.bet + bh[bonus].bet + (bh.bonusplus ? bh.bonusplus.bet : 0);
	    	let totalWin     = totalBet - bh[bonus].bet - (bh.bonusplus ? bh.bonusplus.bet : 0);
	    	let totalWinning = 0;
	    	let totalRolling = 0;
	    	let totalLost    = 0;

	    	if(bonusAmount){
	    		let bonusWin = bh[bonus].bet * bonusAmount;
	    		totalWinning += bonusWin;
	    		bh[bonus].win = bonusWin + bh[bonus].bet;
	    		totalWin += bh[bonus].bet; // if bonus win, then bonus bet is refunded also
	    		totalRolling = bh[bonus].bet;
	    	} else {
	    		totalLost = bh[bonus].bet;
	    		totalRolling = bh[bonus].bet;
	    	}

			if (anteBonusPlusAmount && bonus == 'pocket') {
				let bonusPlusWin = (bh.bonusplus ? bh.bonusplus.bet : 0) * anteBonusPlusAmount;
				totalWinning += bonusPlusWin;
				bh.bonusplus.win = bonusPlusWin + (bh.bonusplus ? bh.bonusplus.bet : 0);
				totalWin += (bh.bonusplus ? bh.bonusplus.bet : 0); // if bonus win, then bonus bet is refunded also
				totalRolling += (bh.bonusplus ? bh.bonusplus.bet : 0);
			} else {
				totalLost += (bh.bonusplus ? bh.bonusplus.bet : 0);
				totalRolling += (bh.bonusplus ? bh.bonusplus.bet : 0);
			}

			totalWin  += totalWinning;

			bh.ante.win = bh.ante.bet;
			bh.flop.win = bh.flop.bet;
			bh.turn.win = bh.turn.bet;
			bh.river.win = bh.river.bet;

	    	return {
	    		totalWin,
	    		totalLost,
	    		totalBet,
	    		totalWinning,
	    		totalRolling,
	    		bh
	    	};
	    },
	    dealer(data){
	    	let bh           = data.bh;
	    	let bonusAmount  = data.bonusAmount;
			let anteBonusPlusAmount = +data.anteBonusPlusAmount || 0;//bp
			let bonus = data.bonus;

	    	let totalBet     = bh.ante.bet + bh.flop.bet + bh.turn.bet + bh.river.bet + bh[bonus].bet + (bh.bonusplus ? bh.bonusplus.bet : 0);
	    	let totalWin     = 0;
	    	let totalWinning = 0;
	    	let totalRolling = totalBet;
	    	let totalLost    = bh.ante.bet + bh.flop.bet + bh.turn.bet + bh.river.bet;

	    	if(bonusAmount){
	    		let bonusWin = bh[bonus].bet * bonusAmount;
	    		bh[bonus].win = bonusWin + bh[bonus].bet;
	    		totalWinning += bonusWin;
	    		totalWin +=  bh[bonus].bet;
	    	} else {
	    		totalLost += bh[bonus].bet;
	    	}

			if(anteBonusPlusAmount && bonus == 'pocket'){
				let bonusPlusWin = (bh.bonusplus ? bh.bonusplus.bet : 0) * anteBonusPlusAmount;
				bh.bonusplus.win = bonusPlusWin + (bh.bonusplus ? bh.bonusplus.bet : 0);
				totalWinning += bonusPlusWin;
				totalWin += (bh.bonusplus ? bh.bonusplus.bet : 0);
			} else {
				totalLost += (bh.bonusplus ? bh.bonusplus.bet : 0);
			}

			totalWin += totalWinning;
	    	return {
	    		totalWin,
	    		totalLost,
	    		totalBet,
	    		totalWinning,
	    		totalRolling,
	    		bh
	    	};

	    }
	},	
	processBets(args){
		return new Promise((res, rej)=>{
			let currentRound = args.round;
			let roundNum            = args.roundNum;
			let tableId             = args.tableId;
			let winner              = args.regionalResult.winSide;
			let bets                = args.regionalResult.bets;
			let bonusAmount         = args.regionalResult.gameResult.bonusAmount;
			let pocketAmount        = args.regionalResult.gameResult.pocketAmount;
			let anteBonusOdds       = args.regionalResult.playerCardRank;
			let anteBonusPlusAmount = args.regionalResult.gameResult.bonusplusAmount;
			let result              = args.regionalResult;
			let dealerId          = args.dealerId;
			result.finalResult.game_info = args.gameInfo;
			let betsJson        = [];
			let queryBH         = '';
			let queryTB         = '';
			let queryTW         = '';
			let queryTWin       = '';
			let queryTLost      = '';
			let queryBetRolling = '';
			let idArray         = [];
			let userMoney       = '';
			let userIds         = [];
			let userInfo        = [];
			let apiUserInfo     = [];
			let betsWinning     = '';
			let roundWins       = 0;
			let roundBets       = 0;
			let totalRolling    = 0;
			dealerId = (typeof(dealerId)=='string')?parseInt(dealerId):dealerId;
		console.log('result ====>', result.finalResult);
			seq.transaction({
                autocommit     : true,
                isolationLevel : db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            })
            .then(t=>{
				return currentRound.update(result.finalResult)
				.then((r)=>{
					t.commit();
				}).catch(err=>{
			console.log('errrrrrrrrrrrror==>',err);		
                    rej(err);
                    t.rollback();
                });
			})
			.then(()=>{
				pokerORM.gameMarks.insertOrUpdate({
					mark:{mark:winner[0].toUpperCase()},
                        		round_id : args.round.id,
					table_id : tableId
				}).catch(e=>{console.log(e);rej('server error at game Marks');});
			})
			.then(()=>{
				result.updated_at = moment().utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
				result.created_at = moment(result.created_at).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
					if(bets.length){
						_.each(bets,(bet,index)=>{
							
							let bh = JSON.parse(bet.bet_history);
							let bonus = bet.type == 'b' ? 'pocket' : 'bonus';
							let bonusAmountUsed = bet.type == 'b' ? pocketAmount : bonusAmount;
							
							let totalBet = bh.ante.bet + bh.flop.bet + bh.turn.bet + bh.river.bet + bh[bonus].bet + (bh.bonusplus ? bh.bonusplus.bet : 0);
								
							//let totalWin       = bet.total_winning;
							let moneyPayToUser = 0;
							//let totalLost = 0;
							let totalUserMoney = '';
							
							let betRange = '';
							// anteBonusAmount is the bonus for ante
							let anteBonusAmount = 0;
							// get payouts on winning cases
							let resultHolder = this.payoutHandler[winner]({
								bh,
								bonusAmount : bonusAmountUsed,
								anteBonusOdds,
								anteBonusPlusAmount,
								bonus
							});	
							bh.ante.user_money = (bh.ante.user_money)?bh.ante.user_money:0;
							bh.flop.user_money = (bh.flop.user_money)?bh.flop.user_money:0;
							bh.turn.user_money = (bh.turn.user_money)?bh.turn.user_money:0;
							bh.river.user_money = (bh.river.user_money)?bh.river.user_money:0;

							totalUserMoney = bet.user.get('money') + resultHolder.totalWin;
							
							if(bh.flop.bet < 1) {
								//bonusplus
								if(bonus == 'pocket'){
									resultHolder.bh.bonusplus.win = 0;
								}
								// user folded
								resultHolder.bh.ante.win = 0;
								resultHolder.bh.flop.win = 0;
								resultHolder.bh.turn.win = 0;
								resultHolder.bh.river.win = 0;
								resultHolder.bh[bonus].win = 0;
								resultHolder.totalWinning = 0;
								resultHolder.totalWin = 0;
								resultHolder.totalRolling = totalBet;
								resultHolder.totalLost = totalBet;
								totalUserMoney = bet.user.get('money');
							}
							let betuser = bet.user.get();
							let temptotalWin = (betuser.vendor.integration_type == 'transfer')?resultHolder.totalWin:0;
							userMoney += 'WHEN ' + bet.user_id + ' THEN u.money+' +  temptotalWin + ' ';
							queryTLost += 'WHEN ' + bet.id + ' THEN ' + resultHolder.totalLost + ' ';
							queryBetRolling += 'WHEN ' + bet.id + ' THEN ' + resultHolder.totalRolling + ' ';
							queryBH += 'WHEN ' + bet.id + ' THEN \'' +  JSON.stringify(resultHolder.bh) + '\' ';
							queryTB += 'WHEN ' + bet.id + ' THEN ' +  resultHolder.totalBet + ' ';
							queryTW += 'WHEN ' + bet.id + ' THEN ' +  resultHolder.totalWinning + ' '; // total winning <-- raw money won
							queryTWin += 'WHEN ' + bet.id + ' THEN ' +  resultHolder.totalWin + ' '; // total win <--- total money won with bets

							userInfo.push({
								id:bet.user_id,
								total_winning:Math.round(resultHolder.totalWin * 100) / 100,
								money:totalUserMoney,
								total_lost:resultHolder.totalLost,
								bets:bh,
								type:bet.type
							});

							bh.created_at = moment(bh.created_at).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
							bh.updated_at = moment(bh.updated_at).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');

							apiUserInfo.push({
								id		: bet.user.get('id'),
								user_id       	: bet.user.get('user_id'),
								user_name     	: bet.user.get('user_name'),
								vendor_id     	: bet.user.get('vendor_id'),
								type            : bet.type,
								user_type       : bet.user.user_type,
								bets          	: bh,
								bet_range     	: bet.bet_range,
								total_bet     	: totalBet,
								total_rolling 	: resultHolder.totalRolling,
								total_win     	: resultHolder.totalWin,
								total_lost    	: resultHolder.totalLost,
								bet_id 		: bets.bet_id,
								session_id      : bets.session_id,
								created_at    	: moment(bet.created_at).utcOffset(0).format('YYYY-MM-DD HH:mm:ss'),
								currency      	: betuser.currency || betuser.vendor.currency,
								multiplier    	: betuser.denomination || betuser.vendor.multiplier
							});

							roundWins += resultHolder.totalWin;
							roundBets += resultHolder.totalBet;
						});

							let rawQuery = "UPDATE `bets` as `b` "
								+ "JOIN `nihtan_api`.`users` as `u` ON `b`.`user_id` = `u`.`id` "
								+ "JOIN `rounds` as `r` ON `r`.`id` = `b`.`round_id` "
								+ "SET `b`.`bet_history` = (CASE `b`.`id` "+queryBH+" END),"
								+ "`b`.`total_bet` = (CASE `b`.`id` "+queryTB+" END),"
								+ "`b`.`total_winning` = (CASE `b`.`id` "+queryTW+" END),"
								+ "`b`.`total_win` = (CASE `b`.`id` "+queryTWin+" END),"
								+ "`b`.`total_lost` = (CASE `b`.`id` "+queryTLost+" END),"
								+ "`b`.`total_rolling` = (CASE `b`.`id` "+queryBetRolling+" END),"
								+ "`u`.`money` = (CASE `u`.`id` "+userMoney+" END),"
								+ "`b`.`updated_at`=NOW(),"
								+ "`u`.`updated_at`=NOW(),"
								+ "`r`.`updated_at`=NOW()"
								+ " WHERE `r`.`round_num` = " + roundNum
								+ "   AND `r`.`table_id` = " + tableId;
							console.log('rawQuery ===>', rawQuery);
							seq.transaction({
								autocommit : true,
								isolationLevel : db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
							}).then(t=>{
								return seq.query(rawQuery, {transaction: t})
								.then(()=>t.commit())
								.catch(err=>{
									t.rollback();
									rej(err);
								});
							}).then(()=>{
								nihtanApi.dealers.findOne({where:{id:dealerId}}).then(d=>{
									this.sendToAPIServer('Poker', result, apiUserInfo,d.real_name);
									res({roundWins,roundNum,userInfo});
								});								
							}).catch(err=>{
								rej(err);
							});
					} else {
						nihtanApi.dealers.findOne({where:{id:dealerId}}).then(d=>{
							this.sendToAPIServer('Poker', result, apiUserInfo,d.real_name);
							res({roundWins,roundNum,userInfo:[]});
						});
					}
		}).catch(err=>{rej(err);});
		});
	},

    sendToAPIServer (game, result, data,dealer) {

		console.log('SEND TO API',{
            method: 'POST',
            uri: process.env.API_HISTORY_URL,
            body: {
                game,
                table       : result.tableId,
                round_no    : result.roundNum,
                game_info   : result.gameInfo,
                game_result : result.gameResult,
                created_at  : result.created_at,
                resulted_at : result.updated_at,
                dealer 		: dealer,
                data		: data
            },
            json: true
        });
	//	return;
         request({
            method: 'POST',
            uri: process.env.API_HISTORY_URL,
            body: {
                game,
                table       : result.tableId,
                round_no    : result.roundNum,
                game_info   : result.gameInfo,
                game_result : result.gameResult,
                created_at  : result.created_at,
                resulted_at : result.updated_at,
                dealer 		: dealer,
                data		: data
            },
            json: true
        }).catch(e=>console.log(e));
    }
};

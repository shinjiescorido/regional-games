"use strict";
const db     = require('../db/index');
const _      = require('lodash');
const cons   = require('./constants.js');
const cfg      = require('../config');
const redis    = require("redis")
  , publisher = redis.createClient(cfg.redis);
module.exports = {
	betsCalc : {
		'Baccarat'     : require('./bets/bcBets'),
		'Poker'        : require('./bets/pokerBets'),
		'Dragon-Tiger' : require('./bets/dtBets'),
		'Sicbo'        : require('./bets/sicboBets'),
		'Pai-Gow'      : require('./bets/paigowBets')
	},
	options : {
		'Baccarat' : {
			model : db.bc,
			gameInfo : {
                banker1:null,
                banker2:null,
                banker3:null,
                player1:null,
                player2:null,
                player3:null
            }
		},
		'Dragon-Tiger' : {
			model : db.dt,
			gameInfo : { 
				dragon : null,
				tiger  : null,
				burn   : null
			}
		},
		'Poker' : {
			model : db.poker,
			gameInfo : {
				dealer : [],
				player : [],
				flop   : [],
				river  : null,
				turn   : null,
				burn   : []
			}
		},
		'Sicbo' : {
			name : 'sicbo',
			model : db.sicbo,
			gameInfo : {
				one:"", 
				two:"",
				three:""
			}
		},
		'Pai-Gow' : {
			name : 'paigow',
			model : db.paigow,
			gameInfo : {
				"dices": [null, null],
				"setCount": null,//setCount == 1 ? 5 : setCount - 1
				"seat": null,
				"tiles": {"up": [null, null], "down": [null, null], "banker": [null, null], "heaven": [null, null]}
			}
		}
	},
	deleteRoom(data) {
		return this.options[data.gameName].model.rooms.update({active:'0'},{where:{id:data.roomId}});
	},
	clearRoundNumOne (gn) {
		return this.options[gn].model.rounds.findOne({
			where : { round_num : 2}
		})
		.then(r=>{
			return this.options[gn].model.bets.find({where:{round_id : r.id}})
			.then(b=>{
				if(b)
					b.destroy();
			})
			.then(()=>{if(r)r.destroy()})
			.catch(()=>{if(r)r.destroy()});
		})
		.catch(e=>false);
	},
	mockBets (bh,gn) {
		return this.options[gn].model.rounds.findOne({
			where : { round_num : 2}
		}).then(r=>{
			return this.options[gn].model.bets.create({
						round_id : r.id,
						bet_history : bh,
						user_id : 1,
						type : 'r',
						total_bet : 0.00,
						total_winning : 0.00,
						total_win : 0.00,
						total_lost : 0.00,
						total_rolling : 0.00
					})
		});
	},
	newround (data){
		return this.options[data.gameName].model.sequelize.transaction({
                autocommit     : true,
                isolationLevel : db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }).then(t=>{
			return this.options[data.gameName].model.rounds.create({
				dealer_id 	: data.dealerId,
				game_info 	: this.options[data.gameName].gameInfo,
				round_num 	: data.roundNum,
				table_id  	: data.tableId,
				status 		: "S"
			}, {transaction: t}).then(()=>{
				 t.commit();
				 return 'success';
			})
			.catch(err=>{
				console.log('error=>',err);
                 t.rollback();
				 throw 'error on new rounds';
            });
		})
		.then((r)=>{
			return r;
		})
		.catch(e=>{
			return 'error on new rounds';
		});
	},
	setroundprogress (data){
		return this.options[data.gameName].model.sequelize.transaction({
                autocommit     : true,
                isolationLevel : db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }).then(t=>{
			return this.options[data.gameName].model.rounds.update({
				status : "P"
			}, {
				where:{
					round_num 	: data.roundNum,
					table_id  	: data.tableId
				}
			}, {transaction: t}).then(()=>{
				console.log('setroundprogress done');
				 t.commit();
				 return 'success';
			})
			.catch(err=>{
                 t.rollback();
				 throw 'error on new setroundprogress';
            });
		})
		.then((r)=>{
			if( cons.roomGames[data.gameName] ){
				this.betsCalc[data.gameName].fnNoMoreBet(data.tableId, data.roundNum, 123);
			}
			return r;
		})
		.catch(e=>{
			return 'error on new rounds';
		});
	},
	displayresults(data){
		return this.options[data.gameName].model.rounds.find({
                where      : { table_id : data.tableId, round_num : data.roundNum },
                include    : [{
                    model      : this.options[data.gameName].model.bets,
                    //attributes : cons.attBet,
                    include    : [{
                        model     : db.nihtanApi.users,
                        attributes: cons.attUser,
                        include   : [{
                            model     : db.nihtanApi.vendors,
                            attributes: cons.attVendor,
                            plain     : true
                        }]
					}]
				}],
                attributes : cons.attRound,
                plain      : true
            }).then(round => {
				data.regionalResult.bets = (round && round.bets)?round.bets:{};
				return this.betsCalc[data.gameName].processBets ({
					round,
					gameInfo      : (data.gameInfo)?data.gameInfo:null,
					gameResult    : (data.gameResult)?data.gameResult:null,
					tableId       :data.tableId, 
					regionalResult:data.regionalResult, 
					gameName      :data.gameName, 
					dealerName    :(data.dealerName)?data.dealerName:null,
					dealerId      :(data.dealerId)?data.dealerId:1, 
					roundNum      :data.roundNum
				})
				.then(returnedData=>{
					if(data.gameName == 'Sicbo')
					console.log('success returnDat==>',returnedData.userInfo);
					// publish
					publisher.publish('game-servers',JSON.stringify({
						 eventName : 'regionalcredits',
						 gameName  : data.gameName,
						 tableId   : data.tableId,
						 userInfo  : returnedData.userInfo
					 }));
					return returnedData;
				}).catch(e=>{
					return 'error on displayresults';
				});
			});
	}
};

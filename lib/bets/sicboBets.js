'use strict';

/*
 |--------------------------------------------------------------------------
 | BetsCalculator v1.1
 |--------------------------------------------------------------------------
 | Author : Shinji Escorido
 | Processing of bets
 |
 */

const _  		= require("lodash");
const db        = require("../../db" );
const request 	= require("request-promise");
const moment 	= require("moment");
const fs 		= require("fs");
let seq = db.sicbo.sequelize;

module.exports = {
    betlogs : null,
    bets : {},
    multipliers : {
        small : 1,
        big : 1,
        even : 1,
        odd : 1,
        double : 8,
        triple : 150,
        anytriple : 24,
        domino : 5,
        group : 7,
        dice : 1,
        sum : {
            4: 50,
            5: 18,
            6: 14,
            7: 12,
            8: 8,
            9: 6,
            10: 6,
            11: 6,
            12: 6,
            13: 8,
            14: 12,
            15: 14,
            16: 18,
            17: 50
        }
    },
	fnNoMoreBet (tableId, roundNum, dealerId) {
        let bankerQuery = "";

        bankerQuery += "SELECT T2.user_id";
        bankerQuery += "     , T1.round_id";
        bankerQuery += "     , T1.room_id";
        bankerQuery += "     , T1.type";
        bankerQuery += "     , T1.bet_history";
        bankerQuery += "     , T1.play_type";
        bankerQuery += "  FROM sicbo.bets AS T1";
        bankerQuery += "  LEFT JOIN sicbo.rooms AS T2";
        bankerQuery += "    ON T1.room_id = T2.id";
        bankerQuery += "  LEFT JOIN sicbo.rounds AS T3";
        bankerQuery += "    ON T1.round_id = T3.id";
        bankerQuery += " WHERE T3.table_id = " + tableId;
        bankerQuery += "   AND T3.round_num = " + roundNum;
        bankerQuery += "   AND T1.room_id IS NOT NULL";
        bankerQuery += " ORDER BY T1.room_id";

        return seq.query(bankerQuery, { type : db.Sequelize.QueryTypes.SELECT }).then(banker => {
            let dataCnt = banker.length;

            let roomId = 0;
            let bankerId = 0;
            let totalBet = 0;
            let bankerBetHistory = new Array();

            let bankerBet = {};
            let bankerBetMoney = [];
            let userCnt = [];

            let tmpBanker = banker;

            if (!_.isEmpty(tmpBanker)) {
                _.each(tmpBanker, (bets, index) => {
                    let data = null;

                    if (typeof(bets.bet_history) == "string") {
                        data = JSON.parse(bets.bet_history);
                    }
                    else {
                        data = bets.bet_history;
                    }

                    if (index == 0) {
                        roomId = bets.room_id;
                        bankerId = bets.user_id;
                    }

                    if (roomId != bets.room_id) {
                        // Insert
                        for (let key in bankerBetMoney) {
                            totalBet += bankerBetMoney[key];

                            bankerBet = {
                                bet         : key,
                                user_cnt    : userCnt[key],
                                bet_money   : bankerBetMoney[key],
                                win_money   : 0,
                                lose_money  : 0
                            };

                            bankerBetHistory.push(bankerBet);
				
                        }

                        this.fnCreateBankerBet (tableId, roundNum, dealerId, bets.round_id, roomId, bankerId, bankerBetHistory, totalBet);

                        bankerBetMoney = [];

                        totalBet = 0;
                        roomId = bets.room_id;
                        bankerId = bets.user_id;

                        bankerBetHistory = new Array();
                    }

                    _.each(data, (betData, index) => {
                        let tmpBetData = null;

                        if (typeof(betData) == "string") {
                            tmpBetData = JSON.parse(betData);
                        }
                        else {
                            tmpBetData = betData;
                        }

                        if (_.includes(tmpBetData.bet, "odd")) {
                            if (bankerBetMoney["odd"] == undefined) {
                                bankerBetMoney["odd"] = parseInt(tmpBetData.bet_money);
                                userCnt["odd"] = 1;
                            }
                            else {
                                bankerBetMoney["odd"] = parseInt(bankerBetMoney["odd"]) + parseInt(tmpBetData.bet_money);
                                userCnt["odd"] = parseInt(userCnt["odd"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "even")) {
                            if (bankerBetMoney["even"] == undefined) {
                                bankerBetMoney["even"] = parseInt(tmpBetData.bet_money);
                                userCnt["even"] = 1;
                            }
                            else {
                                bankerBetMoney["even"] = parseInt(bankerBetMoney["even"]) + parseInt(tmpBetData.bet_money);
                                userCnt["even"] = parseInt(userCnt["even"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "big")) {
                            if (bankerBetMoney["big"] == undefined) {
                                bankerBetMoney["big"] = parseInt(tmpBetData.bet_money);
                                userCnt["big"] = 1;
                            }
                            else {
                                bankerBetMoney["big"] = parseInt(bankerBetMoney["big"]) + parseInt(tmpBetData.bet_money);
                                userCnt["big"] = parseInt(userCnt["big"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "small")) {
                            if (bankerBetMoney["small"] == undefined) {
                                bankerBetMoney["small"] = parseInt(tmpBetData.bet_money);
                                userCnt["small"] = 1;
                            }
                            else {
                                bankerBetMoney["small"] = parseInt(bankerBetMoney["small"]) + parseInt(tmpBetData.bet_money);
                                userCnt["small"] = parseInt(userCnt["small"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "anytriple")) {
                            if (bankerBetMoney["anytriple"] == undefined) {
                                bankerBetMoney["anytriple"] = parseInt(tmpBetData.bet_money);
                                userCnt["anytriple"] = 1;
                            }
                            else {
                                bankerBetMoney["anytriple"] = parseInt(bankerBetMoney["anytriple"]) + parseInt(tmpBetData.bet_money);
                                userCnt["anytriple"] = parseInt(userCnt["anytriple"]) + 1;
                            }
                        }

                        else if (_.includes(tmpBetData.bet, "double-1")) {
                            if (bankerBetMoney["double-1"] == undefined) {
                                bankerBetMoney["double-1"] = parseInt(tmpBetData.bet_money);
                                userCnt["double-1"] = 1;
                            }
                            else {
                                bankerBetMoney["double-1"] = parseInt(bankerBetMoney["double-1"]) + parseInt(tmpBetData.bet_money);
                                userCnt["double-1"] = parseInt(userCnt["double-1"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "double-2")) {
                            if (bankerBetMoney["double-2"] == undefined) {
                                bankerBetMoney["double-2"] = parseInt(tmpBetData.bet_money);
                                userCnt["double-2"] = 1;
                            }
                            else {
                                bankerBetMoney["double-2"] = parseInt(bankerBetMoney["double-2"]) + parseInt(tmpBetData.bet_money);
                                userCnt["double-2"] = parseInt(userCnt["double-2"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "double-3")) {
                            if (bankerBetMoney["double-3"] == undefined) {
                                bankerBetMoney["double-3"] = parseInt(tmpBetData.bet_money);
                                userCnt["double-3"] = 1;
                            }
                            else {
                                bankerBetMoney["double-3"] = parseInt(bankerBetMoney["double-3"]) + parseInt(tmpBetData.bet_money);
                                userCnt["double-3"] = parseInt(userCnt["double-3"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "double-4")) {
                            if (bankerBetMoney["double-4"] == undefined) {
                                bankerBetMoney["double-4"] = parseInt(tmpBetData.bet_money);
                                userCnt["double-4"] = 1;
                            }
                            else {
                                bankerBetMoney["double-4"] = parseInt(bankerBetMoney["double-4"]) + parseInt(tmpBetData.bet_money);
                                userCnt["double-4"] = parseInt(userCnt["double-4"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "double-5")) {
                            if (bankerBetMoney["double-5"] == undefined) {
                                bankerBetMoney["double-5"] = parseInt(tmpBetData.bet_money);
                                userCnt["double-5"] = 1;
                            }
                            else {
                                bankerBetMoney["double-5"] = parseInt(bankerBetMoney["double-5"]) + parseInt(tmpBetData.bet_money);
                                userCnt["double-5"] = parseInt(userCnt["double-5"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "double-6")) {
                            if (bankerBetMoney["double-6"] == undefined) {
                                bankerBetMoney["double-6"] = parseInt(tmpBetData.bet_money);
                                userCnt["double-6"] = 1;
                            }
                            else {
                                bankerBetMoney["double-6"] = parseInt(bankerBetMoney["double-6"]) + parseInt(tmpBetData.bet_money);
                                userCnt["double-6"] = parseInt(userCnt["double-6"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "triple-1")) {
                            if (bankerBetMoney["triple-1"] == undefined) {
                                bankerBetMoney["triple-1"] = parseInt(tmpBetData.bet_money);
                                userCnt["triple-1"] = 1;
                            }
                            else {
                                bankerBetMoney["triple-1"] = parseInt(bankerBetMoney["triple-1"]) + parseInt(tmpBetData.bet_money);
                                userCnt["triple-1"] = parseInt(userCnt["triple-1"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "triple-2")) {
                            if (bankerBetMoney["triple-2"] == undefined) {
                                bankerBetMoney["triple-2"] = parseInt(tmpBetData.bet_money);
                                userCnt["triple-2"] = 1;
                            }
                            else {
                                bankerBetMoney["triple-2"] = parseInt(bankerBetMoney["triple-2"]) + parseInt(tmpBetData.bet_money);
                                userCnt["triple-2"] = parseInt(userCnt["triple-2"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "triple-3")) {
                            if (bankerBetMoney["triple-3"] == undefined) {
                                bankerBetMoney["triple-3"] = parseInt(tmpBetData.bet_money);
                                userCnt["triple-3"] = 1;
                            }
                            else {
                                bankerBetMoney["triple-3"] = parseInt(bankerBetMoney["triple-3"]) + parseInt(tmpBetData.bet_money);
                                userCnt["triple-3"] = parseInt(userCnt["triple-3"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "triple-4")) {
                            if (bankerBetMoney["triple-4"] == undefined) {
                                bankerBetMoney["triple-4"] = parseInt(tmpBetData.bet_money);
                                userCnt["triple-4"] = 1;
                            }
                            else {
                                bankerBetMoney["triple-4"] = parseInt(bankerBetMoney["triple-4"]) + parseInt(tmpBetData.bet_money);
                                userCnt["triple-4"] = parseInt(userCnt["triple-4"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "triple-5")) {
                            if (bankerBetMoney["triple-5"] == undefined) {
                                bankerBetMoney["triple-5"] = parseInt(tmpBetData.bet_money);
                                userCnt["triple-5"] = 1;
                            }
                            else {
                                bankerBetMoney["triple-5"] = parseInt(bankerBetMoney["triple-5"]) + parseInt(tmpBetData.bet_money);
                                userCnt["triple-5"] = parseInt(userCnt["triple-5"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "triple-6")) {
                            if (bankerBetMoney["triple-6"] == undefined) {
                                bankerBetMoney["triple-6"] = parseInt(tmpBetData.bet_money);
                                userCnt["triple-6"] = 1;
                            }
                            else {
                                bankerBetMoney["triple-6"] = parseInt(bankerBetMoney["triple-6"]) + parseInt(tmpBetData.bet_money);
                                userCnt["triple-6"] = parseInt(userCnt["triple-6"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-4")) {
                            if (bankerBetMoney["sum-4"] == undefined) {
                                bankerBetMoney["sum-4"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-4"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-4"] = parseInt(bankerBetMoney["sum-4"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-4"] = parseInt(userCnt["sum-4"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-5")) {
                            if (bankerBetMoney["sum-5"] == undefined) {
                                bankerBetMoney["sum-5"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-5"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-5"] = parseInt(bankerBetMoney["sum-5"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-5"] = parseInt(userCnt["sum-5"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-6")) {
                            if (bankerBetMoney["sum-6"] == undefined) {
                                bankerBetMoney["sum-6"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-6"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-6"] = parseInt(bankerBetMoney["sum-6"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-6"] = parseInt(userCnt["sum-6"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-7")) {
                            if (bankerBetMoney["sum-7"] == undefined) {
                                bankerBetMoney["sum-7"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-7"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-7"] = parseInt(bankerBetMoney["sum-7"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-7"] = parseInt(userCnt["sum-7"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-8")) {
                            if (bankerBetMoney["sum-8"] == undefined) {
                                bankerBetMoney["sum-8"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-8"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-8"] = parseInt(bankerBetMoney["sum-8"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-8"] = parseInt(userCnt["sum-8"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-9")) {
                            if (bankerBetMoney["sum-9"] == undefined) {
                                bankerBetMoney["sum-9"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-9"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-9"] = parseInt(bankerBetMoney["sum-9"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-9"] = parseInt(userCnt["sum-9"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-10")) {
                            if (bankerBetMoney["sum-10"] == undefined) {
                                bankerBetMoney["sum-10"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-10"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-10"] = parseInt(bankerBetMoney["sum-10"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-10"] = parseInt(userCnt["sum-10"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-11")) {
                            if (bankerBetMoney["sum-11"] == undefined) {
                                bankerBetMoney["sum-11"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-11"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-11"] = parseInt(bankerBetMoney["sum-11"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-11"] = parseInt(userCnt["sum-11"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-12")) {
                            if (bankerBetMoney["sum-12"] == undefined) {
                                bankerBetMoney["sum-12"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-12"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-12"] = parseInt(bankerBetMoney["sum-12"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-12"] = parseInt(userCnt["sum-12"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-13")) {
                            if (bankerBetMoney["sum-13"] == undefined) {
                                bankerBetMoney["sum-13"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-13"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-13"] = parseInt(bankerBetMoney["sum-13"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-13"] = parseInt(userCnt["sum-13"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-14")) {
                            if (bankerBetMoney["sum-14"] == undefined) {
                                bankerBetMoney["sum-14"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-14"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-14"] = parseInt(bankerBetMoney["sum-14"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-14"] = parseInt(userCnt["sum-14"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-15")) {
                            if (bankerBetMoney["sum-15"] == undefined) {
                                bankerBetMoney["sum-15"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-15"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-15"] = parseInt(bankerBetMoney["sum-15"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-15"] = parseInt(userCnt["sum-15"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-16")) {
                            if (bankerBetMoney["sum-16"] == undefined) {
                                bankerBetMoney["sum-16"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-16"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-16"] = parseInt(bankerBetMoney["sum-16"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-16"] = parseInt(userCnt["sum-16"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "sum-17")) {
                            if (bankerBetMoney["sum-17"] == undefined) {
                                bankerBetMoney["sum-17"] = parseInt(tmpBetData.bet_money);
                                userCnt["sum-17"] = 1;
                            }
                            else {
                                bankerBetMoney["sum-17"] = parseInt(bankerBetMoney["sum-17"]) + parseInt(tmpBetData.bet_money);
                                userCnt["sum-17"] = parseInt(userCnt["sum-17"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-1&2")) {
                            if (bankerBetMoney["domino-1&2"] == undefined) {
                                bankerBetMoney["domino-1&2"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-1&2"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-1&2"] = parseInt(bankerBetMoney["domino-1&2"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-1&2"] = parseInt(userCnt["domino-1&2"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-1&3")) {
                            if (bankerBetMoney["domino-1&3"] == undefined) {
                                bankerBetMoney["domino-1&3"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-1&3"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-1&3"] = parseInt(bankerBetMoney["domino-1&3"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-1&3"] = parseInt(userCnt["domino-1&3"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-1&4")) {
                            if (bankerBetMoney["domino-1&4"] == undefined) {
                                bankerBetMoney["domino-1&4"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-1&4"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-1&4"] = parseInt(bankerBetMoney["domino-1&4"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-1&4"] = parseInt(userCnt["domino-1&4"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-1&5")) {
                            if (bankerBetMoney["domino-1&5"] == undefined) {
                                bankerBetMoney["domino-1&5"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-1&5"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-1&5"] = parseInt(bankerBetMoney["domino-1&5"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-1&5"] = parseInt(userCnt["domino-1&5"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-1&6")) {
                            if (bankerBetMoney["domino-1&6"] == undefined) {
                                bankerBetMoney["domino-1&6"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-1&6"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-1&6"] = parseInt(bankerBetMoney["domino-1&6"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-1&6"] = parseInt(userCnt["domino-1&6"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-2&3")) {
                            if (bankerBetMoney["domino-2&3"] == undefined) {
                                bankerBetMoney["domino-2&3"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-2&3"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-2&3"] = parseInt(bankerBetMoney["domino-2&3"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-2&3"] = parseInt(userCnt["domino-2&3"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-2&4")) {
                            if (bankerBetMoney["domino-2&4"] == undefined) {
                                bankerBetMoney["domino-2&4"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-2&4"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-2&4"] = parseInt(bankerBetMoney["domino-2&4"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-2&4"] = parseInt(userCnt["domino-2&4"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-2&5")) {
                            if (bankerBetMoney["domino-2&5"] == undefined) {
                                bankerBetMoney["domino-2&5"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-2&5"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-2&5"] = parseInt(bankerBetMoney["domino-2&5"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-2&5"] = parseInt(userCnt["domino-2&5"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-2&6")) {
                            if (bankerBetMoney["domino-2&6"] == undefined) {
                                bankerBetMoney["domino-2&6"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-2&6"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-2&6"] = parseInt(bankerBetMoney["domino-2&6"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-2&6"] = parseInt(userCnt["domino-2&6"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-3&4")) {
                            if (bankerBetMoney["domino-3&4"] == undefined) {
                                bankerBetMoney["domino-3&4"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-3&4"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-3&4"] = parseInt(bankerBetMoney["domino-3&4"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-3&4"] = parseInt(userCnt["domino-3&4"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-3&5")) {
                            if (bankerBetMoney["domino-3&5"] == undefined) {
                                bankerBetMoney["domino-3&5"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-3&5"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-3&5"] = parseInt(bankerBetMoney["domino-3&5"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-3&5"] = parseInt(userCnt["domino-3&5"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-3&6")) {
                            if (bankerBetMoney["domino-3&6"] == undefined) {
                                bankerBetMoney["domino-3&6"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-3&6"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-3&6"] = parseInt(bankerBetMoney["domino-3&6"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-3&6"] = parseInt(userCnt["domino-3&6"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-4&5")) {
                            if (bankerBetMoney["domino-4&5"] == undefined) {
                                bankerBetMoney["domino-4&5"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-4&5"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-4&5"] = parseInt(bankerBetMoney["domino-4&5"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-4&5"] = parseInt(userCnt["domino-4&5"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-4&6")) {
                            if (bankerBetMoney["domino-4&6"] == undefined) {
                                bankerBetMoney["domino-4&6"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-4&6"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-4&6"] = parseInt(bankerBetMoney["domino-4&6"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-4&6"] = parseInt(userCnt["domino-4&6"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "domino-5&6")) {
                            if (bankerBetMoney["domino-5&6"] == undefined) {
                                bankerBetMoney["domino-5&6"] = parseInt(tmpBetData.bet_money);
                                userCnt["domino-5&6"] = 1;
                            }
                            else {
                                bankerBetMoney["domino-5&6"] = parseInt(bankerBetMoney["domino-5&6"]) + parseInt(tmpBetData.bet_money);
                                userCnt["domino-5&6"] = parseInt(userCnt["domino-5&6"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "group-1234")) {
                            if (bankerBetMoney["group-1234"] == undefined) {
                                bankerBetMoney["group-1234"] = parseInt(tmpBetData.bet_money);
                                userCnt["group-1234"] = 1;
                            }
                            else {
                                bankerBetMoney["group-1234"] = parseInt(bankerBetMoney["group-1234"]) + parseInt(tmpBetData.bet_money);
                                userCnt["group-1234"] = parseInt(userCnt["group-1234"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "group-2345")) {
                            if (bankerBetMoney["group-2345"] == undefined) {
                                bankerBetMoney["group-2345"] = parseInt(tmpBetData.bet_money);
                                userCnt["group-2345"] = 1;
                            }
                            else {
                                bankerBetMoney["group-2345"] = parseInt(bankerBetMoney["group-2345"]) + parseInt(tmpBetData.bet_money);
                                userCnt["group-2345"] = parseInt(userCnt["group-2345"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "group-2356")) {
                            if (bankerBetMoney["group-2356"] == undefined) {
                                bankerBetMoney["group-2356"] = parseInt(tmpBetData.bet_money);
                                userCnt["group-2356"] = 1;
                            }
                            else {
                                bankerBetMoney["group-2356"] = parseInt(bankerBetMoney["group-2356"]) + parseInt(tmpBetData.bet_money);
                                userCnt["group-2356"] = parseInt(userCnt["group-2356"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "group-3456")) {
                            if (bankerBetMoney["group-3456"] == undefined) {
                                bankerBetMoney["group-3456"] = parseInt(tmpBetData.bet_money);
                                userCnt["group-3456"] = 1;
                            }
                            else {
                                bankerBetMoney["group-3456"] = parseInt(bankerBetMoney["group-3456"]) + parseInt(tmpBetData.bet_money);
                                userCnt["group-3456"] = parseInt(userCnt["group-3456"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "dice-1")) {
                            if (bankerBetMoney["dice-1"] == undefined) {
                                bankerBetMoney["dice-1"] = parseInt(tmpBetData.bet_money);
                                userCnt["dice-1"] = 1;
                            }
                            else {
                                bankerBetMoney["dice-1"] = parseInt(bankerBetMoney["dice-1"]) + parseInt(tmpBetData.bet_money);
                                userCnt["dice-1"] = parseInt(userCnt["dice-1"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "dice-2")) {
                            if (bankerBetMoney["dice-2"] == undefined) {
                                bankerBetMoney["dice-2"] = parseInt(tmpBetData.bet_money);
                                userCnt["dice-2"] = 1;
                            }
                            else {
                                bankerBetMoney["dice-2"] = parseInt(bankerBetMoney["dice-2"]) + parseInt(tmpBetData.bet_money);
                                userCnt["dice-2"] = parseInt(userCnt["dice-2"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "dice-3")) {
                            if (bankerBetMoney["dice-3"] == undefined) {
                                bankerBetMoney["dice-3"] = parseInt(tmpBetData.bet_money);
                                userCnt["dice-3"] = 1;
                            }
                            else {
                                bankerBetMoney["dice-3"] = parseInt(bankerBetMoney["dice-3"]) + parseInt(tmpBetData.bet_money);
                                userCnt["dice-3"] = parseInt(userCnt["dice-3"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "dice-4")) {
                            if (bankerBetMoney["dice-4"] == undefined) {
                                bankerBetMoney["dice-4"] = parseInt(tmpBetData.bet_money);
                                userCnt["dice-4"] = 1;
                            }
                            else {
                                bankerBetMoney["dice-4"] = parseInt(bankerBetMoney["dice-4"]) + parseInt(tmpBetData.bet_money);
                                userCnt["dice-4"] = parseInt(userCnt["dice-4"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "dice-5")) {
                            if (bankerBetMoney["dice-5"] == undefined) {
                                bankerBetMoney["dice-5"] = parseInt(tmpBetData.bet_money);
                                userCnt["dice-5"] = 1;
                            }
                            else {
                                bankerBetMoney["dice-5"] = parseInt(bankerBetMoney["dice-5"]) + parseInt(tmpBetData.bet_money);
                                userCnt["dice-5"] = parseInt(userCnt["dice-5"]) + 1;
                            }
                        }
                        else if (_.includes(tmpBetData.bet, "dice-6")) {
                            if (bankerBetMoney["dice-6"] == undefined) {
                                bankerBetMoney["dice-6"] = parseInt(tmpBetData.bet_money);
                                userCnt["dice-6"] = 1;
                            }
                            else {
                                bankerBetMoney["dice-6"] = parseInt(bankerBetMoney["dice-6"]) + parseInt(tmpBetData.bet_money);
                                userCnt["dice-6"] = parseInt(userCnt["dice-6"]) + 1;
                            }
                        }
                    });

                    if (dataCnt == index + 1) {
                        // Insert
                        for (let key in bankerBetMoney) {
                            totalBet += bankerBetMoney[key];

                            bankerBet = {
                                bet         : key,
                                user_cnt    : userCnt[key],
                                bet_money   : bankerBetMoney[key],
                                win_money   : 0,
                                lose_money  : 0
                            };

                            bankerBetHistory.push(bankerBet);
                        }

                        this.fnCreateBankerBet (tableId, roundNum, dealerId, bets.round_id, roomId, bankerId, bankerBetHistory, totalBet);
                    }
                });
            }
        });
    },
	fnCreateBankerBet (tableId, roundNum, dealerId, roundId, roomId, userId, bet_history, totalBet) {
        let param = {
            eventName   : "CreateBankerBet",
            tableId     : tableId,
            roundNum    : roundNum,
            realName    : dealerId
        };

        return seq.transaction({
            isolationLevel : db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }).then(t => {
			db.sicbo.bets.create({
				round_id : roundId,
				room_id: roomId,
				user_id: userId,
				bet_history,
				total_bet: totalBet,
				type : 'u',
				play_type : 'b'
			},{transaction: t}).then(() => {
                		t.commit();
			}).catch(err => {
                t.rollback();
            });
        }).catch(err => {
        	console.log('ERRORs-->', err);
        });
    },
    
    processBets (args) {
		let tableId    = args.tableId; 
		let roundNum   = args.roundNum;
		let gameInfo   = args.gameInfo.gameInfo;
		let gameResult = args.gameResult;
		let result     = args.gameInfo;
		let betsArray  = null;
		let dealer     = args.dealerName;
        let dealerId   = args.dealerId;
		let param = {
            eventName   : "Game result",
            tableId     : tableId,
            roundNum    : roundNum,
            realName    : dealer
        };
        let roundWins = 0;
        let roundBets = 0;
        let userInfo = [];

	    if (typeof(args.regionalResult.bets) == "string") {
            betsArray = JSON.parse(args.regionalResult.bets);
        }
        else {
            betsArray = args.regionalResult.bets;
        }

        if (_.isEmpty(betsArray)) {
            let emptyBetsQuery = "";
            emptyBetsQuery += "UPDATE `rounds` AS `r`";
            emptyBetsQuery += "   SET `r`.`status` = 'E'";
			emptyBetsQuery += "     , `r`.`game_info` = '" + gameInfo + "'";
            emptyBetsQuery += "     , `r`.`dealer_id` = " + dealerId;
            emptyBetsQuery += "     , `r`.`game_result` = '" + JSON.stringify(gameResult) + "'";
            emptyBetsQuery += "     , `r`.`updated_at` = NOW()";
            emptyBetsQuery += " WHERE `r`.`round_num` = " + roundNum;
            emptyBetsQuery += "   AND `r`.`table_id` = " + tableId;
            emptyBetsQuery += "   AND `r`.`status` = 'P' ";

            return seq.transaction({
                isolationLevel : db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }).then(t => {
                return seq.query(emptyBetsQuery, {transaction: t}).then(() =>
                    t.commit()
                ).catch(err => {
                    t.rollback();
                });
            }).then(() => {
                result.gameResult = gameResult;
                this.sendToAPIServer("Sicbo", result, [], dealer);
                return ({roundWins, roundBets, roundNum, userInfo:[]});
            });
        } // end if empty bets

        let queryBH     = "";
        let queryTB     = "";
        let queryTW     = "";
        let queryTWN    = "";
        let queryTL     = "";
	    let queryCM     = "";
        let userMoney   = "";
        let apiUserInfo = [];

        _.each(betsArray, (betch, index) => {
            let resultBets     = [];
            let betsData        = betch.get();
            let bets = betch.get();
	        let betuser = betsData.user.get();
	        let processedCommission = JSON.parse(betuser.vendor.get('commission'));
	        let vendorData = processedCommission;
            let data           = null;
            let totalBetAmount = 0;
            let totalWin       = 0;
            let totalAllWin	   = 0;
            let count 		   = 0;
            let totalLost 	   = 0;
	        let commission      = 0;
		
            data = JSON.parse(bets.bet_history);
        
            _.each(data, (betData, index) => {
                count = _.filter(gameResult.side_win, (row) => { return row.indexOf(betData.bet.trim()) !== -1; }).length;

                if (bets.play_type == "b") {
                    if (_.filter(gameResult.side_win, (row) => { return row.indexOf(betData.bet.trim()) !== -1; }).length ) {
                        betData.win_money = 0;
                        betData.lose_money = this.calculateRes(betData.bet.trim(), betData.bet_money) * count;
                    }
                    else {
                        betData.win_money = betData.bet_money;
                        betData.lose_money = 0;
                    }
                }
                else {
                    if (_.filter(gameResult.side_win, (row) => { return row.indexOf(betData.bet.trim()) !== -1; }).length ) {
                        betData.win_money = this.calculateRes(betData.bet.trim(), betData.bet_money) * count;
                    }
                }

                totalBetAmount += betData.bet_money;

                 if (betData.win_money > 0) {
                    // if there is win money
                    if (bets.play_type == "b") {
                        // Banker
                        totalWin            += betData.win_money;
                        totalAllWin         += betData.win_money;
                    }
                    else {
                        // Player
                        totalWin            += betData.win_money;
                        totalAllWin         += betData.win_money + betData.bet_money;
                        betData.win_money   += betData.bet_money;
                    }
                }
                else {
                    if (bets.play_type == "b") {
                        // Banker
                        totalLost += betData.lose_money;
                    }
                    else {
                        // Player
                        totalLost += betData.bet_money;
                    }
                }

                resultBets.push(betData);
            });

			if (totalWin > totalLost) {
                // 수수료 삭감
                if (bets.play_type == "b") {
		            let bankerCommission = _.find(vendorData, 'sicbo').sicbo.banker;
		            commission = Math.floor((totalAllWin - totalLost) * ( bankerCommission / 100 ));
                    totalWin = totalWin - commission;
                    totalAllWin = totalAllWin - commission;
                }
                else if (bets.play_type != "b" && bets.room_id != null) {
		            let playerCommission = _.find(vendorData, 'sicbo').sicbo.player;
		            commission = Math.floor((totalAllWin - totalLost) * ( playerCommission / 100 ));
                    totalWin = totalWin - commission;
                    totalAllWin = totalAllWin - commission;
                }
            }

            userInfo.push({
                id             : bets.user_id,
                total_winning  : Math.round((bets.play_type == "b" ? totalAllWin - totalLost : totalAllWin) * 100) / 100,
                money          : (bets.play_type == "b" ? bets.user.money + totalAllWin - totalLost : bets.user.money + totalAllWin),
                user_type      : bets.user.user_type,
                total_lost     : totalLost,
                bets           : data,
                gameResult     : gameResult
            });

            apiUserInfo.push({
                room_id         : bets.room_id,
                commission      : commission,
                commission_info : (vendorData)?vendorData:null,
                user_id         : bets.user.user_id,
                user_name       : bets.user.user_name,
                vendor_id       : bets.user.get('vendor_id'),
                type            : bets.type,
				user_type       : bets.user.user_type,
                play_type       : bets.play_type,
                bets            : data,
                bet_range       : bets.bet_range,
                total_bet       : totalBetAmount,
                total_rolling   : totalBetAmount,
                total_win       : (bets.play_type == "b" ? totalAllWin - totalLost : totalAllWin),
                total_lost      : totalLost,
                bet_id          : bets.bet_id,
                session_id      : bets.session_id,
                created_at      : moment(betsData.created_at).utcOffset(0).format("YYYY-MM-DD HH:mm:ss"),
				currency        : bets.user.currency || bets.user.vendor.currency,
				multiplier      : bets.user.denomination || bets.user.vendor.multiplier
            });   
			
            queryBH     += 'WHEN ' + bets.id + ' THEN \'' +  JSON.stringify(resultBets) + '\' ';
            queryTB     += 'WHEN ' + bets.id + ' THEN ' +  totalBetAmount + ' ';
            queryTW     += 'WHEN ' + bets.id + ' THEN ' +  totalWin + ' ';
            queryTWN    += 'WHEN ' + bets.id + ' THEN ' +  totalAllWin + ' ';
            queryTL     += 'WHEN ' + bets.id + ' THEN ' +  totalLost + ' ';
			queryCM     += "WHEN " + bets.id + " THEN " +  commission + " ";

            roundWins += totalAllWin;
            roundBets += totalBetAmount;

			let tempTotalWin = (betuser.vendor.get('integration_type') == "transfer") ? totalAllWin : 0;

            if (bets.play_type == "b") {
                userMoney += "WHEN " + bets.user_id + " THEN u.money + " + tempTotalWin + " - " + totalLost + " ";
            }
            else {
                userMoney += "WHEN " + bets.user_id + " THEN u.money + " + tempTotalWin + " ";
            }
        });

        let rawQuery = "";
		
		rawQuery += "UPDATE sicbo.bets AS b";
        rawQuery += "  LEFT JOIN sicbo.rounds AS r";
        rawQuery += "    ON r.id = b.round_id";
        rawQuery += "  LEFT JOIN nihtan_api.users AS u";
        rawQuery += "    ON b.user_id = u.id";
        rawQuery += "  LEFT JOIN nihtan_api.vendors AS v";
        rawQuery += "    ON u.vendor_id = v.id";
        rawQuery += "   SET r.game_result = '" + JSON.stringify(gameResult) + "'";
		rawQuery += "     , `r`.`game_info` = '" + gameInfo + "'";
        rawQuery += "     , `r`.`dealer_id` = " + dealerId;
        rawQuery += "     , r.status = 'E'";
        rawQuery += "     , b.bet_history = (CASE b.id " + queryBH + " END)";
        rawQuery += "     , b.total_winning = (CASE b.id " + queryTW + " END)";
        rawQuery += "     , b.total_win = (CASE b.id " + queryTWN + " END)";
        rawQuery += "     , b.total_lost = (CASE b.id " + queryTL + " END)";
        rawQuery += "     , b.commission = (CASE b.id " + queryCM + " END)";
        rawQuery += "     , b.commission_info = v.commission -> '$[*].sicbo'";
        rawQuery += "     , u.money = (CASE u.id " + userMoney + " END)";
        rawQuery += "     , r.updated_at = NOW()";
        rawQuery += "     , b.updated_at = NOW()";
        rawQuery += "     , u.updated_at = NOW()";
        rawQuery += " WHERE r.table_id = " + tableId;
        rawQuery += "   AND r.round_num = " + roundNum;
        rawQuery += "   AND r.status = 'P'";

		return seq.transaction({
            autocommit : true,
            isolationLevel : db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }).then(t => {
            return seq.query(rawQuery, {transaction: t}).then(() => {
                t.commit();
            }).catch(err => {
                t.rollback();
                throw 'error';
            });
        }).then((d) => {
            result.gameResult = gameResult;
            this.sendToAPIServer("Sicbo", result, apiUserInfo, dealer);
            return ({roundWins, userInfo,roundNum});
        });
    },

    /**
     * Pass data for current round to Nihtan API Server.
     *
     * @param game
     * @param result
     * @param data
     */
    sendToAPIServer (game, result, data, dealer) {
        let jsonData = {
            method: 'POST',
            uri: process.env.API_HISTORY_URL,
            body: {
                game        : game,
                table       : result.tableId,
                round_no    : result.roundNum,
                dealer      : dealer,
                game_info   : JSON.parse(result.gameInfo),
                game_result : result.gameResult,
                created_at  : moment(result.created_at).utcOffset(0).format('YYYY-MM-DD HH:mm:ss'),
                resulted_at : moment(result.updated_at).utcOffset(0).format('YYYY-MM-DD HH:mm:ss'),
                data: data
            },
            json: true
        };
		console.log('SEND TO API',jsonData);
	//	return;
        request(jsonData)
            .then(() =>this.apiLog(jsonData))
            .catch(e=>this.apiLog({error:e.name,cause:e.cause,params:jsonData}));
    },
    apiLog(data){
        return;
        let fn = 'logs/'+moment().utcOffset(0).format('YY-MM-DD')+'-ApiRequest.log';
        if (fs.existsSync(fn)) {
            fs.appendFile(fn, '--START\n'
                +moment().utcOffset(0).format('YYYY-MM-DD HH:mm:ss')
                +':\n'+JSON.stringify(data,null,'\t')
                +'\n--END\n\n', err => {if (err) throw err;});
        } else {
            fs.writeFile(fn, '--START\n'
                +moment().utcOffset(0).format('YYYY-MM-DD HH:mm:ss')
                +':\n'+JSON.stringify(data,null,'\t')
                +'\n--END\n\n', err => {if (err) throw err;});
        }
    },

    calculateRes (result, amount) {
        //console.log("*******************************************", result, this.multipliers, "*******************************************")
        if(_.includes(result, "triple") && result != "anytriple") {
            return this.multipliers["triple"] * amount;
        }
        else if(result == "anytriple") {
            return this.multipliers["anytriple"] * amount;
        }
        else if (_.includes(result, "double")) {
            return this.multipliers["double"] * amount;
        }
        else if (_.includes(result, "sum")) {
            return this.multipliers["sum"][result.split("-")[1]] * amount;
        }
        else if (_.includes(result, "group")) {
            return this.multipliers["group"] * amount;
        }
        else if (_.includes(result, "dice")) {
            return this.multipliers["dice"] * amount;
        }
        else if (_.includes(result, "domino")) {
            return this.multipliers["domino"] * amount;
        }
        else if(_.includes(result, "group")) {
            return this.multipliers["group"] * amount;
        }
        else {
            return this.multipliers[result] * amount;
        }
    }
};

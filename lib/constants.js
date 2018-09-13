module.exports = {
	jobs : {
		'1' : 'newround',
		'2' : 'setroundprogress',
		'3' : 'displayresults'
	},
	eventCheck : {
		'newround'       : true,
		'displayresults' : true,
		'setroundprogress'  : true
	},
	roomGames : {
		'Sicbo'       : true,
		'Pai-Gow'	  : true,
		'Baccarat' : true,
		'Dragon-Tiger' : true
	},
	attRound : ["id"],
	attBet : [
		"id",
		"round_id",
		"type",
		"user_id",
		"bet_history",
		"room_id",
		"play_type",
		"commission",
		"commission_info",
		"total_bet",
		"total_winning",
		"total_rolling",
		"bet_range",
		"bet_id",
		"session_id",
		"created_at"
	],
	attUser : [
		"id",
		"vendor_id",
		"user_id",
		"user_name",
		"money",
		"user_type",
		"currency",
		"denomination"
    	],
	attVendor : [
		"id",
		"type",
		"integration_type",
		"commission",
		"currency",
		"multiplier"
    	]
};

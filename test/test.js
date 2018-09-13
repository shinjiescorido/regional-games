let chai       = require('chai')
  , expect     = chai.expect
  , should     = chai.should();
let jsonData   = require('./json');
let processors = require('../lib/process');
let colors     = require('colors');
let conf = require('../config');
colors.setTheme({
  silly  : 'rainbow',
  input  : 'grey',
  verbose: 'cyan',
  prompt : 'grey',
  info   : 'green',
  data   : 'grey',
  help   : 'cyan',
  warn   : 'yellow',
  debug  : 'blue',
  error  : 'red'
});

describe('GAMES'.warn, function(){
	describe('Baccarat'.info, function(){
		afterEach(function() {
			processors['clearRoundNumOne']("Baccarat")
			.then(function() {
			  return true;
			});
		});
		
		describe('processing events'.verbose, function(){
			it('should create new round on \'newround\' eventName', function(){
				return processors[jsonData.bcNewroundData.eventName](jsonData.bcNewroundData)
				.then(function(data){
					expect(data).to.equal('success');
				});
			});
			it('should return success \'dispalyresults\' eventName (no bets)', function(){
				jsonData.bcNewroundData.roundNum = 2;
				return processors[jsonData.bcNewroundData.eventName](jsonData.bcNewroundData)
				.then(function(data){
					return processors[jsonData.bcResultsData.eventName](jsonData.bcResultsData)
					.then(function(data){
						data.should.be.a('object');
						data.should.have.property('roundNum');
						data.roundNum.should.equal(jsonData.bcResultsData.roundNum);
						data.should.have.property('roundWins');
					});
				});
			});
			it('should return success \'dispalyresult\' eventName (with bets)', function(){
				jsonData.bcNewroundData.roundNum = 2;
				return processors[jsonData.bcNewroundData.eventName](jsonData.bcNewroundData)
				.then(function(data){
					return processors['mockBets'](jsonData.bcBetsData,'Baccarat')
					.then(function(){
						return processors[jsonData.bcResultsData.eventName](jsonData.bcResultsData)
							.then(function(data){
								data.should.be.a('object');
								data.should.have.property('roundNum');
								data.roundNum.should.equal(jsonData.bcResultsData.roundNum);
								data.should.have.property('roundWins');
							});
					});
				});
			});
		});
	});
	describe('Dragon-Tiger'.info, function(){
		afterEach(function() {
		  return processors['clearRoundNumOne']("Dragon-Tiger")
			.then(function() {
			  return true;
			});
		});
		describe('processing events'.verbose, function(){
			it('should create new round on \'newround\' eventName', function(){
				return processors[jsonData.dtNewroundData.eventName](jsonData.dtNewroundData)
				.then(function(data){
					expect(data).to.equal('success');
				});
			});
			it('should return success \'dispalyresult\' eventName (no bets)', function(){
				jsonData.dtNewroundData.roundNum = 2;
				return processors[jsonData.dtNewroundData.eventName](jsonData.dtNewroundData)
				.then(function(data){
					return processors[jsonData.dtResultsData.eventName](jsonData.dtResultsData)
					.then(function(data){
						data.should.be.a('object');
						data.should.have.property('roundNum');
						data.roundNum.should.equal(jsonData.dtResultsData.roundNum);
						data.should.have.property('roundWins');
					});
				});
			});
			it('should return success \'dispalyresult\' eventName (with bets)', function(){
				jsonData.dtNewroundData.roundNum = 2;
				return processors[jsonData.dtNewroundData.eventName](jsonData.dtNewroundData)
				.then(function(data){
					return processors['mockBets'](jsonData.dtBetsData,'Dragon-Tiger')
					.then(function(){
						return processors[jsonData.dtResultsData.eventName](jsonData.dtResultsData)
							.then(function(data){
								data.should.be.a('object');
								data.should.have.property('roundNum');
								data.roundNum.should.equal(jsonData.dtResultsData.roundNum);
								data.should.have.property('roundWins');
							});
					});
				});
			});
		});
	});

	describe('Poker'.info, function(){
		afterEach(function() {
		  return processors['clearRoundNumOne']("Poker")
			.then(function() {
			  return true;
			});
		});
		describe('processing events'.verbose, function(){
			jsonData.pokerNewroundData.roundNum = 2;
			it('should create new round on \'newround\' eventName', function(){
				return processors[jsonData.pokerNewroundData.eventName](jsonData.pokerNewroundData)
				.then(function(data){
					
					expect(data).to.equal('success');
				});
			});
			it('should return success \'dispalyresult\' eventName (no bets)', function(){
				return processors[jsonData.pokerNewroundData.eventName](jsonData.pokerNewroundData)
				.then(function(data){
					return processors[jsonData.pokerResultsData.eventName](jsonData.pokerResultsData)
					.then(function(data){
						data.should.be.a('object');
						data.should.have.property('roundNum');
						data.roundNum.should.equal(jsonData.pokerResultsData.roundNum);
						data.should.have.property('roundWins');
					});
				});
			});
			it('should return success \'dispalyresult\' eventName (with bets)', function(){
				jsonData.pokerNewroundData.roundNum = 2;
				return processors[jsonData.pokerNewroundData.eventName](jsonData.pokerNewroundData)
				.then(function(data){
					return processors['mockBets'](jsonData.pokerBetsData,'Poker')
					.then(function(){
						return processors[jsonData.pokerResultsData.eventName](jsonData.pokerResultsData)
							.then(function(data){
								data.should.be.a('object');
								data.should.have.property('roundNum');
								data.roundNum.should.equal(jsonData.pokerResultsData.roundNum);
								data.should.have.property('roundWins');
							});
					});
				});
			});
		});
	});

	describe('Sicbo'.info, function(){
		afterEach(function() {
		  return processors['clearRoundNumOne']("Sicbo")
			.then(function() {
			  return true;
			});
		});
		describe('processing events'.verbose, function(){
			it('should create new round on \'newround\' eventName', function(){
				return processors[jsonData.sicboNewroundData.eventName](jsonData.sicboNewroundData)
				.then(function(data){
					expect(data).to.equal('success');
				});
			});
			it('should return success \'dispalyresult\' eventName (no bets)', function(){
				jsonData.sicboNewroundData.roundNum = 2;
				return processors[jsonData.sicboNewroundData.eventName](jsonData.sicboNewroundData)
				.then(function(data){
					return processors[jsonData.sicboResultsData.eventName](jsonData.sicboResultsData)
					.then(function(data){
						data.should.be.a('object');
						data.should.have.property('roundNum');
						data.roundNum.should.equal(jsonData.sicboResultsData.roundNum);
						data.should.have.property('roundWins');
					});
				});
			});
			it('should return success \'dispalyresult\' eventName (with bets)', function(){
				jsonData.sicboNewroundData.roundNum = 2;
				return processors[jsonData.sicboNewroundData.eventName](jsonData.sicboNewroundData)
				.then(function(data){
					return processors['mockBets'](jsonData.sicboBetsData,'Sicbo')
					.then(function(){
						return processors[jsonData.sicboResultsData.eventName](jsonData.sicboResultsData)
							.then(function(data){
								data.should.be.a('object');
								data.should.have.property('roundNum');
								data.roundNum.should.equal(jsonData.sicboResultsData.roundNum);
								data.should.have.property('roundWins');
							});
					});
				});
			});
		});
	});

	describe('Pai-Gow'.info, function(){
		afterEach(function() {
			return processors['clearRoundNumOne']("Pai-Gow")
					.then(function() {
						return true;
					});
		});
		describe('processing events'.verbose, function(){
			it('should create new round on \'newround\' eventName', function(){
				return processors[jsonData.paigowNewroundData.eventName](jsonData.paigowNewroundData)
						.then(function(data){
							expect(data).to.equal('success');
						});
			});
			it('should return success \'dispalyresult\' eventName (no bets)', function(){
				jsonData.paigowNewroundData.roundNum = 2;
				return processors[jsonData.paigowNewroundData.eventName](jsonData.paigowNewroundData)
						.then(function(data){
							return processors[jsonData.paigowResultsData.eventName](jsonData.paigowResultsData)
									.then(function(data){
										data.should.be.a('object');
										data.should.have.property('roundNum');
										data.roundNum.should.equal(jsonData.paigowResultsData.roundNum);
										data.should.have.property('roundWins');
									});
						});
			});
			it('should return success \'dispalyresult\' eventName (with bets)', function(){
				jsonData.paigowNewroundData.roundNum = 2;
				return processors[jsonData.paigowNewroundData.eventName](jsonData.paigowNewroundData)
						.then(function(data){
							return processors['mockBets'](jsonData.paigowBetsData,'Pai-Gow')
									.then(function(){
										return processors[jsonData.paigowResultsData.eventName](jsonData.paigowResultsData)
												.then(function(data){
													data.should.be.a('object');
													data.should.have.property('roundNum');
													data.roundNum.should.equal(jsonData.paigowResultsData.roundNum);
													data.should.have.property('roundWins');
												});
									});
						});
			});
		});
	});
});
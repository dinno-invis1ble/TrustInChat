var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var Session = require('../models/session');
var Message = require('../models/message');
var ServerData = require('../models/serverdata');

router.get('/', function(req, res, next) {
	ServerData.findOne()
		.sort({_id: -1})
		.exec(function(err, serverdata) {
			if (err) {
				return res.status(500).json({
					title: 'An error occurred',
					error: err
				});
			}
			var serverSecretId = serverdata.serverSecretId;
			var serverSecret = serverdata.serverSecret;
			
			var serverSessionId = crypto.randomBytes(8).toString('hex');

			var validationString = serverSecretId + ':' + serverSessionId + ':' + serverSecret;
			var serverSessionIdValidation = crypto.createHash('sha256').update(validationString).digest('hex');

			var serverSessionSalt = crypto.randomBytes(8).toString('hex');
			var serverSessionSecret = crypto.randomBytes(8).toString('hex');

			console.log('server-secret-id: ' + serverSecretId);
			console.log('server-secret: ' + serverSecret);
			console.log('server-session-id: ' + serverSessionId);
			console.log('validationString: ' + validationString);
			console.log('server-session-id-validation: ' + serverSessionIdValidation);
			console.log('server-session-salt: ' + serverSessionSalt);
			console.log('server-session-secret: ' + serverSessionSecret);

			res.render('index', {
		    	title: 'TrustInChat',
		    	serverSecretId: serverSecretId,
		    	serverSessionId: serverSessionId,
		    	serverSessionIdValidation: serverSessionIdValidation,
		    	serverSessionSalt: serverSessionSalt,
		    	serverSessionSecret: serverSessionSecret
		    });
		});
}); 

router.post('/', function(req, res, next) {
	console.log('encryptedInitialMessage: ' + req.body.encryptedInitialMessage);
	ServerData.findOne(function(err, serverdata) {
		if (err) {
			return res.status(500).json({
				title: 'An error occurred',
				error: err
			});
		}
		var session = new Session({
			toEmail: req.body.toEmail,  
			fromName: req.body.fromName,
			fromEmail: req.body.fromEmail,
			securityQuestion: req.body.securityQuestion,
			answerProof: req.body.answerProof,  
			notifications: req.body.notifications,
			serverSessionId: req.body.serverSessionId,
			serverSessionIdValidation: req.body.serverSessionIdValidation,
			serverSessionSalt: req.body.serverSessionSalt,
			serverSessionSecret: req.body.serverSessionSecret,
			questionSalt: req.body.questionSalt,
			questionSecretValidation: req.body.questionSecretValidation,
			questionIntegrity: req.body.questionIntegrity,
			encryptedQuestion: req.body.encryptedQuestion,
			serverdata: serverdata
		});
		var message = new Message({
			encryptedMessage: req.body.encryptedInitialMessage,
			messageSalt: req.body.messageSalt,
			messageSecretValidation: req.body.messageSecretValidation,
			messageIntegrity: req.body.messageIntegrity,
			user: req.body.user,
			session: session
		});
		message.save(function(err, resultMessage) {
			if (err) {
				return res.status(500).json({
					title: 'An error occurred',
					error: err
				});
			}
			session.messages.push(resultMessage);

			var token = jwt.sign({session: session}, 'secretstring');

			session.save(function(err, result) {
				if (err) {
					return res.status(500).json({
						title: 'An error occurred',
						error: err
					});
				} 
				serverdata.sessions.push(result);
				serverdata.save();

				res.status(201).json({
					message: 'User created and logged in',
					token: token,
					fromEmail: req.body.fromEmail,
					fromName: req.body.fromName,
					toEmail: req.body.toEmail,
					encryptedInitialMessage: req.body.encryptedInitialMessage
				});
			});
		});
	}).sort({_id: -1});
});

router.delete('/:serverSessionId', function(req, res, next) {
	Session.findOne(req.params.serverSessionId, function(err, session) {
		if (err) {
			return res.status(500).json({
				title: 'An error occurred',
				error: err
			});
		}
		if (!session) {
			return res.status(500).json({
				title: 'No Session Found',
				error: {message: 'Session not found!'}
			});
		}
		var sessionId = session[0]._id;
		console.log(sessionId);

		Message.find({session: sessionId}, function(err, messages) {
			if (err) {
				return res.status(500).json({
					title: 'An error occurred',
					error: err
				});
			}
			messages.remove(function(err, removed) {
				if (err) {
					return res.status(500).json({
						title: 'An error occurred',
						error: err
					});
				}
				res.status(200).json({
					message: 'Messages deleted',
					obj: result
				});
			});
		});

		session.remove(function(err, result) {
			if (err) {
				return res.status(500).json({
					title: 'An error occurred',
					error: err
				});
			}
			res.status(200).json({
				message: 'Session deleted',
				obj: result
			});
		});
	});
});

router.get('/remoteserver', function(req, res, next) {
	ServerData.findOne(function(err, serverdata) {
		if (err) {
			return res.status(500).json({
				title: 'An error occurred',
				error: err
			});
		}
		var serverSecretId = serverdata.serverSecretId;

		console.log(req.query.serverSessionId);
		Session.findOne({serverSessionId: req.query.serverSessionId})
			.exec(function(err, session) {
				if(err) {
					return res.status(500).json({
						title: 'An error occurred',
						error: err
					});
				}
				var toEmail = session.toEmail;
				var fromName = session.fromName;
				var fromEmail = session.fromEmail;
				var securityQuestion = session.securityQuestion;
				var serverSessionId = session.serverSessionId;
				var serverSessionIdValidation = session.serverSessionIdValidation;
				var serverSessionSalt = session.serverSessionSalt;
				var serverSessionSecret = session.serverSessionSecret;
				var questionSalt = session.questionSalt;
				var encryptedQuestion = session.encryptedQuestion;
				var questionSecretValidation = session.questionSecretValidation;
				var questionIntegrity = session.questionIntegrity;

				res.status(200).json({
					serverSecretId: serverSecretId,
					toEmail: toEmail,
					fromName: fromName,
					fromEmail: fromEmail,
					securityQuestion: securityQuestion,
					serverSessionId: serverSessionId,
					serverSessionIdValidation: serverSessionIdValidation,
					serverSessionSalt: serverSessionSalt,
					serverSessionSecret: serverSessionSecret,
					questionSalt: questionSalt,
					encryptedQuestion: encryptedQuestion,
					questionSecretValidation: questionSecretValidation,
					questionIntegrity: questionIntegrity
				});
			});
	}).sort({_id: -1});		
});

router.post('/remoteserver', function(req, res, next) {
	Session.findOne({serverSessionId: req.body.serverSessionId}, function(err, sess) {
		if (err) {
			return res.status(401).json({
				title: 'An error occurred',
				error: err
			});
		}
		console.log('sess: ', sess.remoteAnswerAttempts);

		var attempts = sess.remoteAnswerAttempts;

		Session.findOne({answerProof: req.body.answerProof}, function(err, session) {
			if (err) {
				return res.status(401).json({
					title: 'An error occurred',
					error: err
				});
			}
			if (!session) {

				attempts +=1;

				Session.findOneAndUpdate({serverSessionId: req.body.serverSessionId}, {$inc: {remoteAnswerAttempts: 1}})
					.select('remoteAnswerAttempts').exec(function(err, result) {
						if (err) {
							return res.status(401).json({
								title: 'An error occurred',
								error: err
							});
						}
						console.log(result);
					});

				console.log('var attempts: ' + attempts);

				return res.status(401).json({
					title: 'Wrong answer',
					error: {message: 'Wrong answer, attempts: ' + attempts}
				});
				
			}

			

			var token = jwt.sign({session: session}, 'secretstring');

			res.status(200).json({
				message: 'Successfully logged in',
				token: token,
				session: session
			});
		});
	});
});


module.exports = router;


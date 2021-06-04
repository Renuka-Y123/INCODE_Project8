const Ticket = require('../../schema/schemaTicket.js');

function create(req, res) {
	if (!req.body.description || !req.body.responsible || !req.body.priority) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		var ticket = {
			title: req.body.title,
			description: req.body.description,
			responsible: req.body.responsible,
			priority: req.body.priority
		}

		var _t = new Ticket(ticket);
		_t.save(function (err, ticket) {
			if (err) {
				res.status(500).json({
					"text": "Erreur interne"
				})
			} else {
				res.redirect(`${ticket.getId()}`);
			}
		})
	}
}

function createForm(req, res) {
	res.status(200).render('ticket/create', {title: 'Créer ticket'});
}

function show(req, res) {
	if (!req.params.id) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			Ticket.findById(req.params.id, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(function (ticket) {
			res.status(200).render('ticket/show', {title: `Ticket n°${ticket._id}`, ticket});
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Erreur interne"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "Le ticket n'existe pas"
					})
					break;
				default:
					res.status(500).json({
						"text": "Erreur interne"
					})
			}
		})
	}
}

function edit(req, res) {
	if (!req.params.id) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			Ticket.findById(req.params.id, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(function (ticket) {
			res.status(200).render('ticket/edit', {title: `Modifier ticket n°${ticket._id}`, ticket});
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Erreur interne"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "Le ticket n'existe pas"
					})
					break;
				default:
					res.status(500).json({
						"text": "Erreur interne"
					})
			}
		})
	}
}

function update(req, res) {
	console.log(req.body);
	if (!req.params.id || !req.body.description || !req.body.responsible || !req.body.priority) {
		res.status(400).json({
			"text": "Requête invalide"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			req.body.completed = typeof req.body.completed !== 'undefined' ? true : false;

			Ticket.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(function (ticket) {
			res.redirect(`../${ticket.getId()}`);
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Erreur interne"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "Le ticket n'existe pas"
					})
					break;
				default:
					res.status(500).json({
						"text": "Erreur interne"
					})
			}
		})
	}
}

function list(req, res) {
	var findTicket = new Promise(function (resolve, reject) {
		Ticket.find({}, function (err, tickets) {
			if (err) {
				reject(500);
			} else {
				if (tickets) {
					resolve(tickets)
				} else {
					reject(200)
				}
			}
		})
	})

	findTicket.then(function (tickets) {
		res.status(200).render('ticket/index', {title: 'Liste des tickets', tickets});
	}, function (error) {
		switch (error) {
			case 500:
				res.status(500).json({
					"text": "Erreur interne"
				})
				break;
			case 200:
				res.status(200).json({
					"text": "Il n'y a pas encore de ticket"
				})
				break;
			default:
				res.status(500).json({
					"text": "Erreur interne"
				})
		}
	})
}

exports.create = create;
exports.createForm = createForm;
exports.show = show;
exports.edit = edit;
exports.update = update;
exports.list = list;
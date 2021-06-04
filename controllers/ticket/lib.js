const Ticket = require('../../schema/schemaTicket.js')

function create (req, res) {
  if (!req.body.description || !req.body.responsible || !req.body.priority) {
    res.status(400).json({
      text: 'Requête invalide'
    })
  } else {
    var ticket = {
      title: req.body.title,
      description: req.body.description,
      responsible: req.body.responsible,
      priority: req.body.priority
    }

    var _t = new Ticket(ticket)
    _t.save(function (err, ticket) {
      if (err) {
        res.status(500).json({
          text: 'Erreur interne'
        })
      } else {
        res.redirect(`${ticket.getId()}`)
      }
    })
  }
}

function createForm (req, res) {
  res.status(200).render('ticket/create', { title: 'Créer ticket' })
}

function show (req, res) {
  if (!req.params.id) {
    res.status(400).json({
      text: 'Requête invalide'
    })
  } else {
    var findTicket = new Promise(function (resolve, reject) {
      Ticket.findById(req.params.id, function (err, result) {
        if (err) {
          reject(500)
        } else {
          if (result) {
            resolve(result)
          } else {
            reject(200)
          }
        }
      })
    })

    findTicket.then(
      function (ticket) {
        res
          .status(200)
          .render('ticket/show', { title: `Ticket n°${ticket._id}`, ticket })
      },
      function (error) {
        switch (error) {
          case 500:
            res.status(500).json({
              text: 'Erreur interne'
            })
            break
          case 200:
            res.status(200).json({
              text: "Le ticket n'existe pas"
            })
            break
          default:
            res.status(500).json({
              text: 'Erreur interne'
            })
        }
      }
    )
  }
}

function edit (req, res) {
  if (!req.params.id) {
    res.status(400).json({
      text: 'Requête invalide'
    })
  } else {
    var findTicket = new Promise(function (resolve, reject) {
      Ticket.findById(req.params.id, function (err, result) {
        if (err) {
          reject(500)
        } else {
          if (result) {
            resolve(result)
          } else {
            reject(200)
          }
        }
      })
    })

    findTicket.then(
      function (ticket) {
        res.status(200).render('ticket/edit', {
          title: `Modifier ticket n°${ticket._id}`,
          ticket
        })
      },
      function (error) {
        switch (error) {
          case 500:
            res.status(500).json({
              text: 'Erreur interne'
            })
            break
          case 200:
            res.status(200).json({
              text: "Le ticket n'existe pas"
            })
            break
          default:
            res.status(500).json({
              text: 'Erreur interne'
            })
        }
      }
    )
  }
}

function update (req, res) {
  if (
    !req.params.id ||
    !req.body.description ||
    !req.body.responsible ||
    !req.body.priority
  ) {
    res.status(400).json({
      text: 'Requête invalide'
    })
  } else {
    var findTicket = new Promise(function (resolve, reject) {
      req.body.completed =
        typeof req.body.completed !== 'undefined' ? true : false

      Ticket.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
        if (err) {
          reject(500)
        } else {
          if (result) {
            resolve(result)
          } else {
            reject(200)
          }
        }
      })
    })

    findTicket.then(
      function (ticket) {
        res.redirect(`../${ticket.getId()}`)
      },
      function (error) {
        switch (error) {
          case 500:
            res.status(500).json({
              text: 'Erreur interne'
            })
            break
          case 200:
            res.status(200).json({
              text: "Le ticket n'existe pas"
            })
            break
          default:
            res.status(500).json({
              text: 'Erreur interne'
            })
        }
      }
    )
  }
}

function list (req, res) {
  var findTicket = new Promise(function (resolve, reject) {
    Ticket.find({}, function (err, tickets) {
      if (err) {
        reject(500)
      } else {
        if (tickets) {
          resolve(tickets)
        } else {
          reject(200)
        }
      }
    })
  })

  findTicket.then(
    function (tickets) {
      res
        .status(200)
        .render('ticket/index', { title: 'Liste des tickets', tickets })
    },
    function (error) {
      switch (error) {
        case 500:
          res.status(500).json({
            text: 'Erreur interne'
          })
          break
        case 200:
          res.status(200).json({
            text: "Il n'y a pas encore de ticket"
          })
          break
        default:
          res.status(500).json({
            text: 'Erreur interne'
          })
      }
    }
  )
}

async function comment (req, res) {
  var remark = req.body.comment
  if(remark!=' ')
  var isCommentValid=ValidateMessage(remark);
  if(!isCommentValid)
      {
        return res.json({ error: 'errorInput' });
      }
      else{
  if (
    !req.body.authorId ||
    !req.body.comment ||
    !req.body.email ||
    !req.body._id
  ) {
    res.status(400).json({
      text: 'Requête invalide'
    })
  } else {
    const newComment = {
      authorId: req.body.authorId,
      author: req.body.email,
      comment: req.body.comment
    }

    const updateComments = await Ticket.updateOne(
      { _id: req.body._id },
      { $push: { comments: newComment } }
    )
    const tick = await Ticket.findById(req.body._id)
    if (!tick) return res.status(400).json({ error: 'error' })

    return res.status(200).json(tick.comments)
  }
}
}

function viewComments (req, res) {
  if (!req.params.id) {
    res.status(400).json({
      text: 'Requête invalide'
    })
  } else {
    try {
      var findTicket = new Promise(function (resolve, reject) {
        Ticket.findById(req.params.id, function (err, result) {
          if (err) {
            reject(500)
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
        return res.status(200).json(ticket.comments)
      })
    } catch (e) {
      console.log(error)
    }
  }
}

const isBetween = (min, max, length) => (length<min || length>max) ? false : true;

    function ValidateMessage(msg)
   {
    if(isBetween(10,100,msg.length) && (/^[A-Za-z0-9-_\s]+$/.test(msg)))
    {
    return true;
    }
    else{
        return false;
    }
  }

exports.create = create
exports.createForm = createForm
exports.show = show
exports.edit = edit
exports.update = update
exports.list = list
exports.comment = comment
exports.viewComments = viewComments

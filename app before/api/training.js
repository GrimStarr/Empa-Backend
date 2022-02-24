const { Router } = require('express');
const TrainingTable = require('../training/table');

const { authenticatedAccount } = require('./helper');

const router = new Router();

router.post('/new', (req, res, next) => {
    const { training, token } = req.body;

    authenticatedAccount({ token: token })
        .then(({ authenticated }) => {
            return TrainingTable.addTraining(training);
        }
        )
        .then(() => res.json({ message: 'success' }))
        .catch(error => next(error));
});

router.post('/remove/:id', (req, res, next) => {
    const id = req.param.id;
    const { token } = req.body;

    authenticatedAccount({ token: token })
        .then(({ authenticated }) => {
            return TrainingTable.removeTraining(id);
        }
        )
        .then(() => res.json({ message: 'success' }))
        .catch(error => next(error));
});

router.post('/update/:id', (req, res, next) => {
    const id = req.param.id;
    const { token, training } = req.body;

    authenticatedAccount({ token: token })
        .then(({ authenticated }) => {
            return TrainingTable.updateTraining(id, training);
        }
        )
        .then(() => res.json({ message: 'success' }))
        .catch(error => next(error));
});

router.get('/', (req, res, next) => {
    let categories = [];
    TrainingTable.getAllCategories()
        .then(result => {
            if (result) {
                categories = [...result];
                return TrainingTable.getAllTrainings();
            } else {
                const error = new Error('No category found!');
                error.statusCode = 409;
                console.log(error.message);
                throw error;
            }
        })
        .then(result => {
            if (result) {
                res.json({category: categories, training: [...result]});
            }else {
                const error = new Error('No training found!');
                error.statusCode = 409;
                console.log(error.message);
                throw error;
            }
        })
        .catch(error => next(error));
});

module.exports = router;

const pool = require('../../databasePool');

class TrainingTable {
    static addTraining(training) {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO trainings(category, title, brief, capacity, price, duration, imgurl, body)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
                [training.category, training.title, training.brief, training.capacity, training.price, training.duration, training.imgurl, training.body],
                (error, response) => {
                    if (error) return reject(error);
                    else resolve();
                }
            )
        });
    }

    static removeTraining(id) {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM trainings WHERE id = $1 RETURNING *`,
                [id],
                (error, response) => {
                    if (error) return reject(error);
                    else resolve(response.rows);
                }
            )
        });
    }

    static updateTraining(id, training) {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE services
                SET category = $1, title = $2, brief = $3, capacity = $4, price = $5, duration = $6, imgurl = $7, body = $8 
                WHERE id = $9`,
                [training.category, training.title, training.brief, training.capacity, training.price, training.duration, training.imgurl, training.body, id],
                (error, response) => {
                    if (error) return reject(error);
                    else resolve(response.rows);
                }
            )
        });
    }

    static getTraining(id) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM trainings WHERE id = $1`,
                [id],
                (error, response) => {
                    if (error) return reject(error);
                    else resolve(response.rows);
                }
            )
        });
    }

    static getAllTrainingsByCategory(categoryId) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM trainings WHERE category_id = $1 ORDER BY id`,
                [categoryId],
                (error, response) => {
                    if (error) return reject(error);
                    resolve(response.rows);
                }
            );
        });
    }

    static getAllTrainings() {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM trainings ORDER BY category_id ASC, id ASC`,
                [],
                (error, response) => {
                    if (error) return reject(error);
                    resolve(response.rows);
                }
            );
        });
    }

    static getAllCategories() {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM training_category ORDER BY id`,
                [],
                (error, response) => {
                    if (error) return reject(error);
                    resolve(response.rows);
                }
            );
        });
    }

}

module.exports = TrainingTable;

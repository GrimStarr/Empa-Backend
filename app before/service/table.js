const pool = require('../../databasePool');

class ServiceTable {
    static addService(service) {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO services(title, icon, body)
                VALUES($1, $2, $3) RETURNING id`,
                [service.title, service.icon, service.body],
                (error, response) => {
                    if (error) return reject(error);
                    else resolve();
                }
            )
        });
    }

    static removeService(id) {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM services WHERE id = $1 RETURNING *`,
                [id],
                (error, response) => {
                    if (error) return reject(error);
                    else resolve(response.rows);
                }
            )
        });
    }

    static updateService(id, service) {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE services
                SET title = $2, icon = $3, body = $4 
                WHERE id = $1`,
                [id, service.title, service.icon, service.body],
                (error, response) => {
                    if (error) return reject(error);
                    else resolve(response.rows);
                }
            )
        });
    }

    static getService(id) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM services WHERE id = $1`,
                [id],
                (error, response) => {
                    if (error) return reject(error);
                    else resolve(response.rows);
                }
            )
        });
    }

    static getAllServices() {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM services ORDER BY id`,
                [],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }
}

module.exports = ServiceTable;

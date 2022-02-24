const pool = require('../../databasePool');

class ProductsTable {
    static addProduct(product) {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO products(title, logoURL, body)
                VALUES($1, $2, $3) RETURNING id`,
                [product.title, product.logoURL, product.body],
                (error, response) => {
                    if (error) return reject(error);
                    else resolve();
                }
            )
        });
    }

    static removeProduct(id) {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM products WHERE id = $1 RETURNING *`,
                [id],
                (error, response) => {
                    if (error) return reject(error);
                    else resolve(response.rows);
                }
            )
        });
    }

    static updateProduct(id, product) {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE products
                SET title = $2, "logoURL" = $3, body = $4 
                WHERE id = $1`,
                [id, product.title, product.logoURL, product.body],
                (error, response) => {
                    if (error) return reject(error);
                    else resolve(response.rows);
                }
            )
        });
    }

    static getProduct(id) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM products WHERE id = $1`,
                [id],
                (error, response) => {
                    if (error) return reject(error);
                    else resolve(response.rows);
                }
            )
        });
    }

    static getAllProducts() {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM products ORDER BY id`,
                [],
                (error, response) => {
                    if (error) return reject(error);

                    resolve(response.rows);
                }
            );
        });
    }
}

module.exports = ProductsTable;

const pool = require('../../databasePool');

class BannerTable {
    static addBanner(banner) {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO banner(title, body, imgurl, link)
                VALUES($1, $2, $3, $4) RETURNING id`,
                [banner.title, banner.body, banner.imgurl, banner.link],
                (error, response) => {
                    if (error) return reject(error);
                    resolve();
                }
            )
        });
    }

    static removeBanner(id) {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM banner WHERE id = $1`,
                [id],
                (error, response) => {
                    if (error) return reject(error);
                    resolve();
                }
            )
        });
    }

    static updateBanner(id, banner) {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE banner
                SET title = $2, body = $3 imgurl = $4, link = $5
                WHERE id = $1`,
                [id, banner.title, banner.body, banner.imgurl, banner.link],
                (error, response) => {
                    if (error) return reject(error);
                    resolve();
                }
            )
        });
    }

    static getBanner(id) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM banner WHERE id = $1`,
                [id],
                (error, response) => {
                    if (error) return reject(error);
                    resolve(response.rows);
                }
            )
        });
    }

    static getAllBanners() {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM banner ORDER BY id`,
                [],
                (error, response) => {
                    if (error) return reject(error);
                    resolve(response.rows);
                }
            );
        });
    }
}

module.exports = BannerTable;

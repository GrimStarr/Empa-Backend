const pool = require("../../databasePool");

class AccountTable {
  static storeAccount({ username, passwordHash }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO account(username, "passwordHash")
                VALUES($1, $2)`,
        [username, passwordHash],
        (error, response) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  static getAccount({ username }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT id, username, "passwordHash" FROM account
                WHERE username = $1`,
        [username],
        (error, response) => {
          if (error) return reject(error);

          resolve({ account: response.rows[0] });
        }
      );
    });
  }
}

module.exports = AccountTable;

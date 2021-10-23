var logging = require('../_Library/AppHelper');
var config = require('../_Config/config');
var sql = require("mssql");

export default class DBHelper {
    pullDataFromDatabase(SqlQuery: string) {

        return new Promise(async function (resolve, reject) {
            try {
                var conn;
                conn = await new sql.ConnectionPool({
                    user: config.StagingEnv.user,
                    password: config.StagingEnv.password,
                    server: config.StagingEnv.server,
                    options: {
                        database: config.StagingEnv.master
                    }

                }
                );
                await conn.connect()
                var results = await conn.request().query(SqlQuery);
                resolve(results.recordsets);
                logging('After Resolving the results coming');
                logging(results.recordsets);
            }
            catch (err) {
                logging('Error Occured:' + err);
                reject(err);
            }
            finally {
                if (conn) {
                    try {
                        await conn.close();
                        logging('Connection Closed');

                    }
                    catch (err) {
                        logging('Error closing connection: ' + err);
                    }
                }
            }
        });


    }
}

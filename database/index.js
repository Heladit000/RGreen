import mariadb from "mariadb";
import { nanoid } from "nanoid";
import moment from "moment";
import config from "../utils/getConfig.js";

import { exec } from "child_process"

let connection;

const spawnCommand = `sudo mount ${config.RPICONFIG.DATABASE_route} /mnt/usb -o uid=mysql ; sudo systemctl start mariadb`;

const mountDB = (callback) => {
    exec(spawnCommand, (error, stderr) => {
        if (stderr) {
            if (!stderr.includes("already mounted")) {
                console.log(`\x1b[41m \x1b[37m [ ERROR ] ----> ${stderr} <---- \x1b[0m`);
            } else {
                console.log(`\x1b[34m > Database already mounted \x1b[0m`);
            }
        } else if (error) {
            console.log(`\x1b[41m \x1b[37m [ ERROR ] ----> ${error} <---- \x1b[0m`);
        } else {
            console.log(`\x1b[34m > Database mounted \x1b[0m`);
        }

        callback();
    })
}

const startDBConnection = async () => {
    try {
        connection = await mariadb.createConnection({ host: "127.0.0.1", user: "root", password: "rgreendb", database: "rgreen" });
        console.log("\x1b[36m database connected! \x1b[0m")
    } catch (err) {
        console.log("\x1b[41m [ERROR] || cant connect with the database, the data will not saved || \x1b[0m");
        console.log(err);

    }
}

const getValueWithID = (TABLE, id) => {
    if (connection !== undefined) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = await connection.query(`SELECT * FROM ${TABLE} WHERE id=?`, id)
                resolve(query)
            }
            catch (err) {
                reject(err)
            }
        })
    }
}

const getValuesRangeValuesWithTime = (TABLE, page, limit) => {
    if (connection !== undefined) {
        if (limit === undefined) {
            limit = 10
        }
        return new Promise(async (resolve, reject) => {
            try {
                const query = await connection.query(`SELECT * FROM ${TABLE} WHERE plantName="${config.PLANT.name}" ORDER BY createdAt DESC LIMIT ${page * limit},${page === 0 ? (limit * page * 2) : limit}`)
                resolve(query)
            }
            catch (err) {
                reject(err)
            }
        })
    }
}

const insertValue = (TABLE, name, value) => {
    if (connection !== undefined) {
        return new Promise(async (resolve, reject) => {

            //default data in all tables
            const dataToInsert = {
                id: `"${nanoid()}"`,
                date: `"${moment()}"`,
                plantName: `"${config.PLANT.name}"`
            }

            //convert json data to string to MariaDB syntax
            const dataKeys = Object.keys(dataToInsert).join(",")
            const dataValues = Object.values(dataToInsert).join(",")

            try {
                const query = await connection.query(`INSERT INTO ${TABLE} (${dataKeys},${name}) VALUES (${dataValues}, ?)`, [value])
                resolve(query)
            }
            catch (err) {
                reject(err)
            }
        })
    }
}

const insertValues = (TABLE, data) => {
    if (connection !== undefined) {
        return new Promise(async (resolve, reject) => {

            //default data in all tables
            const dataToInsert = {
                ...data,
                id: `"${nanoid()}"`,
                date: `"${moment()}"`,
                plantName: `"${config.PLANT.name}"`
            }

            //convert json data to string to MariaDB syntax
            const dataKeys = Object.keys(dataToInsert).join(",")
            const dataValues = Object.values(dataToInsert).join(",")

            try {
                const query = await connection.query(`INSERT INTO ${TABLE} (${dataKeys}) VALUES (${dataValues})`)
                resolve(query)
            }
            catch (err) {
                reject(err)
            }
        })
    }
}

export { startDBConnection, mountDB, getValuesRangeValuesWithTime, getValueWithID, insertValue, insertValues }
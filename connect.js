import mysql from "mysql2"

export const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "22vfq1989",
	database: "social"
})
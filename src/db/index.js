import mysql from 'promise-mysql'
import {DB as DBConfig} from '../config.js'

var pool = mysql.createPool(DBConfig)

export default pool

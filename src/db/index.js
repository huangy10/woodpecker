import mysql from 'promise-mysql'
import {System as SystemConfig} from '../config.js'

var pool = mysql.createPool(SystemConfig.DB)

export default pool

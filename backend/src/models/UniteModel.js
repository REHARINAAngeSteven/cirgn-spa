// src/models/UniteModel.js

const db = require('./db');

class UniteModel {
    static async findAll() {
        const query = 'SELECT * FROM unite ORDER BY nom_unite;';
        const [rows] = await db.query(query);
        return rows;
    }
    
    static async create(data) {
        const query = 'INSERT INTO unite (lib_dir, lib_sce, lib_div, nom_unite) VALUES (?, ?, ?, ?);';
        const values = [data.lib_dir, data.lib_sce, data.lib_div, data.nom_unite];
        const [result] = await db.query(query, values);
        return result.insertId;
    }
    // Ajoutez ici findById, update, delete...
}

module.exports = UniteModel;
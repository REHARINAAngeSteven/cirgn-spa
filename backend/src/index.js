require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models/db')

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes eto ty rall 
// raha misy probleme de route de eto no jerena
const authRouutes = require('./routes/authRoutes');
const personnelRoutes = require('./routes/personnelRoutes');
const uniteRoutes = require('./routes/uniteRoutes');
const fonctionRoutes = require('./routes/fonctionRoutes');
const motifRoutes = require('./routes/motifRoutes');
const situationRoutes = require('./routes/situationRoutes');

// Eto antsika no mampiasa ny route
app.use('/api/auth', authRouutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api/unite', uniteRoutes);
app.use('/api/fonction', fonctionRoutes);
app.use('/api/motif', motifRoutes);
app.use('/api/situation', situationRoutes);


// test route kely aloha
app.get('/', (req,res) => {res.send('Test ny route ty rall !!')});

// test db ndray aloha e
db.getConnection((err, connection ) => {
    if(err)
    {
        console.error('Erreur ny connexion rall ty eto :', err.message);
        process.exit(1);
    }
    console.log('Connexion milamn rall ');
    connection.release();
});


app.listen(port, () => {
    console.log(`Serveur demarré sur port :${port}`);
});
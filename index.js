import express from 'express';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;

import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';

app.use(cors());
app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

// To add a new contact
app.post('/add-contact', async (req, res) => {
	const { name, phone, email, address, avatar } = req.body;

	try {
		await pool.query(
			`INSERT INTO contacts (name, phone, email, address, avatar) VALUES ($1, $2, $3, $4, $5)`,
			[name, phone, email, address, avatar]
		);
		res.status(201).json({ message: `Contact added successfully` });
	} catch (error) {
		console.error('Error inserting contact:', error);
		res.status(500).send({ error: error.message });
	}
});

app.get('/contacts', async (req, res) => {
	try {
		const result = await pool.query(`SELECT * FROM contacts ORDER BY id DESC`);
		res.json(result.rows);
	} catch (error) {
		console.error('Error fetching contact:', error);
		res.status(500).send({ error: error.message });
	}
});

app.get('/', (req, res) => {
	res.send('Welcome to the Express API!');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

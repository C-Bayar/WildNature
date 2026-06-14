import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

const db = new sqlite3.Database(join(__dirname, 'wildnature.db'));

// ============ PAGE ROUTES ============

// Home page
app.get('/', (req, res) => {
    res.render('home', { pageTitle: 'WildNature Park' });
});

// Habitats listing page
app.get('/habitats', (req, res) => {
    db.all('SELECT * FROM habitats', (err, habitats) => {
        if (err) {
            console.error('DB error on /habitats:', err);
            res.status(500).send('Database error');
        } else {
            res.render('habitats', { habitats, pageTitle: 'Our Habitats' });
        }
    });
});

// Single habitat page with experiences
app.get('/habitat/:id', (req, res) => {
    const habitatId = req.params.id;
    db.get('SELECT * FROM habitats WHERE id = ?', [habitatId], (err, habitat) => {
        if (err) {
            console.error('DB error fetching habitat:', err);
            return res.status(500).send('Database error');
        }
        if (!habitat) {
            return res.status(404).send('Habitat not found');
        }
        db.all('SELECT * FROM experiences WHERE habitat_id = ?', [habitatId], (err, experiences) => {
            if (err) {
                console.error('DB error fetching experiences:', err);
                return res.status(500).send('Database error');
            }
            res.render('habitat', { habitat, experiences, pageTitle: habitat.name });
        });
    });
});

// Individual experience page
app.get('/experience/:id', (req, res) => {
    const experienceId = req.params.id;
    db.get(`
        SELECT e.*, h.name as habitat_name, h.id as habitat_id 
        FROM experiences e
        JOIN habitats h ON e.habitat_id = h.id
        WHERE e.id = ?
    `, [experienceId], (err, experience) => {
        if (err) {
            console.error('DB error fetching experience:', err);
            return res.status(500).send('Database error');
        }
        if (!experience) {
            return res.status(404).send('Experience not found');
        }
        res.render('experience', { experience, pageTitle: experience.name });
    });
});

// Activities page — database-driven
app.get('/activities', (req, res) => {
    db.all('SELECT e.*, h.name as habitat_name FROM experiences e JOIN habitats h ON e.habitat_id = h.id ORDER BY h.id, e.id', (err, experiences) => {
        if (err) {
            console.error('DB error fetching activities:', err);
            return res.status(500).send('Database error');
        }
        res.render('activities', { experiences, pageTitle: 'Adventure Activities' });
    });
});

// Events page — defaults to current year
app.get('/events', (req, res) => {
    const currentYear = new Date().getFullYear().toString();
    const { year, category } = req.query;
    const selectedYear = year || currentYear;
    const selectedCategory = category || 'all';

    db.all(`SELECT DISTINCT strftime('%Y', event_date) as year FROM events ORDER BY year DESC`, (err, years) => {
        if (err) {
            console.error('DB error fetching event years:', err);
            return res.status(500).send('Database error');
        }
        db.all(`SELECT DISTINCT category FROM events ORDER BY category`, (err, categories) => {
            if (err) {
                console.error('DB error fetching event categories:', err);
                return res.status(500).send('Database error');
            }
            res.render('events', {
                years: years.map(y => y.year),
                categories: categories.map(c => c.category),
                selectedYear,
                selectedCategory,
                pageTitle: 'Special Events'
            });
        });
    });
});

// Single event page
app.get('/event/:id', (req, res) => {
    const eventId = req.params.id;
    db.get(`
        SELECT *, 
               CASE 
                   WHEN date(event_date) < date('now') THEN 'past'
                   WHEN date(event_date) = date('now') THEN 'today'
                   ELSE 'upcoming'
               END as status
        FROM events WHERE id = ?
    `, [eventId], (err, event) => {
        if (err) {
            console.error('DB error fetching event:', err);
            return res.status(500).send('Database error');
        }
        if (!event) {
            return res.status(404).send('Event not found');
        }
        res.render('event', { event, pageTitle: event.title });
    });
});

// Memory Game page
app.get('/game', (req, res) => {
    res.render('game', { pageTitle: 'Memory Game' });
});

// FAQ page
app.get('/faq', (req, res) => {
    res.render('faq', { pageTitle: 'FAQ' });
});

// Contact page
app.get('/contact', (req, res) => {
    res.render('contact', { pageTitle: 'Contact Us' });
});

// Contact form submission
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    db.run(
        'INSERT INTO contact_messages (name, email, message, submitted_at) VALUES (?, ?, ?, datetime("now"))',
        [name, email, message],
        (err) => {
            if (err) {
                console.error('DB error saving contact message:', err);
                return res.status(500).send('Error saving message');
            }
            res.render('contact-success', { pageTitle: 'Message Sent', name });
        }
    );
});

// ============ AJAX ROUTES ============

// AJAX Search endpoint
app.get('/api/search', (req, res) => {
    const query = req.query.q || '';
    if (query.length < 2) return res.json([]);

    const searchTerm = `%${query}%`;
    db.all(
        `SELECT 'habitat' as type, id, name, description, NULL as habitat_id 
         FROM habitats WHERE name LIKE ? OR description LIKE ?
         UNION ALL
         SELECT 'experience' as type, e.id, e.name, e.description, e.habitat_id 
         FROM experiences e WHERE e.name LIKE ? OR e.description LIKE ?`,
        [searchTerm, searchTerm, searchTerm, searchTerm],
        (err, results) => {
            if (err) {
                console.error('DB error on search:', err);
                return res.status(500).json({ error: 'Search failed' });
            }
            res.json(results || []);
        }
    );
});

// AJAX Events endpoint
app.get('/api/events', (req, res) => {
    const { year, category } = req.query;
    let sql = `SELECT *, 
               CASE 
                   WHEN date(event_date) < date('now') THEN 'past'
                   WHEN date(event_date) = date('now') THEN 'today'
                   ELSE 'upcoming'
               END as status
               FROM events WHERE 1=1`;
    const params = [];

    if (year && year !== 'all') {
        sql += ` AND strftime('%Y', event_date) = ?`;
        params.push(year);
    }
    if (category && category !== 'all') {
        sql += ` AND category = ?`;
        params.push(category);
    }
    sql += ` ORDER BY event_date DESC`;

    db.all(sql, params, (err, events) => {
        if (err) {
            console.error('DB error on /api/events:', err);
            return res.status(500).json({ error: 'Failed to load events' });
        }
        res.json(events);
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

// Start server
app.listen(port, () => {
    console.log(`WildNature Park running at http://localhost:${port}`);
});
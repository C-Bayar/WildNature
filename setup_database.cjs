const sqlite3 = require('sqlite3');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'wildnature.db'));

console.log('Setting up database...');

db.serialize(() => {
    // Create tables
    db.run(`CREATE TABLE IF NOT EXISTS habitats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS experiences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habitat_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        FOREIGN KEY (habitat_id) REFERENCES habitats(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT,
        submitted_at DATETIME
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        event_date DATE,
        category TEXT,
        image_url TEXT
    )`);

    // Clear existing data
    db.run(`DELETE FROM experiences`);
    db.run(`DELETE FROM habitats`);
    db.run(`DELETE FROM events`);

    // Insert Habitats
    db.run(`INSERT INTO habitats (id, name, description, image_url) VALUES (1, 'Rainforest Retreat', 'Immerse yourself in a lush, vibrant rainforest. Home to exotic birds, colourful frogs, and towering trees.', '/images/rainforest_retreat.jpg')`);
    db.run(`INSERT INTO habitats (id, name, description, image_url) VALUES (2, 'Savannah Plains', 'Experience the vast open grasslands of Africa. Spot majestic lions, towering giraffes, and playful zebras.', '/images/habitat_savannah.jpg')`);
    db.run(`INSERT INTO habitats (id, name, description, image_url) VALUES (3, 'Arctic Discovery Zone', 'Journey to the frozen north! Meet polar bears, arctic foxes, and seals in this icy wilderness.', '/images/arctic_discovery_zone.jpg')`);
    db.run(`INSERT INTO habitats (id, name, description, image_url) VALUES (4, 'Mystic Marshlands', 'Explore the mysterious wetlands filled with unique amphibians, water birds, and hidden surprises.', '/images/mystic_marshlands.jpg')`);
    db.run(`INSERT INTO habitats (id, name, description, image_url) VALUES (5, 'Nightglow Forest', 'Enter a magical forest that comes alive at night with glowing creatures and nocturnal wildlife.', '/images/nightglow_forest.jpg')`);

    // Rainforest Retreat experiences
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (1, 'Canopy Walkway', 'Walk among the treetops on our suspended bridge network, 20 meters above the forest floor. Feel the thrill of being eye-level with exotic birds and monkeys.', '/images/canopy_walk.jpg')`);
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (1, 'Tropical Bird Feeding', 'Hand-feed colourful parrots and toucans in our walk-in aviary. Get amazing photos as these beautiful birds eat right from your hand.', '/images/tropical_bird_feeding.jpg')`);
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (1, 'Butterfly Garden', 'Walk through thousands of free-flying butterflies in our climate-controlled garden. Watch these delicate creatures emerge from their chrysalises.', '/images/butterfly_garden.jpg')`);

    // Savannah Plains experiences
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (2, 'Safari Jeep Tour', 'Guided 45-minute tour through the savannah in our open-air jeeps. Learn fascinating facts about African wildlife from our expert guides.', '/images/safari_jeep_tour.jpg')`);
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (2, 'Giraffe Encounter', 'Get eye-to-eye with gentle giraffes and feed them their favourite treats. These magnificent creatures will steal your heart.', '/images/giraffe_encounter.jpg')`);
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (2, 'Lion Observatory', 'Watch our pride of lions from a safe, elevated viewing platform. See the kings of the savannah in their naturalistic habitat.', '/images/Lion_observatory.jpg')`);

    // Arctic Discovery Zone experiences
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (3, 'Polar Bear Viewing', 'See our polar bears swim and play in their Arctic environment. Watch these magnificent creatures through underwater viewing windows.', '/images/polar_bear_viewing.jpg')`);
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (3, 'Arctic Fox Encounter', 'Meet our playful arctic foxes up close in their frosty habitat. These adorable animals will charm you with their antics.', '/images/arctic_fox_encounter.jpg')`);
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (3, 'Ice Tunnel Adventure', 'Walk through our spectacular ice tunnel carved from ancient glaciers. Experience what it feels like to be in the frozen north.', '/images/artic_tunnel.jpg')`);

    // Mystic Marshlands experiences
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (4, 'Frog Discovery', 'Learn about colourful poison dart frogs and other magical amphibians. See these tiny but fascinating creatures up close.', '/images/frog_discovery.jpg')`);
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (4, 'Marshland Boardwalk', 'Walk the mystical boardwalk through misty marshlands and hidden lagoons. Listen to the sounds of nature all around you.', '/images/mystic_broadwalk.jpg')`);
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (4, 'Bird Watching Hide', 'Spot rare water birds from our hidden observation point. Bring your binoculars and camera for amazing bird photography.', '/images/bird_watching_hide.jpg')`);

    // Nightglow Forest experiences
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (5, 'Night Safari', 'Experience the park after dark with special night vision goggles. See nocturnal animals come alive when the sun goes down.', '/images/night_safari.jpg')`);
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (5, 'Glow Worm Tunnel', 'Walk through our magical glowing tunnel filled with bioluminescent wonders. It feels like walking through a starry night.', '/images/glow_warm_tunnel.jpg')`);
    db.run(`INSERT INTO experiences (habitat_id, name, description, image_url) VALUES (5, 'Nocturnal Animal House', 'See owls, bats, and other night creatures active after sunset. Learn about the fascinating world of animals that wake up at night.', '/images/nocturnal_animal_house.jpg')`);

    // Insert Events
    db.run(`INSERT INTO events (title, description, event_date, category, image_url) VALUES ('Summer Wildlife Festival', 'Celebrate summer with family-friendly activities, animal encounters, and live music!', '2026-07-15', 'Family Activities', '/images/family_day.jpg')`);
    db.run(`INSERT INTO events (title, description, event_date, category, image_url) VALUES ('Conservation Workshop', 'Learn about wildlife conservation and how you can help protect endangered species.', '2026-08-20', 'Educational Talks', '/images/eagle.jpg')`);
    db.run(`INSERT INTO events (title, description, event_date, category, image_url) VALUES ('Night Safari Experience', 'Experience the park after dark! See nocturnal animals in action.', '2026-09-10', 'Seasonal Celebrations', '/images/night_safari.jpg')`);
    db.run(`INSERT INTO events (title, description, event_date, category, image_url) VALUES ('Winter Wonderland', 'Join our festive celebration with special winter animal exhibits.', '2026-12-15', 'Seasonal Celebrations', '/images/polar_bear_viewing.jpg')`);
    db.run(`INSERT INTO events (title, description, event_date, category, image_url) VALUES ('Spring Bird Festival', 'Watch migrating birds and learn from expert ornithologists.', '2025-05-01', 'Educational Talks', '/images/bird_watching_hide.jpg')`);

    db.run(`SELECT 1`, () => {
        console.log('Database setup complete!');
        console.log('5 Habitats added');
        console.log('15 Experiences added');
        console.log('5 Events added');
        db.close();
    });
});
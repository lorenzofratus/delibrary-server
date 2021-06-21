/*
The following SQL instructions are used to insert demo data inside the database.
*/

/* Local:
>>> sudo -i -u postgres psql
>>> \c delibrarydb;
*/

/* Remote:
>>> heroku pg:psql
*/

DELETE FROM users;
DELETE FROM wishes;
DELETE FROM properties;
DELETE FROM exchanges;
DELETE FROM archivedexchanges;

INSERT INTO users("username", "name", "surname", "email", "password") VALUES
    ('nicheosala', 'Nicolò', 'Sala', 'nicolo@delibrary.com', '#Delibrary03'),
    ('fratus', 'Lorenzo', 'Fratus', 'lorenzo@delibrary.com', '#Delibrary03'),
    ('jst_greg', 'Gregorio', 'Ferraresi', 'gregorio@delibrary.com', '#Delibrary03'),
    ('teo', 'Matteo', 'Fruscalzo', 'matteo@delibrary.com', '#Delibrary03');

INSERT INTO properties("id", "owner", "bookId", "town", "province") VALUES
    (38, 'nicheosala', 'MNOPWJTvuxoC', 'osnago', 'lecco'),
    (39, 'nicheosala', '4FuHoAEACAAJ', 'osnago', 'lecco'),
    (40, 'nicheosala', 'rL4bAQAAIAAJ', 'osnago', 'lecco'),
    (41, 'nicheosala', 'A3WXCgAAQBAJ', 'olgiate molgora', 'lecco'),
    -- (42, 'fratus', 'cnWXCgAAQBAJ', 'bergamo', 'bergamo'),
    -- (43, 'fratus', 'h-oYDQAAQBAJ', 'bergamo', 'bergamo'),
    -- (44, 'fratus', 'ruKRmQEACAAJ', 'bergamo', 'bergamo'),
    -- (45, 'fratus', '-BXrDAEACAAJ', 'arcore', 'monza e della brianza'),
    (46, 'jst_greg', 'QR0YuAEACAAJ', 'bergamo', 'bergamo'),
    (47, 'jst_greg', 'GlzfAgAAQBAJ', 'olgiate molgora', 'lecco'),
    (48, 'jst_greg', '0_FgngEACAAJ', 'olgiate molgora', 'lecco'),
    (49, 'jst_greg', 'nrd6twAACAAJ', 'olgiate molgora', 'lecco'),
    (50, 'teo', 'sgysngEACAAJ', 'bergamo', 'bergamo'),
    (51, 'teo', '2NBtEj5gSpUC', 'olgiate molgora', 'lecco'),
    (52, 'teo', 'psWKDwAAQBAJ', 'arcore', 'monza e della brianza'),
    (53, 'teo', 'h0kQEAAAQBAJ', 'arcore', 'monza e della brianza');

INSERT INTO wishes("user", "bookId") VALUES
    ('fratus', 'VuujDwAAQBAJ'),
    -- ('fratus', '2NBtEj5gSpUC'),
    ('nicheosala', '2NBtEj5gSpUC'),
    ('nicheosala', 'nrd6twAACAAJ');


INSERT INTO archivedexchanges("buyer", "seller", "propertyBookId", "status", "paymentBookId") VALUES
    ('jst_greg', 'nicheosala', 'MNOPWJTvuxoC', 'refused', null),
    ('jst_greg', 'nicheosala', 'QR0YuAEACAAJ', 'happened', '4FuHoAEACAAJ'),
    ('teo', 'nicheosala', 'psWKDwAAQBAJ', 'happened', 'rL4bAQAAIAAJ');

INSERT INTO exchanges("buyer", "seller", "property", "status", "payment") VALUES
    ('teo', 'nicheosala', 40, 'proposed', null),
    ('jst_greg', 'nicheosala', 38, 'proposed', null),
    ('nicheosala', 'teo', 50, 'proposed', null),
    ('nicheosala', 'teo', 53, 'proposed', null),
    ('teo', 'nicheosala', 39, 'agreed', 52);

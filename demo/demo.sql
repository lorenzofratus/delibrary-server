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
    ('fratus', 'Lorenzo', 'Fratus', 'lorenzo@delibrary.com', 'VeryStrongPassword'),
    ('jst_greg', 'Gregorio', 'Ferraresi', 'gregorio@delibrary.com', 'VeryStrongPassword'),
    ('teo', 'Matteo', 'Fruscalzo', 'matteo@delibrary.com', 'VeryStrongPassword');

INSERT INTO properties("owner", "bookId", "town", "province") VALUES
    ('nicheosala', 'MNOPWJTvuxoC', 'osnago', 'lecco'),
    ('nicheosala', 'QR0YuAEACAAJ', 'osnago', 'lecco'),
    ('nicheosala', 'rL4bAQAAIAAJ', 'osnago', 'lecco'),
    ('nicheosala', 'A3WXCgAAQBAJ', 'olgiate molgora', 'lecco'),
    ('fratus', 'cnWXCgAAQBAJ', 'bergamo', 'bergamo'),
    ('fratus', 'h-oYDQAAQBAJ', 'bergamo', 'bergamo'),
    ('fratus', 'ruKRmQEACAAJ', 'bergamo', 'bergamo'),
    ('fratus', '-BXrDAEACAAJ', 'arcore', 'monza e della brianza'),
    ('jst_greg', '4FuHoAEACAAJ', 'bergamo', 'bergamo'),
    ('jst_greg', 'GlzfAgAAQBAJ', 'olgiate molgora', 'lecco'),
    ('jst_greg', '0_FgngEACAAJ', 'olgiate molgora', 'lecco'),
    ('jst_greg', 'nrd6twAACAAJ', 'olgiate molgora', 'lecco'),
    ('teo', 'sgysngEACAAJ', 'bergamo', 'bergamo'),
    ('teo', '2NBtEj5gSpUC', 'olgiate molgora', 'lecco'),
    ('teo', 'psWKDwAAQBAJ', 'arcore', 'monza e della brianza'),
    ('teo', 'h0kQEAAAQBAJ', 'arcore', 'monza e della brianza');

INSERT INTO wishes("user", "bookId") VALUES
    ('nicheosala', '2NBtEj5gSpUC'),
    ('nicheosala', 'nrd6twAACAAJ'),
    ('fratus', 'rL4bAQAAIAAJ'),
    ('fratus', '2NBtEj5gSpUC');


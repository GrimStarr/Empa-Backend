CREATE TABLE account(
    id  SERIAL PRIMARY KEY,
    username  VARCHAR(64),
    "passwordHash" VARCHAR(64)
);

CREATE TABLE banner(
    id SERIAL PRIMARY KEY,
    title   VARCHAR(256),
    body TEXT,
    imgURL  VARCHAR(256),
    link VARCHAR(256)
);

CREATE TABLE services(
    id SERIAL PRIMARY KEY,
    title    VARCHAR(64),
    icon    VARCHAR(256),
    body    TEXT
);

CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    title    VARCHAR(64),
    logo    VARCHAR(256),
    body    TEXT
);

CREATE TABLE vendors(
    id SERIAL PRIMARY KEY,
    title    VARCHAR(64),
    logo    VARCHAR(256),
    body    TEXT
);

CREATE TABLE news(
    id SERIAL PRIMARY KEY,
    title    VARCHAR(256),
    imgURL    VARCHAR(256),
    brief   TEXT,
    body    TEXT
);

CREATE TABLE forms(
    id SERIAL PRIMARY KEY,
    "itemType"  VARCHAR(64), /* training, product, service */
    fullname   VARCHAR(256),
    email    VARCHAR(64),
    phone   VARCHAR(64),
    company VARCHAR(256),
    quantity    INT,
    body TEXT
);

CREATE TABLE milestones(
    id SERIAL PRIMARY KEY,
    year    SMALLINT,
    imgURL  VARCHAR(256),
    body    TEXT
);

CREATE TABLE traings(
    id SERIAL PRIMARY KEY,
    category    VARCHAR(64),
    title   VARCHAR(256),
    brief   TEXT,
    capacity    SMALLINT,
    price   INT,
    duration    VARCHAR(256),
    imgURL  VARCHAR(256),
    body    TEXT
);

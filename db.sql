CREATE DATABASE Artimia;
USE Artimia;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) ,
    last_name VARCHAR(50) ,
    username VARCHAR(50) UNIQUE ,
    email VARCHAR(100) UNIQUE ,
    phone_number VARCHAR(20),
    password_hash VARCHAR(100) ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    username VARCHAR(50) PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE ,
    password_hash VARCHAR(255) ,
    INDEX idx_phone (phone_number)
);


CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) ,
    base_price DECIMAL(10,2) ,
    description TEXT,
    style VARCHAR(50),
    main_image_url VARCHAR(255),
    times_bought INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX style_index (style),
    INDEX created_at_index(created_at)
);



CREATE TABLE product_sizes (
    size_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    size ENUM('SMALL', 'MEDIUM', 'LARGE'),
    length DECIMAL(5,2),
    width DECIMAL(5,2),
    quantity INT DEFAULT 0,
    additional_price DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE (product_id, size)
);

-- Fareed Dialogues System
CREATE TABLE fareed_dialogues (
    dialogue_id INT PRIMARY KEY AUTO_INCREMENT,
    dialogue_text TEXT,
    context ENUM('WELCOME', 'CHECKOUT', 'HELP') DEFAULT 'HELP',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Order System
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT ,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) ,
    status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    shipping_address TEXT ,
    payment_method ENUM('CREDIT_CARD', 'PAYPAL', 'COD') ,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX order_status_index (status)
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT ,
    product_id INT ,
    size_id INT ,
    quantity INT ,
    unit_price DECIMAL(10,2) ,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (size_id) REFERENCES product_sizes(size_id)
);

-- Optional: Address Book for Users
CREATE TABLE user_addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT ,
    address_line1 VARCHAR(255) ,
    city VARCHAR(100) ,
    state VARCHAR(100) ,
    postal_code VARCHAR(20) ,
    country VARCHAR(100) ,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
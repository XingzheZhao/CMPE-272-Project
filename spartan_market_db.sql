DROP DATABASE IF EXISTS spartan_market;
CREATE DATABASE spartan_market;
USE spartan_market;

CREATE TABLE Users(
	user_id INT PRIMARY KEY,
    f_name INT NOT NULL,
    l_name INT NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    phone_num VARCHAR(20) NOT NULL,
    rating FLOAT(2, 1),
    is_admin BOOL
);

CREATE TABLE Service(
	service_id INT PRIMARY KEY,
    service_name VARCHAR(50) NOT NULL,
    service_type VARCHAR(20) NOT NULL,
    service_price FLOAT NOT NULL,
    service_description VARCHAR(1000),
    post_datetime TIMESTAMP NOT NULL,
    course_tag VARCHAR(20)
 );
 
 CREATE TABLE Item(
	item_id INT PRIMARY KEY,
    item_name VARCHAR(50) NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    item_price FLOAT NOT NULL,
    is_exchange BOOL,
    exchange_demand VARCHAR(100),
    item_image BLOB,
    item_status VARCHAR(10) NOT NULL,
    post_datetime TIMESTAMP NOT NULL,
    item_description VARCHAR(1000) NOT NULL,
    course_tab VARCHAR(20)
 );
 
 CREATE TABLE InterestQueue(
	queue_id INT PRIMARY KEY,
    queue_position INT NOT NULL,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (item_id) REFERENCES Item(item_id)
 );
 
CREATE TABLE Record(
	record_id INT PRIMARY KEY,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    item_id INT,
    service_id INT,
    is_item BOOL,
    FOREIGN KEY (buyer_id) REFERENCES Users(user_id),
    FOREIGN KEY (seller_id) REFERENCES Users(user_id),
    FOREIGN KEY (item_id) REFERENCES Item(item_id),
    FOREIGN KEY (service_id) REFERENCES Service(service_id)
);

CREATE TABLE Report(
	report_id INT PRIMARY KEY,
    initiator_id INT NOT NULL,
    record_id INT NOT NULL,
    report_reason VARCHAR(30) NOT NULL,
    report_description VARCHAR(500),
    report_image BLOB,
    FOREIGN KEY (initiator_id) REFERENCES Users(user_id),
    FOREIGN KEY (record_id) REFERENCES Record(record_id)
);
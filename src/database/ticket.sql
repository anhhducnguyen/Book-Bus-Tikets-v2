create database db_prj_test;
use db_prj_test;

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `first_name` varchar(100),
  `last_name` varchar(100),
  `email` varchar(255),
  `password` varchar(255),
  `phone` varchar(11),
  `status` enum("ACTIVE","BLOCKED"),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `roles` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `role_name` enum("ROLE_ADMIN", "ROLE_USER")
);

CREATE TABLE `user_role` (
  `role_id` int,
  `user_id` int,
  PRIMARY KEY (`role_id`, `user_id`)
);

CREATE TABLE `stations` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `image` varchar(255),
  `wallpaper` varchar(255),
  `descriptions` longtext,
  `location` varchar(255),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `station_bus` (
  `station_id` int,
  `buse_id` int,
  PRIMARY KEY (`station_id`, `buse_id`)
);

CREATE TABLE `bus_companies` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `company_name` varchar(255),
  `image` varchar(255),
  `descriptions` longtext,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `buses` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `description` text,
  `license_plate` varchar(20),
  `capacity` int,
  `company_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `routes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `departure_station_id` int,
  `arrival_station_id` int,
  `price` double,
  `duration` int,
  `distance` int,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `schedules` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `route_id` int,
  `bus_id` int,
  `departure_time` datetime,
  `arrival_time` datetime,
  `available_seats` int,
  `total_seats` int,
  `status` enum("AVAILABLE","FULL","CANCELLED"),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `tickets` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `seat_id` int,
  `schedule_id` int,
  `departure_time` datetime,
  `arrival_time` datetime,
  `seat_type` enum("LUXURY","VIP","STANDARD"),
  `price` double,
  `status` enum("BOOKED","CAMCELLED"),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `bus_reviews` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `bus_id` int,
  `user_id` int,
  `rating` int,
  `review` varchar(255),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `banners` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `banner_url` varchar(255),
  `position` varchar(100)
);

CREATE TABLE `bus_image` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `image_url` varchar(255),
  `bus_id` int
);

CREATE TABLE `cancellation_policies` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `descriptions` text,
  `route_id` int,
  `cancellation_time_limit` int,
  `refund_percentage` int,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `payment_providers` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `provider_name` varchar(100),
  `provider_type` enum("CARD","E_WALLET","BANK_TRANSFER","QR_CODE"),
  `api_endpoint` varchar(255),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `payments` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `payment_provider_id` int,
  `user_id` int,
  `ticket_id` int,
  `payment_method` enum("CASH","ONLINE"),
  `amount` double,
  `status` enum("PENDING","COMPLETED","FAILED"),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `seats` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `bus_id` int,
  `seat_number` varchar(20),
  `seat_type` enum("LUXURY","VIP","STANDARD"),
  `status` enum("AVAILABLE","BOOKED"),
  `price_for_type_seat` double,
  `created_at` datetime,
  `updated_at` datetime
);

ALTER TABLE `user_role` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_role` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `station_bus` ADD FOREIGN KEY (`buse_id`) REFERENCES `buses` (`id`);

ALTER TABLE `station_bus` ADD FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`);

ALTER TABLE `routes` ADD FOREIGN KEY (`departure_station_id`) REFERENCES `stations` (`id`);

ALTER TABLE `routes` ADD FOREIGN KEY (`arrival_station_id`) REFERENCES `stations` (`id`);

ALTER TABLE `schedules` ADD FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`);

ALTER TABLE `schedules` ADD FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`);

ALTER TABLE `bus_reviews` ADD FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`);

ALTER TABLE `bus_reviews` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `bus_image` ADD FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`);

ALTER TABLE `cancellation_policies` ADD FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`);

ALTER TABLE `payments` ADD FOREIGN KEY (`payment_provider_id`) REFERENCES `payment_providers` (`id`);

ALTER TABLE `payments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `payments` ADD FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`);

-- ALTER TABLE `buses` ADD FOREIGN KEY (`capacity`) REFERENCES `bus_companies` (`id`);

ALTER TABLE `buses` ADD FOREIGN KEY (`company_id`) REFERENCES `bus_companies` (`id`);

ALTER TABLE `seats` ADD FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`);

ALTER TABLE `tickets` ADD FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`);

ALTER TABLE `tickets` ADD FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`);

-- Roles
INSERT INTO roles (role_name) VALUES 
  ("ROLE_ADMIN"), 
  ("ROLE_USER");

-- Users
INSERT INTO users (first_name, last_name, email, password, phone, status, created_at, updated_at)
VALUES 
('John', 'Doe', 'john@example.com', 'hashed_password', '0912345678', 'ACTIVE', NOW(), NOW()),
('Alice', 'Nguyen', 'alice@example.com', 'hashed_password', '0987654321', 'ACTIVE', NOW(), NOW());


-- User Roles
INSERT INTO user_role (role_id, user_id) 
VALUES 
(1, 1), 
(2, 2);

-- Bus Companies
INSERT INTO bus_companies (company_name, image, descriptions, created_at, updated_at)
VALUES 
('Hoang Long', 'company1.jpg', 'National bus company', NOW(), NOW()),
('Phuong Trang', 'company2.jpg', 'Comfort and quality', NOW(), NOW());

-- Buses
INSERT INTO buses (name, description, license_plate, capacity, company_id, created_at, updated_at)
VALUES 
('Bus 001', 'Luxury Sleeper Bus', '29A-12345', 40, 1, NOW(), NOW()),
('Bus 002', 'VIP Limousine Bus', '30B-67890', 20, 1, NOW(), NOW());

-- Stations
INSERT INTO stations (name, image, wallpaper, descriptions, location, created_at, updated_at)
VALUES 
('Hanoi Station', 'hanoi.jpg', 'wall1.jpg', 'Central station in Hanoi', 'Hanoi', NOW(), NOW()),
('Saigon Station', 'saigon.jpg', 'wall2.jpg', 'Southern station in Saigon', 'Ho Chi Minh City', NOW(), NOW());

-- Station Bus
INSERT INTO station_bus (station_id, buse_id) 
VALUES 
(1, 1), 
(2, 1), 
(2, 2);

-- Routes
INSERT INTO routes (departure_station_id, arrival_station_id, price, duration, distance, created_at, updated_at)
VALUES (1, 2, 250000, 900, 1700, NOW(), NOW());

-- Schedules
INSERT INTO schedules (route_id, bus_id, departure_time, arrival_time, available_seats, total_seats, status, created_at, updated_at)
VALUES 
(1, 1, '2025-05-10 08:00:00', '2025-05-10 23:00:00', 38, 40, 'AVAILABLE', NOW(), NOW());

-- Seats
INSERT INTO seats (bus_id, seat_number, seat_type, status, price_for_type_seat, created_at, updated_at)
VALUES 
(1, 'A1', 'LUXURY', 'AVAILABLE', 300000, NOW(), NOW()),
(1, 'A2', 'LUXURY', 'BOOKED', 300000, NOW(), NOW());

-- Tickets
INSERT INTO tickets (seat_id, schedule_id, departure_time, arrival_time, seat_type, price, status, created_at, updated_at)
VALUES 
(2, 1, '2025-05-10 08:00:00', '2025-05-10 23:00:00', 'LUXURY', 300000, 'BOOKED', NOW(), NOW());

-- Bus Reviews
INSERT INTO bus_reviews (bus_id, user_id, rating, review, created_at, updated_at)
VALUES (1, 2, 5, 'Very comfortable ride!', NOW(), NOW());

-- Banners
INSERT INTO banners (banner_url, position)
VALUES ('banner1.jpg', 'home_top');

-- Bus Images
INSERT INTO bus_image (image_url, bus_id)
VALUES ('bus1_img.jpg', 1);

-- Cancellation Policies
INSERT INTO cancellation_policies (descriptions, route_id, cancellation_time_limit, refund_percentage, created_at, updated_at)
VALUES ('Cancel 12 hours before departure for 80% refund', 1, 720, 80, NOW(), NOW());

-- Payment Providers
INSERT INTO payment_providers (provider_name, provider_type, api_endpoint, created_at, updated_at)
VALUES 
('MoMo', 'E_WALLET', 'https://api.momo.vn/pay', NOW(), NOW()),
('ZaloPay', 'E_WALLET', 'https://api.zalopay.vn/pay', NOW(), NOW());

-- Payments
INSERT INTO payments (payment_provider_id, user_id, ticket_id, payment_method, amount, status, created_at, updated_at)
VALUES (1, 2, 1, 'ONLINE', 300000, 'COMPLETED', NOW(), NOW());


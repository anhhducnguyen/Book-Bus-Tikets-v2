create database db_prj_test;
use db_prj_test;

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `first_name` varchar(100),
  `last_name` varchar(100),
  `email` varchar(255),
  `password` varchar(255),
  `phone` varchar(11),
  `status` enum("BOOKED","CANCELLED"),
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
  `bus_id` int,
  PRIMARY KEY (`station_id`, `bus_id`)
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

ALTER TABLE `station_bus` ADD FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`);

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

ALTER TABLE `buses` ADD FOREIGN KEY (`company_id`) REFERENCES `bus_companies` (`id`);

ALTER TABLE `seats` ADD FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`);

ALTER TABLE `tickets` ADD FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`);

ALTER TABLE `tickets` ADD FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`);

-- Crea il database
CREATE DATABASE IF NOT EXISTS `login_db`;
USE `login_db`;

-- Crea tabella prodotti
DROP TABLE IF EXISTS `prodotti`;
CREATE TABLE `prodotti` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prodotto` varchar(255) NOT NULL,
  `descrizione` text,
  `pezzi_magazzino` int NOT NULL DEFAULT '0',
  `prezzo` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_pezzi` CHECK ((`pezzi_magazzino` >= 0)),
  CONSTRAINT `chk_prezzo` CHECK ((`prezzo` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Inserisce i prodotti
INSERT INTO `prodotti` (`prodotto`, `descrizione`, `pezzi_magazzino`, `prezzo`) VALUES
('iPhone', '14 pro 128gb prova', 32, 896.00),
('iPhone', '14 pro 128gb', 65, 978.90),
('iPad', 'iPad Pro gen 6', 26, 456.37);

-- Crea tabella token_blacklist
DROP TABLE IF EXISTS `token_blacklist`;
CREATE TABLE `token_blacklist` (
  `token_id` varchar(255) NOT NULL,
  `revoked_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Crea tabella users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Inserisce user francesco@gmail.com
INSERT INTO `users` (`name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
('Francesco', 'francesco@gmail.com', '$2b$10$CBs4U/MXCdVEeGvpNOwdQ.vt7gOc90FN5M4FALSs7bDi0sQJ1pn36', 'admin', '2025-03-14 17:11:53', '2025-03-19 11:48:12');
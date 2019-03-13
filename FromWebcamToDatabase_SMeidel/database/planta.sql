-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 03. Mrz 2019 um 19:39
-- Server-Version: 10.1.37-MariaDB
-- PHP-Version: 7.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `planta`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `anbau`
--

CREATE TABLE `anbau` (
  `PrimKey` int(11) NOT NULL,
  `Datum` varchar(60) DEFAULT NULL,
  `Pflanze` varchar(50) DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `Ort` varchar(50) DEFAULT NULL,
  `Bild` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `anbau`
--

INSERT INTO `anbau` (`PrimKey`, `Datum`, `Pflanze`, `Status`, `Ort`, `Bild`) VALUES
(22, '0.2.119 16:1:17', 'Tomate', 'unreif', 'Dieburg', NULL);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `anbau`
--
ALTER TABLE `anbau`
  ADD PRIMARY KEY (`PrimKey`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `anbau`
--
ALTER TABLE `anbau`
  MODIFY `PrimKey` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

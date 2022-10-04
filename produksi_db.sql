-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 29, 2022 at 03:02 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `produksi_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `formula`
--

CREATE TABLE `formula` (
  `id` int(11) NOT NULL,
  `id_header` int(11) NOT NULL,
  `id_raw` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `formula`
--

INSERT INTO `formula` (`id`, `id_header`, `id_raw`) VALUES
(4, 28, 26),
(5, 29, 6);

-- --------------------------------------------------------

--
-- Table structure for table `kiln_process`
--

CREATE TABLE `kiln_process` (
  `id` int(10) NOT NULL,
  `id_item` int(10) NOT NULL,
  `weight` int(11) NOT NULL,
  `date_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kiln_process`
--

INSERT INTO `kiln_process` (`id`, `id_item`, `weight`, `date_at`) VALUES
(11, 28, 123, '2022-06-26 05:16:00'),
(14, 28, 10, '2022-06-27 22:06:00'),
(15, 28, 100, '2022-06-27 22:08:00'),
(16, 28, 50, '2022-06-27 22:10:00'),
(17, 28, 10, '2022-06-27 22:10:00'),
(18, 28, 7, '2022-06-27 22:11:00');

-- --------------------------------------------------------

--
-- Table structure for table `m_category`
--

CREATE TABLE `m_category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `m_category`
--

INSERT INTO `m_category` (`id`, `name`, `description`) VALUES
(1, 'Raw Material', 'bahan mentah untuk diolah'),
(2, 'Production Goods', 'Produk sudah siap dipasarkan');

-- --------------------------------------------------------

--
-- Table structure for table `m_item`
--

CREATE TABLE `m_item` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `id_category` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `m_item`
--

INSERT INTO `m_item` (`id`, `name`, `id_category`) VALUES
(6, 'Kelapa', 1),
(26, 'Kayu', 1),
(28, 'Arang Kayu', 2),
(29, 'Arang Kelapa', 2);

-- --------------------------------------------------------

--
-- Table structure for table `m_level`
--

CREATE TABLE `m_level` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `m_level`
--

INSERT INTO `m_level` (`id`, `name`, `description`) VALUES
(1, 'Admin', ''),
(2, 'Operator', '');

-- --------------------------------------------------------

--
-- Table structure for table `m_users`
--

CREATE TABLE `m_users` (
  `id` int(10) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `id_level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `m_users`
--

INSERT INTO `m_users` (`id`, `username`, `password`, `id_level`) VALUES
(27, 'cacad123', '$2a$10$DJx3gDFNbsD0MFF4bhZLVOAXFXTEs4wA9EJxujUeZl07hqJY3aWru', 1),
(28, 'cacad322', '$2a$10$5STOrIj85U6o06ytVxLqduXHMFEAnoz5K8BwdkvPYb19LKlbNt3J.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `storage`
--

CREATE TABLE `storage` (
  `id` int(11) NOT NULL,
  `id_item` int(11) NOT NULL,
  `total_weight` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `storage`
--

INSERT INTO `storage` (`id`, `id_item`, `total_weight`) VALUES
(5, 6, 350),
(9, 26, 73),
(11, 28, 300),
(12, 29, 0);

-- --------------------------------------------------------

--
-- Table structure for table `trans_in`
--

CREATE TABLE `trans_in` (
  `id` int(11) NOT NULL,
  `id_item` int(10) NOT NULL,
  `date_in` datetime NOT NULL,
  `id_user` int(10) NOT NULL,
  `delivery_note` varchar(255) NOT NULL,
  `weight` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `trans_in`
--

INSERT INTO `trans_in` (`id`, `id_item`, `date_in`, `id_user`, `delivery_note`, `weight`) VALUES
(1, 6, '2022-06-27 02:05:00', 27, 'cobain dulu ya ges ya', 200),
(2, 26, '2022-06-27 03:00:42', 27, 'cobain lagi ya ges ya', 250),
(4, 6, '2022-06-27 21:24:00', 27, 'tes', 100),
(5, 6, '2022-06-27 21:26:00', 27, 'testes', 50);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `formula`
--
ALTER TABLE `formula`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kiln_process`
--
ALTER TABLE `kiln_process`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `m_category`
--
ALTER TABLE `m_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `m_item`
--
ALTER TABLE `m_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `m_level`
--
ALTER TABLE `m_level`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `m_users`
--
ALTER TABLE `m_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `storage`
--
ALTER TABLE `storage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trans_in`
--
ALTER TABLE `trans_in`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `formula`
--
ALTER TABLE `formula`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `kiln_process`
--
ALTER TABLE `kiln_process`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `m_category`
--
ALTER TABLE `m_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `m_item`
--
ALTER TABLE `m_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `m_level`
--
ALTER TABLE `m_level`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `m_users`
--
ALTER TABLE `m_users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `storage`
--
ALTER TABLE `storage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `trans_in`
--
ALTER TABLE `trans_in`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

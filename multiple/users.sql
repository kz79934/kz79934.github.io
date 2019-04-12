-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 04, 2017 at 08:45 AM
-- Server version: 5.5.34
-- PHP Version: 5.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `users`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `userId` int(8) NOT NULL AUTO_INCREMENT,
  `event` varchar(55) NOT NULL,
  `topic` varchar(55) NOT NULL,
  `topic_desc` varchar(55) NOT NULL,
  `date` varchar(55) NOT NULL,
  `speaker` varchar(55) NOT NULL,
  `building` varchar(55) NOT NULL,
  `room` varchar(55) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=28 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `event`, `topic`, `topic_desc`, `date`, `speaker`, `building`, `room`) VALUES
(24, 'shashi', 'a', 'vxcvcxv', '12/10/2012', '2', 'hkhk', '0'),
(26, 'vishaldfdsf', 'aadasda', 'merlin', '12/10/2012', '246546', 'ytry', '6'),
(27, 'saumyadsfdsf', 'adfdsfds', 'Matthew Benedict', '12/10/2012', '264645', 'ytrty', '45446');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

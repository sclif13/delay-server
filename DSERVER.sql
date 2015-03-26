-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Мар 26 2015 г., 21:29
-- Версия сервера: 5.5.41-0ubuntu0.14.04.1
-- Версия PHP: 5.5.9-1ubuntu4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `DSERVER`
--

-- --------------------------------------------------------

--
-- Структура таблицы `tserver`
--

CREATE TABLE IF NOT EXISTS `tserver` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `db_start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `db_ip` varchar(20) NOT NULL,
  `db_count` int(11) NOT NULL,
  `db_timer` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=37 ;

--
-- Дамп данных таблицы `tserver`
--

INSERT INTO `tserver` (`id`, `db_start_time`, `db_ip`, `db_count`, `db_timer`) VALUES
(31, '2015-03-26 15:19:35', '192.168.88.230', 1, 3),
(32, '2015-03-26 15:19:35', '192.168.88.231', 2, 9),
(33, '2015-03-26 15:24:39', '192.168.88.230', 2, 6),
(34, '2015-03-26 15:24:39', '192.168.88.231', 2, 11),
(35, '2015-03-26 15:34:46', '192.168.88.230', 0, 0),
(36, '2015-03-26 15:34:46', '192.168.88.231', 0, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

const chalk = require('chalk');
const errorColor = 'redBright';
const successColor = 'greenBright';
const warningColor = 'yellowBright';
const infoColor = 'whiteBright';

let logoString = '\r' + chalk.whiteBright('[jay-app-cli]') + ' ';
let infoString = function(color, message) {
  return chalk.bold[color](message) + ' ';
};

exports.error = (message, color = errorColor) => {
  return console.log(logoString + infoString(color, 'ERROR') + message);
};

exports.success = (message, color = successColor) => {
  return console.log(logoString + infoString(color, 'SUCCESS') + message);
};

exports.warning = (message, color = warningColor) => {
  return console.log(logoString + infoString(color, 'WARN') + message);
};

exports.info = (message, color = infoColor) => {
  return console.log(logoString + infoString(color, 'INFO') + message);
};

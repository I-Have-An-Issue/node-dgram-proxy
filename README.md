# node-dgram-proxy
[![GitHub issues](https://img.shields.io/github/issues/I-Have-An-Issue/node-dgram-proxy)](https://github.com/I-Have-An-Issue/node-dgram-proxy/issues)
[![GitHub forks](https://img.shields.io/github/forks/I-Have-An-Issue/node-dgram-proxy)](https://github.com/I-Have-An-Issue/node-dgram-proxy/network)
[![GitHub stars](https://img.shields.io/github/stars/I-Have-An-Issue/node-dgram-proxy)](https://github.com/I-Have-An-Issue/node-dgram-proxy/stargazers)
[![GitHub license](https://img.shields.io/github/license/I-Have-An-Issue/node-dgram-proxy)](https://github.com/I-Have-An-Issue/node-dgram-proxy)  
[![forthebadge](https://forthebadge.com/images/badges/compatibility-club-penguin.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-by-crips.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-wordpress.svg)](https://forthebadge.com)  

## Usage
`<insert documentation here>`

## Concerns
Someone with a large block of IPv4 addresses can spam the "manager", and make the proxy crash from running out of resources.  
"Workers" will only last for 30 seconds, but if the attacker continues to send garbage data, the "worker" will not terminate.
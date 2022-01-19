# node-dgram-proxy
An automatically-scaling UDP proxy.

## Usage
`<insert documentation here>`

## Concerns
Someone with a large block of IPv4 addresses can spam the "manager", and make the proxy crash from running out of resources.  
"Workers" will only last for 5 seconds, but if the attacker continues to send garbage data, the "worker" will not terminate.
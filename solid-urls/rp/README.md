# Reverse proxy


This node provides a reverse proxy and load balancing function by:

1. Forwarding port 80 GET requests to '/' to the frontend docker network at port 8080
1. Forwarding port 80 POST requests to '/' to the frontend docker network at port 8081
1. Forwarding port 80 GET requests made to '/{:id}', where id is a string that matches [a-zA-Z0-9] to the frontend docker network on port 8081
1. Rejects any requests to other routes and any methods that are not http
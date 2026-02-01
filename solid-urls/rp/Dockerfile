# STAGE 1: Use an Alpine base image to install HAProxy
FROM haproxy:3.3-alpine

# MAINTAINER instruction (optional but good practice)
# LABEL maintainer="Luis A. Rodriguez <larc63>"

# Create necessary directories and copy config
RUN mkdir -p /var/lib/haproxy && chown haproxy:haproxy /var/lib/haproxy

# Copy the HAProxy configuration file into the container
# The configuration file must be placed in the /usr/local/etc/haproxy/ directory
COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

# Expose the default HTTP port (80) and the stats port (8080)
EXPOSE 80
EXPOSE 8081

# The default command specified in the base image will run haproxy
# CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]

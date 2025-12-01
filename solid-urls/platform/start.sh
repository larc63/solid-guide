#!/bin/bash
# Start continuous build in the background (optional, but ensures class files are updated)
(./gradlew build --continuous &)

# Start the Spring Boot application
./gradlew bootRun
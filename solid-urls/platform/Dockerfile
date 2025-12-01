
# ============================================
# Stage 1: Base - Common dependencies
# ============================================
FROM gradle:jdk21-ubi AS base

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

RUN ./gradlew dependencies

# ============================================
# Stage 2: Development - Hot reload with devtools
# ============================================
FROM base AS development

COPY src ./src
COPY start.sh .

EXPOSE 8080

# RUN ./gradlew build --warning-mode all  && java -jar build/libs/gs-spring-boot-docker-0.1.0.jar
ENTRYPOINT ["./start.sh"]

# ============================================
# Stage 3: Test - Run unit tests
# ============================================
FROM base AS test
COPY src ./src

ENTRYPOINT ["./gradlew", "test", "--continuous"]


# ============================================
# Stage 4: Build - Create production JAR
# ============================================
FROM base AS build
# RUN ./gradlew build --warning-mode all  && java -jar build/libs/gs-spring-boot-docker-0.1.0.jar
RUN ./gradlew build


# ============================================
# Stage 5: Production - Lightweight runtime with Tomcat
# ============================================
FROM tomcat:9.0.111-jdk21-corretto-al2


# Copy custom Tomcat configuration
# COPY tomcat-config/server.xml /usr/local/tomcat/conf/
# COPY tomcat-config/context.xml /usr/local/tomcat/conf/
# COPY tomcat-config/web.xml /usr/local/tomcat/conf/

COPY --from=build /app/build/libs/platform-0.0.1.war /usr/local/tomcat/webapps/

EXPOSE 8080

CMD ["catalina.sh", "run"]



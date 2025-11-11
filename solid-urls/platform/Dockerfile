FROM gradle:jdk21-ubi AS build

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

RUN ./gradlew dependencies

COPY src src

# RUN ./gradlew build --warning-mode all  && java -jar build/libs/gs-spring-boot-docker-0.1.0.jar
RUN ./gradlew build

FROM tomcat:9.0.111-jdk21-corretto-al2

COPY --from=build /app/build/libs/platform-0.0.1.war /usr/local/tomcat/webapps/

EXPOSE 8080

CMD ["catalina.sh", "run"]



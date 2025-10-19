FROM gradle:jdk21-ubi

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

RUN ./gradlew dependencies

COPY src src

# RUN ./gradlew build --warning-mode all  && java -jar build/libs/gs-spring-boot-docker-0.1.0.jar
RUN ./gradlew bootJar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "build/libs/platform-0.0.1.jar"]



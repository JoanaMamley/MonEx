FROM openjdk:24
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

WORKDIR /app
COPY /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
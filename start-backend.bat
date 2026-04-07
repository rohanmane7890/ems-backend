@echo off
echo Starting EMS Backend in Force Mode...
.\mvnw.cmd spring-boot:run -Dspring-boot.run.fork=false
pause

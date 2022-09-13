#include "DHT.h"
#include <ArduinoJson.h>

#define SoilMoisturePin A1
#define SoilMoistureActivePin 9

#define DHTPIN A2

#define WaterLevelPin A3
#define WaterLevelActivePin 8

DHT dht(DHTPIN, DHT11);



void setup() {
  Serial.begin(9600);

  pinMode(SoilMoisturePin, INPUT);
  pinMode(SoilMoistureActivePin, OUTPUT);

  pinMode(WaterLevelPin, INPUT);
  pinMode(WaterLevelActivePin, OUTPUT);

  dht.begin();

}

void loop() {
  StaticJsonDocument<200> sensorsData;

  digitalWrite(SoilMoistureActivePin, HIGH);    
  digitalWrite(WaterLevelActivePin, HIGH);

  delay(1000);
 
  float soilMoisture = analogRead(SoilMoisturePin);
  float waterLevel = analogRead(WaterLevelPin);
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  sensorsData["soilMoisture"] = map(soilMoisture, 1003, 190, 0, 100);
  sensorsData["waterLevel"] = map(waterLevel, 60, 430, 0, 100); 
  sensorsData["temperature"] = temperature;  
  sensorsData["humidity"] = humidity; 
  
  digitalWrite(SoilMoistureActivePin, LOW);    
  digitalWrite(WaterLevelActivePin, LOW);
  delay(10000);    

  serializeJson(sensorsData,Serial);
  Serial.println("");       

}

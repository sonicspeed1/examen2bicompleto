#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT11
#define QM135PIN 34

const char* ssid = "TP-Link_5974";
const char* password = "11568773";
const char* serverName = "http://192.168.0.7:3000/frutas/datos";

const float Rl = 10.0;  

const float CO2Curve[3] = {2.3, 0.72, -0.34};
const float NH3Curve[3] = {2.3, 0.77, -0.39};
const float SmokeCurve[3] = {2.3, 0.53, -0.44};

float R0; 

float getResistance(int raw_adc) {
  return (1023.0 / (float)raw_adc - 1.0) * Rl;
}


float getPPM(float Rs, const float *curve) {
  return pow(10, ((log10(Rs / R0) - curve[1]) / curve[2]) + curve[0]);
}

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();

  // Conectar al WiFi
  WiFi.begin(ssid, password);
  int wifiRetries = 0;
  while (WiFi.status() != WL_CONNECTED && wifiRetries < 20) {
    delay(500);
    Serial.println("Conectando al WiFi...");
    wifiRetries++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Conectado al WiFi");
  } else {
    Serial.println("No se pudo conectar al WiFi");
  }

 
  Serial.println("Calibrando el sensor MQ-135...");
  delay(20000); 
  int calidadAire = analogRead(QM135PIN);
  float rs = getResistance(calidadAire);
  R0 = rs / 9.83; 
  Serial.print("R0: ");
  Serial.println(R0);
  Serial.println("Listo.");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    float temperatura = dht.readTemperature();
    float humedad = dht.readHumidity();
    int calidadAire = analogRead(QM135PIN);
    float rs = getResistance(calidadAire);

    if (isnan(temperatura) || isnan(humedad) || calidadAire == 0) {
      Serial.println("Error al leer los datos del sensor");
      return;
    }

    float monoxidoCarbono = getPPM(rs, CO2Curve);
    float amoniaco = getPPM(rs, NH3Curve);
    float humo = getPPM(rs, SmokeCurve);

    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"temperatura\":" + String(temperatura) +
                         ",\"humedad\":" + String(humedad) +
                         ",\"amoniaco\":" + String(amoniaco) +
                         ",\"monoxidoCarbono\":" + String(monoxidoCarbono) +
                         ",\"humo\":" + String(humo) + "}";

   
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error en la solicitud POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("Error de conexión WiFi");
  }

  delay(60000); 
}
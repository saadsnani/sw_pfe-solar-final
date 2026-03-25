#include <WiFi.h>
#include <HTTPClient.h>

// WiFi credentials
const char* ssid = "ssss";
const char* password = "01010101";

// Firebase test endpoint
const char* firebaseHost = "https://fir-esp-16cb0-default-rtdb.europe-west1.firebasedatabase.app";
const char* firebasePath = "/allData.json"; // kolchi yb9a f dossier wahd

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" Connected!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(firebaseHost) + String(firebasePath);
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    // Generate random temperature and humidity
    float temperature = random(200, 400) / 10.0; // 20.0 to 40.0
    float humidity = random(300, 900) / 10.0;    // 30.0 to 90.0

    String jsonPayload = "{";
    jsonPayload += "\"temperature\":" + String(temperature, 1) + ", ";
    jsonPayload += "\"humidity\":" + String(humidity, 1) + ", ";
    jsonPayload += "\"source\":\"esp32_test\"}";

    int httpResponseCode = http.POST(jsonPayload); // POST kayzid entry jdida f allData

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      Serial.println(http.getString());
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
  delay(5000); // update every 5 seconds
}

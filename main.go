package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"math/rand"
	"net/http"
)

// Order struct represents the data to be sent in the POST request
type Order struct {
    Quantity float64 `json:"quantity"`
}

var tmpl *template.Template

func init() {
    // Read the HTML template file
    templateFile, err := ioutil.ReadFile("index.gohtml")
    if err != nil {
        panic(err)
    }

    // Create a template from the file content
    tmpl, err = template.New("index").Parse(string(templateFile))
    if err != nil {
        panic(err)
    }
}

func main() {
    // Create a simple HTTP server
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        // Generate a random quantity for the order
        goQuantity := rand.Float64()

        // Create an Order instance
        order := Order{Quantity: goQuantity}

        // Convert the Order struct to JSON
        orderJSON, err := json.Marshal(order)
        if err != nil {
            http.Error(w, "Error converting order to JSON", http.StatusInternalServerError)
            return
        }

        // Make a POST request to the Node server with the order data
        nodeURL := "http://localhost:5173/"
        resp, err := http.Post(nodeURL, "application/json", bytes.NewBuffer(orderJSON))
        if err != nil {
            http.Error(w, "Error making POST request to Node server", http.StatusInternalServerError)
            return
        }
        defer resp.Body.Close()

        // Read the HTML response from the Node server
        nodeBody, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            http.Error(w, "Error reading response from Node server", http.StatusInternalServerError)
            return
        }

        // Execute the template with the Node response
		var renderedTemplate bytes.Buffer
		err = tmpl.Execute(&renderedTemplate, map[string]interface{}{
			"NodeResponse": template.HTML(nodeBody),
		})
		if err != nil {
			http.Error(w, "Error executing template", http.StatusInternalServerError)
			return
		}

        // Set the Content-Type header to text/html
        w.Header().Set("Content-Type", "text/html")

        // Write the rendered template back to the client
        w.Write(renderedTemplate.Bytes())
    })

    // Start the server on port 8080
    port := 8080
    fmt.Printf("Server started on :%d\n", port)
    err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
    if err != nil {
        fmt.Println("Server error:", err)
    }
}
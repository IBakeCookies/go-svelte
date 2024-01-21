package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	// Create a simple HTTP server
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Make a POST request to the Node server
		nodeURL := "http://localhost:5173/"
		resp, err := http.Post(nodeURL, "application/json", nil)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		// Read the HTML response from the Node server
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// Set the Content-Type header to text/html
		w.Header().Set("Content-Type", "text/html")

		// Write the HTML response from the Node server back to the original client
		w.Write(body)
	})

	// Start the server on port 8080
	port := 8080
	fmt.Printf("Server started on :%d\n", port)
	
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)

	if err != nil {
		fmt.Println("Server error:", err)
	}
}
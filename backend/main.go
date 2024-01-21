package main

import (
	"net/http"
	"log"
	"strconv" // Import the strconv package
)

func main() {
	// Specify the directory to serve static files from
	publicDir := "./public"

	// Create a file server to serve static files
	fileServer := http.FileServer(http.Dir(publicDir))

	// Handle requests by serving static files
	http.Handle("/", fileServer)

	// Start the server on port 8080
	port := 8080
	log.Printf("Server started on :%d\n", port)
	err := http.ListenAndServe(":" + strconv.Itoa(port), nil)
	if err != nil {
		log.Fatal("Server error: ", err)
	}
}
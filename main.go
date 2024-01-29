package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"strings"
)

// User struct represents user data
type User struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
}

// Context struct represents the context data to be sent in the POST request
type Context struct {
	Data struct {
		User User `json:"user"`
	} `json:"data"`
	Path string `json:"path"`
}

func main() {
	// Create a simple HTTP server
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Exclude /favicon.ico path
		if r.URL.Path != "/favicon.ico" {
			// Create a sample user
			user := User{
				Firstname: "",
				Lastname:  "",
			}

            if r.URL.Path == "/" {
                user = User{
                    Firstname: "John",
                    Lastname:  "Doe",
                }
            }

			// Create a context instance
			context := Context{
				Data: struct {
					User User `json:"user"`
				}{
					User: user,
				},
				Path: r.URL.Path, // Use the path from the request
			}

			// Convert the Context struct to JSON
			contextJSON, err := json.Marshal(context)
			if err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			// Make a POST request to the Node server only for specific paths
			if isValidPath(r.URL.Path) {
				nodeURL := "http://localhost:5173/"
				resp, err := http.Post(nodeURL, "application/json", bytes.NewBuffer(contextJSON))
				if err != nil {
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}
				defer resp.Body.Close()

				// Read the HTML response from the Node server
				nodeBody, err := ioutil.ReadAll(resp.Body)
				if err != nil {
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}

				// Set the Content-Type header to text/html
				w.Header().Set("Content-Type", "text/html")

				// Parse the HTML template file
				templateFile, err := ioutil.ReadFile("index.gohtml")
				if err != nil {
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}

				// Create a template from the file content
				tmpl, err := template.New("index").Parse(string(templateFile))
				if err != nil {
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}

				// Execute the template with the Node response and context data
				var renderedTemplate bytes.Buffer
				err = tmpl.Execute(&renderedTemplate, map[string]interface{}{
					"NodeResponse": template.HTML(string(nodeBody)),
					"ContextJSON":  template.JS(string(contextJSON)),
				})
				if err != nil {
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}

				// Write the rendered template back to the client
				w.Write(renderedTemplate.Bytes())
			} else {
				// Handle other paths here if needed
				http.Error(w, "Not Found", http.StatusNotFound)
			}
		} else {
			// Handle /favicon.ico request separately if needed
			http.ServeFile(w, r, "path/to/your/favicon.ico")
		}
	})

	// Serve static assets from the dist/client/assets directory
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("dist/client/assets"))))

	// Start the server on port 8080
	port := 8080
	fmt.Printf("Server started on :%d\n", port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		fmt.Println("Server error:", err)
	}
}

// Function to check if the path is valid for making a request to Node server
func isValidPath(path string) bool {
	// Add your logic for valid paths here
	// For example, allow requests only for /, /about, /spa, and /ssr
	validPaths := map[string]bool{
		"/":    true,
		"/about": true,
		"/spa":   true,
        "/spa1":   true,
        "/ssr":   true,
        "/ssr1":   true,
	}

    	// Allow paths with a dynamic parameter like /slug/:id
	if strings.HasPrefix(path, "/slug/") {
		return true
	}

	return validPaths[path]
}
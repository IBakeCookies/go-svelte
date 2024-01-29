package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"net/http"
	"os"
	"strings"
)

type User struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
}

type Context struct {
	Data struct {
		User User `json:"user"`
	} `json:"data"`
	Path string `json:"path"`
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/favicon.ico" {
			user := User{
				Firstname: "",
				Lastname:  "",
			}

            if r.URL.Path == "/spa" || r.URL.Path == "/spa1" {
                user = User{
                    Firstname: "John",
                    Lastname:  "Doe",
                }
            }

			context := Context{
				Data: struct {
					User User `json:"user"`
				}{
					User: user,
				},
				Path: r.URL.Path, 
			}

			contextJSON, err := json.Marshal(context)
			if err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			if isValidPath(r.URL.Path) {
				nodeURL := "http://localhost:5173/"
				resp, err := http.Post(nodeURL, "application/json", bytes.NewBuffer(contextJSON))
				if err != nil {
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}
				defer resp.Body.Close()

				nodeBody, err := io.ReadAll(resp.Body)
				if err != nil {
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}

				w.Header().Set("Content-Type", "text/html")

				templateFile, err := os.ReadFile("index.gohtml")
				if err != nil {
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}

				tmpl, err := template.New("index").Parse(string(templateFile))
				if err != nil {
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}

				var renderedTemplate bytes.Buffer
				err = tmpl.Execute(&renderedTemplate, map[string]interface{}{
					"NodeResponse": template.HTML(string(nodeBody)),
					"ContextJSON":  template.JS(string(contextJSON)),
				})
				if err != nil {
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}

				w.Write(renderedTemplate.Bytes())
			} else {
				http.Error(w, "Not Found", http.StatusNotFound)
			}
		} else {
			http.ServeFile(w, r, "path/to/your/favicon.ico")
		}
	})

	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("dist/client/assets"))))

	port := 8080
	fmt.Printf("Server started on :%d\n", port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		fmt.Println("Server error:", err)
	}
}

func isValidPath(path string) bool {
	validPaths := map[string]bool{
		"/":    true,
		"/about": true,
		"/spa":   true,
        "/spa1":   true,
        "/ssr":   true,
        "/ssr1":   true,
	}

	if strings.HasPrefix(path, "/slug/") {
		return true
	}

	return validPaths[path]
}
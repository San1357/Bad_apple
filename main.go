package main

import (
	"bufio"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
)

var addr = "localhost:8182"

var upgrader = websocket.Upgrader{
	CheckOrigin: func(*http.Request) bool { return true },
}

func serveFrames(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	f, err := os.Open("frames")
	if err != nil {
		log.Fatal(err)
	}
	rd := bufio.NewReader(f)
	defer c.Close()
	for err == nil {
		line, err := rd.ReadBytes('\n')
		if err != nil {
			if err == io.EOF {
				return
			}
			log.Fatal(err)
		}
		err = c.WriteMessage(websocket.TextMessage, line)
		if err != nil {
			log.Print("write:", err)
			return
		}
		// 33300 microseconds = 30fps.
		// * 2 because DOM is too slow to handle 30fps, at least on my machine.
		time.Sleep(33300 * 2 * time.Microsecond)
	}
}

func main() {
	log.Printf("server started on %s", addr)
	http.HandleFunc("/", serveFrames)
	log.Fatal(http.ListenAndServe(addr, nil))
}

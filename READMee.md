# Bad Apple!! on the Github contributions graph

## Watch on Youtube
https://youtu.be/0ZcqUQ2wGME

## Run
Step 1, in terminal:
```bash
go run main.go
```
Step 2, in browser:
Navigate to a Github profile and copy&paste [script.js](script.js) into dev console.

## Other, more interesting, Bad Apple!! on X
- https://youtu.be/ko0z3SfXpm8
- https://youtu.be/r-axdVfM0c0
- https://youtu.be/tO6sfku_1b8

## Issues when running
Github CSP rules do not allow for websocket connections on localhost. Use
[this extension](https://chrome.google.com/webstore/detail/always-disable-content-se/ffelghdomoehpceihalcnbmnodohkibj)
to get over these rules. Don't forget to uninstall it after.

## Why use websockets?
Storing all frames in javascript was a little slow. Tried RLE, but they were still
too big/too many.

The server was easy and fast alternative for streaming the frames.

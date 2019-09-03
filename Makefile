test:
	elm-test

run:
	python -m SimpleHTTPServer 9999

cypress:
	./node_modules/.bin/cypress open

build:
	./elm make src/Examples/Main.elm --output=example.js

.PHONY: cypress

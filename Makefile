test:
	elm-test

run:
	python -m SimpleHTTPServer 9999

cypress:
	./node_modules/.bin/cypress open

build:
	elm make src/Examples/Main.elm --output=example.js

doc:
	elm make --docs=docs.json

.PHONY: cypress doc

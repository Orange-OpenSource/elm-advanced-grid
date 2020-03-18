#   Copyright (c) 2019 Orange
#
#   This code is released under the MIT license.
#
#   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
#
#   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
#
#   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


help:		## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

test:		## Runs unit tests
	elm-test

run:		## Runs a Python web server, for GUI tests
	python -m SimpleHTTPServer 9999

test_gui: build
test_gui: 	## Runs GUI tests, using Cypress
	./node_modules/.bin/cypress open

build:		## Compiles the basic example in project root dir, for GUI tests
	elm make src/Examples/Basic.elm --output=example.js --debug

live:		## Compiles using elm live
	elm-live src/Examples/Basic.elm -- --output=example.js --debug

live_large_list:		## Compiles large list using elm live
	elm-live src/Examples/LargeList.elm --dir docs --start-page LargeList.html -- --output=docs/largelist.js    --debug

doc:		## Compiles the examples
#	elm make src/Examples/Basic.elm --output=docs/basic.js --optimize
#	elm make src/Examples/LargeList.elm --output=docs/largelist.js --optimize
	elm make src/Examples/LargeList.elm --output=docs/largelist.js
	#elm make --docs=docs.json

.PHONY: doc

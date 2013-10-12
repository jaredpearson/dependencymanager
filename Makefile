
TESTS = test/*.js
LIB = lib/*.js

all: lint test

install:
	npm install

test:
	@echo running tests
	@NODE_ENV=test ./node_modules/.bin/mocha -u tdd $(TESTS)

test-debug:
	@NODE_ENV=test ./node_modules/.bin/mocha --debug-brk -u tdd $(TESTS)

lint:
	@echo running lint
	@./node_modules/.bin/jshint $(LIB)

clean:
	@echo running clean
	@rm -rf node_modules

.PHONY: all install test test-debug lint clean


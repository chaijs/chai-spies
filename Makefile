
TESTS = test/*.js
REPORTER = spec

all: clean
	@node support/compile.js

clean:
	@rm -f chai-spies.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(TESTS)

.PHONY: all clean test

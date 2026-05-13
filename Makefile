.PHONY: default test test-core verify-references build-react build-vue build-vanilla build-docs clean

default: test

test: test-core verify-references build-react build-vue build-vanilla build-docs

test-core:
	cd js && npm test

verify-references:
	cd js && npm run verify:references

build-react:
	cd react && npm run build

build-vue:
	cd vue && npm run build

build-vanilla:
	cd vanilla && npm run build

build-docs:
	cd docs-ui && npm run build

clean:
	rm -rf js/dist react/dist vue/dist vanilla/dist docs-ui/dist

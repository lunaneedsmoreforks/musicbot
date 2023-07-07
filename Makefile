all: clean build run
.PHONY: all

clean:
	@echo "Cleaning..."
	rm -rf ./out

build:
	@echo "Building..."
	npm run build

run:
	@echo "Running..."
	node ./out/src/index.js

out:
	@echo "mmfnggdnmfmfhmffhfmhfnfhfffffff"
	
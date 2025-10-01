.DEFAULT_GOAL := help

.PHONY: build package install clean help
# Cite: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help: ## Display this help page
	@grep -E '^[a-zA-Z%/_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


build: ## Build the extension
	@echo "Building extension... (make sure to run 'pnpm install' first)"
	pnpm install
	pnpm run compile

package: build ## Package the extension into a .vsix file
	@echo "Packaging extension..."
	pnpm run package

install-vs: package ## Install the packaged extension to VS Code
	@echo "Installing extension to VS Code..."
	code --install-extension google-java-formatter-0.0.1.vsix


install-cursor: package ## Install the packaged extension to VS Code
	@echo "Installing extension to VS Code..."
	cursor --install-extension google-java-formatter-0.0.1.vsix

clean: ## Clean build artifacts
	@echo "Cleaning build artifacts..."
	rm -rf out/
	rm -f *.vsix

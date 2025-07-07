#
# Simple Makefile for a Web Component Projects
#
PROJECT = CL-web-components

GIT_GROUP = caltechlibrary

WEB_COMPONENTS = ul-a-to-z-list.js textarea-agent-list.js textarea-csv.js table-sortable.js

RELEASE_DATE = $(shell date +%Y-%m-%d)

RELEASE_HASH=$(shell git log --pretty=format:'%h' -n 1)

HTML_PAGES = $(shell find . -type f | grep -E '.html$' | grep -v 'test?.html')

DOCS = $(shell ls -1 *.?.md)

PACKAGE = $(shell ls -1 *.go)

VERSION = $(shell grep '"version":' codemeta.json | cut -d\"  -f 4)

BRANCH = $(shell git branch | grep '* ' | cut -d  -f 2)

OS = $(shell uname)

#PREFIX = /usr/local/bin
PREFIX = $(HOME)

ifneq ($(prefix),)
	PREFIX = $(prefix)
endif

EXT =
ifeq ($(OS), Windows)
	EXT = .exe
endif

build: $(PROGRAMS) CITATION.cff README.md about.md version.js

hash: .FORCE
	git log --pretty=format:'%h' -n 1

version.js: .FORCE
	cmt codemeta.json version.js
	
CITATION.cff: codemeta.json
	cmt codemeta.json CITATION.cff

about.md: codemeta.json $(PROGRAMS)
	cmt codemeta.json about.md

website: .FORCE
	make -f website.mak

status:
	git status

save:
	@if [ "$(msg)" != "" ]; then git commit -am "$(msg)"; else git commit -am "Quick Save"; fi
	git push origin $(BRANCH)

refresh:
	git fetch origin
	git pull origin $(BRANCH)

publish: build website .FORCE
	./publish.bash

clean:
	-rm *.bak >/dev/null
	@if [ -d dist ]; then rm -fR dist; fi
	@if [ -d testout ]; then rm -fR testout; fi

dist: .FORCE
	@mkdir -p dist
	@rm -fR dist/* >/dev/null 
	deno bundle --platform=browser --outdir=dist $(WEB_COMPONENTS)
	deno bundle --platform=browser --output=dist/cl-web-components.js mod.js
	cp INSTALL.md dist/
	cp LICENSE dist/
	cp about.md dist/
	cp README.md dist/
	cp codemeta.json dist/
	cp CITATION.cff dist/
	cd dist && zip cl-web-components-$(VERSION).zip *.md LICENSE CITATION.cff codemeta.json $(WEB_COMPONENTS) cl-web-components.js

release: dist
	@printf "\nReady to do ./release.bash\n\n"

.FORCE:

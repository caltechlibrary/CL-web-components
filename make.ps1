# Simple PowerShell script for a Web Component Project

$PROJECT = "CL-web-components"
$GIT_GROUP = "caltechlibrary"
$WEB_COMPONENTS = @("ul-a-to-z-list.js", "textarea-agent-list.js", "textarea-csv.js", "table-sortable.js")
$RELEASE_DATE = Get-Date -Format "yyyy-MM-dd"
$RELEASE_HASH = git log --pretty=format:'%h' -n 1
$HTML_PAGES = Get-ChildItem -Recurse -Filter *.html | Where-Object { $_.Name -notmatch 'test?.html' } | ForEach-Object { $_.FullName }
$DOCS = Get-ChildItem -Filter *.md | ForEach-Object { $_.Name }
$PACKAGE = Get-ChildItem -Filter *.go | ForEach-Object { $_.Name }
$VERSION = (Get-Content codemeta.json | ConvertFrom-Json).version
$BRANCH = git branch | Select-String '\*' | ForEach-Object { $_.Line.Split(' ')[-1] }
$OS = $env:OS
$PREFIX = $HOME
$EXT = if ($OS -eq "Windows_NT") { ".exe" } else { "" }

function Build {
    deno task build
}

function Hash {
    git log --pretty=format:'%h' -n 1
}

function Generate-Readme {
    cmt codemeta.json README.md
}

function Generate-VersionJs {
    cmt codemeta.json version.js
}

function Generate-Citation {
    cmt codemeta.json CITATION.cff
}

function Generate-About {
    cmt codemeta.json about.md
}

function Website {
    & .\website.ps1 clean
    & .\website.ps1 build
}

function Status {
    git status
}

function Save {
    param([string]$msg = "Quick Save")
    git commit -am $msg
    git push origin $BRANCH
}

function Refresh {
    git fetch origin
    git pull origin $BRANCH
}

function Publish {
    Website
    .\publish.bash
}

function Clean {
    Remove-Item -Force *.bak -ErrorAction SilentlyContinue
    if (Test-Path dist) { Remove-Item -Recurse -Force dist }
    if (Test-Path testout) { Remove-Item -Recurse -Force testout }
}

function Dist {
    Build
    Remove-Item -Recurse -Force dist\* -ErrorAction SilentlyContinue

    deno task release

    # Define the list of files to copy
    $filesToCopy = @("INSTALL.md", "LICENSE", "about.md", "README.md", "codemeta.json", "CITATION.cff")
    Copy-Item -Path $filesToCopy -Destination dist

    # Define the list of files to compress
    $filesToCompress = @("*.md", "LICENSE", "CITATION.cff", "codemeta.json") + $WEB_COMPONENTS + "cl-web-components.js"

    # Change to the dist directory and compress the files
    Set-Location dist
    Compress-Archive -Path $filesToCompress -DestinationPath "cl-web-components-$VERSION.zip"
    Set-Location ..
}

function Release {
    Dist
    Write-Host "`nReady for release.`n"
}

# Main execution
switch ($args[0]) {
    "build" { Build }
    "hash" { Hash }
    "README.md" { Generate-Readme }
    "version.js" { Generate-VersionJs }
    "CITATION.cff" { Generate-Citation }
    "about.md" { Generate-About }
    "website" { Website }
    "status" { Status }
    "save" { Save $args[1] }
    "refresh" { Refresh }
    "publish" { Publish }
    "clean" { Clean }
    "dist" { Dist }
    "release" { Release }
    default { Write-Host "No valid target specified." }
}

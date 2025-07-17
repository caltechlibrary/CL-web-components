# PowerShell script for running pandoc on all Markdown docs ending in .md

$PROJECT = "CL-web-components"
$PANDOC = Get-Command pandoc | Select-Object -ExpandProperty Source
$MD_PAGES = Get-ChildItem -Filter *.md | ForEach-Object { $_.Name }
$HTML_PAGES = $MD_PAGES | ForEach-Object { $_ -replace '\.md$', '.html' }

function Build {
    Write-Output "Building HTML pages"
    foreach ($htmlPage in $HTML_PAGES) {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($htmlPage)
        $mdFile = "$baseName.md"
        if (Test-Path $PANDOC) {
            Write-Output "processing ${mdFile} into ${htmlPage}"
            & $PANDOC --metadata title=$baseName -s --to html5 $mdFile -o $htmlPage `
                --lua-filter=links-to-html.lua `
                --template=page.tmpl
        }

        if ($htmlPage -eq "README.html") {
            Write-Output "renaming ${htmlPage} to index.htnml"
            Remove-Item -Force index.html -ErrorAction SilentlyContinue
            Rename-Item README.html index.html
        }
    }
    Write-Output "Running PageFind "
    PageFind --verbose --glob="{*.html}" --force-language en-US `
        --exclude-selectors="nav,header,footer" --output-path pagefind --site .
    git add pagefind
}

# Main execution
switch ($args[0]) {
    "build" { Build }
    "pagefind" { Pagefind }
    default { Write-Host "No valid target specified." }
}

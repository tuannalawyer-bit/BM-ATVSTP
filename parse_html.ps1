# Parse HTML file to inspect input structures
Write-Host "Reading HTML file..."
$fileObj = Get-ChildItem -Path "d:\AI\BM ATVSTP" -Filter "*Checklist*.html" | Select-Object -First 1
$content = Get-Content -Raw -Path $fileObj.FullName -Encoding UTF8
Write-Host "Reading file: $($fileObj.Name)"

Write-Host "Checking file length: $($content.Length) characters"
Write-Host "----------------------------------------"

# Search for some keywords like 'csResultId', 'cId', 'siteId'
Write-Host "Searching for variables in scripts..."
$scriptMatches = [regex]::Matches($content, '(?i)(csResultId|csId|cId|siteId)\s*=\s*["''][^"'']+["'']')
foreach ($m in $scriptMatches) {
    Write-Host "Found: $($m.Value)"
}
Write-Host "----------------------------------------"

# Search for inputs or attributes containing IDs
Write-Host "Searching for rows with ID attributes..."
# Let's search for patterns like data-id or csresultid in HTML tags
$dataIdMatches = [regex]::Matches($content, '(?i)(data-csresultid|data-id|id)="[a-f0-9\-]{36}"')
Write-Host "Found $($dataIdMatches.Count) matches of GUIDs in attributes."
if ($dataIdMatches.Count -gt 0) {
    $dataIdMatches | Select-Object -First 10 | ForEach-Object { Write-Host "Attr: $($_.Value)" }
}

Write-Host "----------------------------------------"
# Search for input fields
Write-Host "Searching for select elements..."
$selectMatches = [regex]::Matches($content, '<select[^>]*>')
Write-Host "Found $($selectMatches.Count) select elements."
$selectMatches | Select-Object -First 10 | ForEach-Object { Write-Host "Select: $($_.Value)" }

Write-Host "----------------------------------------"
# Search for file inputs
Write-Host "Searching for file inputs..."
$fileMatches = [regex]::Matches($content, '<input[^>]*type="file"[^>]*>')
$fileMatches | ForEach-Object { Write-Host "File input: $($_.Value)" }

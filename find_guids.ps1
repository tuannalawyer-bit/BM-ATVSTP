# Read the HTML file
$fileObj = Get-ChildItem -Path "d:\AI\BM ATVSTP" -Filter "*Checklist*.html" | Select-Object -First 1
$content = Get-Content -Raw -Path $fileObj.FullName -Encoding UTF8

Write-Host "Searching for GUIDs in file: $($fileObj.Name)..."
# Match Guid: [a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}
$guidRegex = [regex]'(?i)[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}'
$matches = $guidRegex.Matches($content)

Write-Host "Total matches found: $($matches.Count)"
$uniqueGuids = $matches.Value | Select-Object -Unique
Write-Host "Unique GUIDs found:"
foreach ($g in $uniqueGuids) {
    Write-Host "- $g"
}

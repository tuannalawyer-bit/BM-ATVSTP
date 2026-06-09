# Read the HTML file
$fileObj = Get-ChildItem -Path "d:\AI\BM ATVSTP" -Filter "*Checklist*.html" | Select-Object -First 1
$content = Get-Content -Raw -Path $fileObj.FullName -Encoding UTF8

Write-Host "Extracting script blocks from: $($fileObj.Name)..."
$scriptRegex = [regex]'(?s)<script[^>]*>(.*?)</script>'
$matches = $scriptRegex.Matches($content)

Write-Host "Total script blocks: $($matches.Count)"
for ($i = 0; $i -lt $matches.Count; $i++) {
    $scriptContent = $matches[$i].Groups[1].Value
    Write-Host "--- Script Block $i (Length: $($scriptContent.Length)) ---"
    if ($scriptContent.Length -gt 500) {
        Write-Host ($scriptContent.Substring(0, 500) + "`n... [truncated]")
    } else {
        Write-Host $scriptContent
    }
}

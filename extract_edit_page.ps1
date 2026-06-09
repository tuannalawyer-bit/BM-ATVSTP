# Read and parse the HAR file
Write-Host "Reading HAR file..."
$raw = Get-Content -Raw -Path "d:\AI\BM ATVSTP\ops.winmart.vn.har" -Encoding UTF8
$har = $raw | ConvertFrom-Json

Write-Host "Finding the GET request for ke-qua-danh-gia-bktt-mobile..."
$entries = $har.log.entries | Where-Object { 
    $_.request.method -eq 'GET' -and $_.request.url -like '*ke-qua-danh-gia-bktt-mobile*'
}

Write-Host "Found $($entries.Count) matching entries."
$foundContent = $false

foreach ($entry in $entries) {
    Write-Host "URL: $($entry.request.url)"
    Write-Host "Response status: $($entry.response.status)"
    Write-Host "Content Type: $($entry.response.content.mimeType)"
    
    if ($entry.response.content.text) {
        $htmlText = $entry.response.content.text
        if ($entry.response.content.encoding -eq "base64") {
            Write-Host "Content is base64 encoded. Decoding..."
            $bytes = [System.Convert]::FromBase64String($htmlText)
            $htmlText = [System.Text.Encoding]::UTF8.GetString($bytes)
        }
        
        $outputPath = "d:\AI\BM ATVSTP\edit_page.html"
        $htmlText | Out-File -FilePath $outputPath -Encoding UTF8
        Write-Host "Saved edit page HTML to: $outputPath"
        $foundContent = $true
        break
    } else {
        Write-Host "Response body is empty in this entry."
    }
}

if (-not $foundContent) {
    Write-Warning "No entry had response body content!"
}

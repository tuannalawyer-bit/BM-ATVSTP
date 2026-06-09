# Read and parse the HAR file
Write-Host "Reading HAR file..."
$raw = Get-Content -Raw -Path "d:\AI\BM ATVSTP\ops.winmart.vn.har" -Encoding UTF8
$har = $raw | ConvertFrom-Json

Write-Host "Searching for JSON or AJAX requests returning checklist data..."
foreach ($entry in $har.log.entries) {
    $mimeType = $entry.response.content.mimeType
    $url = $entry.request.url
    
    # Check if URL contains keywords like 'checklist', 'site', 'detail', 'result'
    # and exclude static assets
    if ($url -notlike "*.js*" -and $url -notlike "*.css*" -and $url -notlike "*.png*" -and $url -notlike "*.gif*") {
        Write-Host "URL: $url"
        Write-Host "Method: $($entry.request.method)"
        Write-Host "MimeType: $mimeType"
        Write-Host "Status: $($entry.response.status)"
        
        $text = $entry.response.content.text
        if ($text) {
            if ($entry.response.content.encoding -eq "base64") {
                $bytes = [System.Convert]::FromBase64String($text)
                $text = [System.Text.Encoding]::UTF8.GetString($bytes)
            }
            Write-Host "Response Length: $($text.Length)"
            if ($text.Length -gt 200) {
                Write-Host "Snippet: $($text.Substring(0, 200))"
            } else {
                Write-Host "Response: $text"
            }
        } else {
            Write-Host "Response: [Empty]"
        }
        Write-Host "----------------------------------------"
    }
}

# Read the HAR file
Write-Host "Reading HAR file..."
$raw = Get-Content -Raw -Path "d:\AI\BM ATVSTP\ops.winmart.vn.har" -Encoding UTF8
$har = $raw | ConvertFrom-Json

$searchGuids = @("90590b97-3486-4bee-a201-9f9ef581de59", "7df077f9-8739-4024-8f0e-afe56ba0227c", "66a882d6-2f65-40c1-8c1e-f4ec2597cbf1")

foreach ($guid in $searchGuids) {
    Write-Host "========================================"
    Write-Host "Searching for GUID: $guid"
    Write-Host "========================================"
    
    $matches = $har.log.entries | Where-Object {
        $_.request.url -like "*$guid*" -or
        $_.request.postData.text -like "*$guid*" -or
        $_.response.content.text -like "*$guid*"
    }
    
    Write-Host "Found $($matches.Count) entries."
    foreach ($m in $matches) {
        Write-Host "Method: $($m.request.method)"
        Write-Host "URL: $($m.request.url)"
        Write-Host "Status: $($m.response.status)"
        if ($m.request.postData.text) {
            Write-Host "Request Payload: $($m.request.postData.text)"
        }
        if ($m.response.content.text -and $m.response.content.text -like "*$guid*") {
            Write-Host "GUID found in Response Content!"
            # Let's inspect where it is in the response content
            $respText = $m.response.content.text
            if ($m.response.content.encoding -eq "base64") {
                $bytes = [System.Convert]::FromBase64String($respText)
                $respText = [System.Text.Encoding]::UTF8.GetString($bytes)
            }
            # Search for occurrences of the GUID in the response text and print surrounding characters
            $index = $respText.IndexOf($guid)
            if ($index -ge 0) {
                $start = [Math]::Max(0, $index - 100)
                $len = [Math]::Min($respText.Length - $start, 250)
                Write-Host "Context in Response: ... $($respText.Substring($start, $len)) ..."
            }
        }
        Write-Host "----------------------------------------"
    }
}

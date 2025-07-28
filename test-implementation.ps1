#!/usr/bin/env pwsh

# Comprehensive test script for YouTube PE Tracker implementation
Write-Host "🔍 Testing YouTube PE Tracker Implementation" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$baseUrl = "http://localhost:3000"
$testResults = @{}

function Test-URL {
    param(
        [string]$url,
        [string]$name,
        [string[]]$expectedContent = @()
    )
    
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        $status = $response.StatusCode
        $content = $response.Content
        
        if ($status -eq 200) {
            Write-Host "✅ $name - HTTP $status" -ForegroundColor Green
            
            # Check for expected content
            $contentFound = $true
            foreach ($expected in $expectedContent) {
                if ($content -match $expected) {
                    Write-Host "   ✅ Found: $expected" -ForegroundColor Green
                } else {
                    Write-Host "   ❌ Missing: $expected" -ForegroundColor Red
                    $contentFound = $false
                }
            }
            
            $testResults[$name] = @{
                Status = "PASS"
                HTTP = $status
                ContentCheck = $contentFound
            }
        } else {
            Write-Host "❌ $name - HTTP $status" -ForegroundColor Red
            $testResults[$name] = @{
                Status = "FAIL"
                HTTP = $status
                ContentCheck = $false
            }
        }
    } catch {
        Write-Host "❌ $name - Error: $($_.Exception.Message)" -ForegroundColor Red
        $testResults[$name] = @{
            Status = "ERROR"
            HTTP = "N/A"
            ContentCheck = $false
            Error = $_.Exception.Message
        }
    }
}

# Test 1: Homepage
Write-Host "`n📋 Testing Homepage" -ForegroundColor Yellow
Test-URL "$baseUrl/" "Homepage" @("MrBeast", "search", "filter", "YouTube PE Tracker")

# Test 2: Submit Page
Write-Host "`n📋 Testing Submit Page" -ForegroundColor Yellow
Test-URL "$baseUrl/submit" "Submit Page" @("Submit", "GitHub", "Channel")

# Test 3: Dynamic Firm Pages
Write-Host "`n📋 Testing Dynamic Firm Pages" -ForegroundColor Yellow
Test-URL "$baseUrl/firm/Chernin%20Group" "Chernin Group Page" @("MrBeast", "Chernin Group")
Test-URL "$baseUrl/firm/Vox%20Media" "Vox Media Page" @("MKBHD", "Vox Media")
Test-URL "$baseUrl/firm/Night%20Media" "Night Media Page" @("Jacksepticeye", "Night Media")

# Test 4: API Endpoints
Write-Host "`n📋 Testing API Endpoints" -ForegroundColor Yellow
Test-URL "$baseUrl/api/channels" "Channels API" @("MrBeast", "channel_id")

# Test 5: 404 Handling
Write-Host "`n📋 Testing 404 Handling" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/nonexistent-page" -UseBasicParsing -TimeoutSec 10
    Write-Host "❌ 404 Test - Expected 404 but got $($response.StatusCode)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ 404 Test - Correctly returned 404" -ForegroundColor Green
        $testResults["404 Handling"] = @{ Status = "PASS"; HTTP = 404 }
    } else {
        Write-Host "❌ 404 Test - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        $testResults["404 Handling"] = @{ Status = "FAIL"; Error = $_.Exception.Message }
    }
}

# Summary
Write-Host "`n📊 Test Results Summary" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

$passCount = 0
$failCount = 0

foreach ($test in $testResults.GetEnumerator()) {
    $name = $test.Key
    $result = $test.Value
    
    if ($result.Status -eq "PASS") {
        Write-Host "✅ $name" -ForegroundColor Green
        $passCount++
    } else {
        Write-Host "❌ $name - Status: $($result.Status)" -ForegroundColor Red
        if ($result.Error) {
            Write-Host "   Error: $($result.Error)" -ForegroundColor Red
        }
        $failCount++
    }
}

Write-Host "`n📈 Overall Results:" -ForegroundColor White
Write-Host "   Passed: $passCount" -ForegroundColor Green
Write-Host "   Failed: $failCount" -ForegroundColor Red
Write-Host "   Total:  $($passCount + $failCount)" -ForegroundColor White

if ($failCount -eq 0) {
    Write-Host "`n🎉 All tests passed! Implementation is working correctly." -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n⚠️ Some tests failed. Please review the issues above." -ForegroundColor Yellow
    exit 1
}

# Check which translation keys are missing from locale files
$codeKeys = @(
    'about.description', 'about.features.accessible', 'about.features.accessibleDesc', 'about.features.calculator',
    'about.features.calculatorDesc', 'about.features.currencies', 'about.features.currenciesDesc', 'about.features.customizable',
    'about.features.customizableDesc', 'about.features.design', 'about.features.designDesc', 'about.features.fast',
    'about.features.fastDesc', 'about.features.multilanguage', 'about.features.multilanguageDesc', 'about.features.offline',
    'about.features.offlineDesc', 'about.features.privacy', 'about.features.privacyDesc', 'about.features.pwa',
    'about.features.pwaDesc', 'about.features.realtime', 'about.features.realtimeDesc', 'about.features.subtitle',
    'about.features.timezone', 'about.features.timezoneDesc', 'about.features.title', 'about.footerText',
    'about.freeDescription', 'about.freeOpenSource', 'about.heroTitle', 'about.links.exchangeRateApi',
    'about.links.poweredBy', 'about.links.viewGithub', 'about.stats.cacheDuration', 'about.stats.currenciesSupported',
    'about.stats.languagesSupported', 'about.stats.privacyFocused', 'about.title', 'about.uniqueFeatures.calculator',
    'about.uniqueFeatures.calculatorDesc', 'about.uniqueFeatures.installApp', 'about.uniqueFeatures.installAppDesc',
    'about.uniqueFeatures.numberSystem', 'about.uniqueFeatures.numberSystemDesc', 'about.uniqueFeatures.smartBase',
    'about.uniqueFeatures.smartBaseDesc', 'about.uniqueFeatures.subtitle', 'about.uniqueFeatures.timezone',
    'about.uniqueFeatures.timezoneDesc', 'about.uniqueFeatures.title', 'about.uniqueFeatures.updates',
    'about.uniqueFeatures.updatesDesc', 'about.useCases.education', 'about.useCases.educationDesc',
    'about.useCases.educationExamples', 'about.useCases.finance', 'about.useCases.financeDesc',
    'about.useCases.financeExamples', 'about.useCases.quickMath', 'about.useCases.quickMathDesc',
    'about.useCases.quickMathExamples', 'about.useCases.shopping', 'about.useCases.shoppingDesc',
    'about.useCases.shoppingExamples', 'about.useCases.subtitle', 'about.useCases.title', 'about.useCases.travel',
    'about.useCases.travelDesc', 'about.useCases.travelExamples', 'about.useCases.work', 'about.useCases.workDesc',
    'about.useCases.workExamples', 'aboutPage.aboutFeatures', 'aboutPage.aboutTitle', 'app.liveRatesFrom',
    'app.loading', 'app.loadingSubtitle', 'app.noRatesAvailable', 'app.noRatesMessage', 'app.ratesRelativeTo',
    'app.retry', 'app.retrying', 'app.statusInfo', 'app.subtitle', 'app.tapRateToChangeBase', 'app.title',
    'common.cancel', 'common.close', 'common.testConnectivity', 'converter.addCurrencyTitle', 'converter.amountPlaceholder',
    'converter.baseCurrencyLabel', 'converter.currenciesCount', 'converter.currencyCount', 'converter.noCurrenciesFound',
    'converter.searchCurrency', 'debug.current', 'debug.title', 'debug.toggleLang', 'donateButton.anySupport',
    'donateButton.arrow', 'donateButton.buyMeCoffee', 'donateButton.helpfulMessage', 'donateButton.supportProject',
    'donateButton.supportThisApp', 'donateButton.supportWithCoffee', 'errorBoundary.errorDetails', 'errorBoundary.refreshPage',
    'errorBoundary.somethingWentWrong', 'errorBoundary.tryAgain', 'errorBoundary.unexpectedHappened', 'miniCalculator.apply',
    'miniCalculator.applyResultTo', 'miniCalculator.applyXToY', 'miniCalculator.billAmount', 'miniCalculator.billAmountLabel',
    'miniCalculator.calc', 'miniCalculator.calculation', 'miniCalculator.calculatorTab', 'miniCalculator.clear',
    'miniCalculator.currency', 'miniCalculator.customPercent', 'miniCalculator.enterBillAmount', 'miniCalculator.openCalculator',
    'miniCalculator.pinCurrenciesFirst', 'miniCalculator.resetTipCalculator', 'miniCalculator.selectCurrencyFirst',
    'miniCalculator.tipLabel', 'miniCalculator.tipPercentage', 'miniCalculator.tipTab', 'miniCalculator.title',
    'miniCalculator.totalLabel', 'navigation.backToConverter', 'navigation.startConverting', 'numberSystemToggle.in',
    'numberSystemToggle.intl', 'numberSystemToggle.switchTo', 'pwaStatus.cancel', 'pwaStatus.clear', 'pwaStatus.clearAnyway',
    'pwaStatus.clearCacheOfflineDesc', 'pwaStatus.clearCacheOfflineList1', 'pwaStatus.clearCacheOfflineList2',
    'pwaStatus.clearCacheOfflineList3', 'pwaStatus.clearCacheOfflineMessage', 'pwaStatus.clearCacheOfflineTitle',
    'pwaStatus.clearCacheOfflineWarn', 'pwaStatus.install', 'pwaStatus.installable', 'pwaStatus.installApp',
    'pwaStatus.installed', 'pwaStatus.installHint', 'pwaStatus.installTitle', 'pwaStatus.offlineDesc', 'pwaStatus.offlineTitle',
    'pwaStatus.refresh', 'pwaStatus.testUpdate', 'pwaStatus.update', 'pwaStatus.updateAvailable', 'refreshWarning.explanation',
    'refreshWarning.hardRefresh', 'refreshWarning.hardRefreshing', 'refreshWarning.message', 'refreshWarning.note',
    'refreshWarning.stayHere', 'refreshWarning.tip', 'refreshWarning.title', 'seo.description', 'seo.keywords',
    'seo.structuredData.author', 'seo.structuredData.description', 'seo.structuredData.feature1', 'seo.structuredData.feature2',
    'seo.structuredData.feature3', 'seo.structuredData.feature4', 'seo.structuredData.feature5', 'seo.structuredData.feature6',
    'seo.structuredData.feature7', 'seo.structuredData.feature8', 'seo.structuredData.name', 'seo.title', 'settings.indian',
    'settings.international', 'settings.language', 'statusBar.hoursMinutesAgo', 'statusBar.justNow', 'statusBar.lastUpdated',
    'statusBar.minutesAgo', 'statusBar.never', 'statusBar.offlineMode', 'statusBar.online', 'statusBar.ratesExpired',
    'statusBar.refresh', 'statusBar.refreshTitle', 'statusBar.syncing', 'statusBar.tryRefresh', 'statusBar.tryRefreshTitle',
    'statusBar.updated', 'updatePrompt.allPreserved', 'updatePrompt.cacheSize', 'updatePrompt.dataCachedDesc1',
    'updatePrompt.dataCachedDesc2', 'updatePrompt.dataCachedTitle', 'updatePrompt.dataSafe', 'updatePrompt.freshRates',
    'updatePrompt.newVersionReady', 'updatePrompt.offlineNotice', 'updatePrompt.reload', 'updatePrompt.title',
    'updatePrompt.updateDetails', 'updatePrompt.updateLater', 'updatePrompt.updateNow', 'updatePrompt.updating',
    'updatePrompt.whatHappens'
)

# Function to check if a key exists in JSON object
function Test-JsonKey {
    param($jsonObject, $key)
    
    $parts = $key.Split('.')
    $current = $jsonObject
    
    foreach ($part in $parts) {
        if ($current.PSObject.Properties[$part]) {
            $current = $current.$part
        } else {
            return $false
        }
    }
    return $true
}

$localeFiles = @('en.json', 'es.json', 'fr.json', 'de.json', 'pt.json', 'ru.json', 'zh.json', 'ja.json', 'ar.json', 'hi.json')

Write-Output "Missing Translation Keys Analysis"
Write-Output "======================================"
Write-Output ""

foreach ($localeFile in $localeFiles) {
    if (Test-Path "src\i18n\locales\$localeFile") {
        $jsonContent = Get-Content "src\i18n\locales\$localeFile" -Raw | ConvertFrom-Json
        $missingKeys = @()
        
        foreach ($key in $codeKeys) {
            if (-not (Test-JsonKey $jsonContent $key)) {
                $missingKeys += $key
            }
        }
        
        Write-Output "$localeFile - Missing Keys: $($missingKeys.Count)"
        if ($missingKeys.Count -gt 0) {
            $missingKeys | ForEach-Object { Write-Output "  - $_" }
        }
        Write-Output ""
    }
}

Write-Output "Summary:"
Write-Output "Total keys used in code: $($codeKeys.Count)"

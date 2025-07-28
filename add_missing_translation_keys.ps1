#!/usr/bin/env powershell

# Script to add missing translation keys to all locale files
# This script adds the missing keys that are used in AboutPage.tsx

$localeFiles = @(
    "src/i18n/locales/ar.json",
    "src/i18n/locales/de.json", 
    "src/i18n/locales/fr.json",
    "src/i18n/locales/hi.json",
    "src/i18n/locales/ja.json",
    "src/i18n/locales/pt.json",
    "src/i18n/locales/ru.json"
)

$missingKeys = @{
    "about.features.calculator" = @{
        "ar" = "آلة حاسبة مدمجة"
        "de" = "Integrierter Rechner" 
        "fr" = "Calculatrice Intégrée"
        "hi" = "अंतर्निहित कैलकुलेटर"
        "ja" = "内蔵計算機"
        "pt" = "Calculadora Integrada"
        "ru" = "Встроенный Калькулятор"
    }
    "about.features.calculatorDesc" = @{
        "ar" = "آلة حاسبة متكاملة مع حاسبة البقشيش للرياضيات السريعة وتحويل العملات"
        "de" = "Integrierter Rechner mit Trinkgeldrechner für schnelle Mathematik und Währungsumrechnungen"
        "fr" = "Calculatrice intégrée avec calculatrice de pourboires pour les mathématiques rapides et les conversions de devises"
        "hi" = "त्वरित गणित और मुद्रा रूपांतरण के लिए टिप कैलकुलेटर के साथ एकीकृत कैलकुलेटर"
        "ja" = "素早い計算通貨換算のためのチップ計算機付き統合計算機"
        "pt" = "Calculadora integrada com calculadora de gorjetas para matemática rápida e conversões de moeda"
        "ru" = "Интегрированный калькулятор с калькулятором чаевых для быстрой математики и конвертации валют"
    }
    "about.features.timezone" = @{
        "ar" = "تحويل المنطقة الزمنية"
        "de" = "Zeitzonenkonvertierung"
        "fr" = "Conversion de Fuseau Horaire"
        "hi" = "समय क्षेत्र रूपांतरण"
        "ja" = "タイムゾーン変換"
        "pt" = "Conversão de Fuso Horário"
        "ru" = "Конвертация Часовых Поясов"
    }
    "about.features.timezoneDesc" = @{
        "ar" = "تحويل الوقت بين مناطق زمنية مختلفة حول العالم"
        "de" = "Zeit zwischen verschiedenen Zeitzonen weltweit konvertieren"
        "fr" = "Convertir l'heure entre différents fuseaux horaires mondiaux"
        "hi" = "विश्वव्यापी विभिन्न समय क्षेत्रों के बीच समय परिवर्तित करें"
        "ja" = "世界中の異なるタイムゾーン間で時間を変換"
        "pt" = "Converter tempo entre diferentes fusos horários mundiais"
        "ru" = "Конвертировать время между различными мировыми часовыми поясами"
    }
    "about.features.multilanguage" = @{
        "ar" = "متعدد اللغات"
        "de" = "Mehrsprachig"
        "fr" = "Multilingue"
        "hi" = "बहुभाषी"
        "ja" = "多言語"
        "pt" = "Multilíngue"
        "ru" = "Многоязычный"
    }
    "about.features.multilanguageDesc" = @{
        "ar" = "دعم لأكثر من 10 لغات مع الكشف التلقائي ودعم RTL"
        "de" = "Unterstützung für 10+ Sprachen mit automatischer Erkennung und RTL-Unterstützung"
        "fr" = "Support pour 10+ langues avec détection automatique et support RTL"
        "hi" = "स्वचालित पहचान और RTL समर्थन के साथ 10+ भाषाओं के लिए समर्थन"
        "ja" = "自動検出とRTLサポートを備えた10以上の言語のサポート"
        "pt" = "Suporte para 10+ idiomas com detecção automática e suporte RTL"
        "ru" = "Поддержка 10+ языков с автоматическим определением и поддержкой RTL"
    }
    "about.features.pwa" = @{
        "ar" = "تطبيق ويب تقدمي"
        "de" = "Progressive Web App"
        "fr" = "Application Web Progressive"
        "hi" = "प्रगतिशील वेब ऐप"
        "ja" = "プログレッシブウェブアプリ"
        "pt" = "Aplicativo Web Progressivo"
        "ru" = "Прогрессивное Веб-Приложение"
    }
    "about.features.pwaDesc" = @{
        "ar" = "تثبيت كتطبيق أصلي على أي جهاز، يعمل بدون اتصال مع تخزين مؤقت لعامل الخدمة"
        "de" = "Als native App auf jedem Gerät installieren, funktioniert offline mit Service Worker Caching"
        "fr" = "Installer comme application native sur tout appareil, fonctionne hors ligne avec mise en cache du service worker"
        "hi" = "किसी भी डिवाइस पर मूल ऐप के रूप में इंस्टॉल करें, सर्विस वर्कर कैशिंग के साथ ऑफ़लाइन काम करता है"
        "ja" = "任意のデバイスにネイティブアプリとしてインストール、サービスワーカーキャッシングでオフライン動作"
        "pt" = "Instalar como aplicativo nativo em qualquer dispositivo, funciona offline com cache de service worker"
        "ru" = "Установить как нативное приложение на любое устройство, работает оффлайн с кэшированием service worker"
    }
    "about.features.design" = @{
        "ar" = "تصميم حديث"
        "de" = "Modernes Design"
        "fr" = "Design Moderne"
        "hi" = "आधुनिक डिज़ाइन"
        "ja" = "モダンデザイン"
        "pt" = "Design Moderno"
        "ru" = "Современный Дизайн"
    }
    "about.features.designDesc" = @{
        "ar" = "واجهة نظيفة وبديهية محسنة للهاتف المحمول وسطح المكتب مع تصميم متجاوب"
        "de" = "Saubere, intuitive Oberfläche optimiert für Mobil und Desktop mit responsivem Design"
        "fr" = "Interface propre et intuitive optimisée pour mobile et bureau avec design réactif"
        "hi" = "प्रतिक्रियाशील डिज़ाइन के साथ मोबाइल और डेस्कटॉप के लिए अनुकूलित स्वच्छ, सहज इंटरफ़ेस"
        "ja" = "レスポンシブデザインでモバイルとデスクトップに最適化されたクリーンで直感的なインターフェース"
        "pt" = "Interface limpa e intuitiva otimizada para celular e desktop com design responsivo"
        "ru" = "Чистый, интуитивный интерфейс, оптимизированный для мобильных устройств и настольных компьютеров с адаптивным дизайном"
    }
}

Write-Host "Translation keys reference for manual addition to locale files:" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green

foreach ($key in $missingKeys.Keys) {
    Write-Host "`n$key translations:" -ForegroundColor Yellow
    foreach ($lang in $missingKeys[$key].Keys) {
        Write-Host "  $lang : $($missingKeys[$key][$lang])" -ForegroundColor Cyan
    }
}

Write-Host "`nManually add these keys to the respective locale files in the about.features section." -ForegroundColor Green

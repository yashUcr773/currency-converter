import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Shield, 
  Database, 
  Globe, 
  Lock, 
  Eye,
  Download,
  RefreshCw,
  AlertTriangle,
  Mail,
  Calendar
} from 'lucide-react';

export const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{t('privacy.backToApp')}</span>
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-primary rounded-xl shadow-lg">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-primary">
                {t('privacy.title')}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {t('privacy.subtitle')}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              {t('privacy.lastUpdated')}: {t('privacy.updateDate')}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
          
          {/* Overview Section */}
          <div className="p-6 border-b border-border bg-accent/50">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.overview.title')}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacy.overview.description')}
            </p>
          </div>

          {/* Information We Collect */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-success" />
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.dataCollection.title')}</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                <h3 className="font-medium text-success mb-2">{t('privacy.dataCollection.localStorage.title')}</h3>
                <p className="text-success/80 text-sm">{t('privacy.dataCollection.localStorage.description')}</p>
                <ul className="mt-2 text-sm text-success/80 space-y-1">
                  {(t('privacy.dataCollection.localStorage.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-success mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-info/10 p-4 rounded-lg border border-info/20">
                <h3 className="font-medium text-info mb-2">{t('privacy.dataCollection.noPersonalData.title')}</h3>
                <p className="text-info/80 text-sm">{t('privacy.dataCollection.noPersonalData.description')}</p>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h3 className="font-medium text-primary mb-2">{t('privacy.dataCollection.noTracking.title')}</h3>
                <p className="text-primary/80 text-sm">{t('privacy.dataCollection.noTracking.description')}</p>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.dataUsage.title')}</h2>
            </div>
            <p className="text-muted-foreground mb-4">{t('privacy.dataUsage.description')}</p>
            <ul className="space-y-2">
              {(t('privacy.dataUsage.purposes', { returnObjects: true }) as string[]).map((purpose, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  {purpose}
                </li>
              ))}
            </ul>
          </div>

          {/* Third-Party Services */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-warning" />
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.thirdParty.title')}</h2>
            </div>
            <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
              <h3 className="font-medium text-warning mb-2">{t('privacy.thirdParty.exchangeApi.title')}</h3>
              <p className="text-warning/80 text-sm mb-2">{t('privacy.thirdParty.exchangeApi.description')}</p>
              <a 
                href="https://exchangerate-api.com/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-warning hover:text-warning/80 font-medium text-sm transition-colors"
              >
                {t('privacy.thirdParty.exchangeApi.linkText')}
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Data Security */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-success" />
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.security.title')}</h2>
            </div>
            <div className="bg-success/10 p-4 rounded-lg border border-success/20">
              <p className="text-success/80 text-sm">{t('privacy.security.description')}</p>
              <ul className="mt-2 text-sm text-success/80 space-y-1">
                {(t('privacy.security.measures', { returnObjects: true }) as string[]).map((measure, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-success mt-2 rounded-full flex-shrink-0"></div>
                    <span>{measure}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PWA and Offline Features */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-6 h-6 text-info" />
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.pwa.title')}</h2>
            </div>
            <p className="text-muted-foreground mb-4">{t('privacy.pwa.description')}</p>
            <div className="bg-info/10 p-4 rounded-lg border border-info/20">
              <h3 className="font-medium text-info mb-2">{t('privacy.pwa.offlineData.title')}</h3>
              <p className="text-info/80 text-sm">{t('privacy.pwa.offlineData.description')}</p>
            </div>
          </div>

          {/* Your Rights */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-warning" />
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.rights.title')}</h2>
            </div>
            <p className="text-muted-foreground mb-4">{t('privacy.rights.description')}</p>
            <ul className="space-y-2">
              {(t('privacy.rights.list', { returnObjects: true }) as string[]).map((right, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-warning mt-0.5">•</span>
                  {right}
                </li>
              ))}
            </ul>
          </div>

          {/* Changes to Policy */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.changes.title')}</h2>
            </div>
            <p className="text-muted-foreground">{t('privacy.changes.description')}</p>
          </div>

          {/* Contact */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-info" />
              <h2 className="text-xl font-semibold text-foreground">{t('privacy.contact.title')}</h2>
            </div>
            <p className="text-muted-foreground mb-4">{t('privacy.contact.description')}</p>
            <div className="bg-info/10 p-4 rounded-lg border border-info/20">
              <a 
                href="https://github.com/yashUcr773/currency-converter" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-info hover:text-info/80 font-medium transition-colors"
              >
                <Globe className="w-4 h-4" />
                {t('privacy.contact.github')}
              </a>
            </div>
          </div>
        </div>

        {/* Back to App Button */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('privacy.backToApp')}
          </Link>
        </div>
      </main>
    </div>
  );
};

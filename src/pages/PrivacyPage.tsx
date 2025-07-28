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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{t('privacy.backToApp')}</span>
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('privacy.title')}
              </h1>
            </div>
            <p className="text-slate-600 text-lg">
              {t('privacy.subtitle')}
            </p>
            <p className="text-sm text-slate-500 mt-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              {t('privacy.lastUpdated')}: {t('privacy.updateDate')}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          
          {/* Overview Section */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800">{t('privacy.overview.title')}</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {t('privacy.overview.description')}
            </p>
          </div>

          {/* Information We Collect */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-slate-800">{t('privacy.dataCollection.title')}</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 mb-2">{t('privacy.dataCollection.localStorage.title')}</h3>
                <p className="text-green-700 text-sm">{t('privacy.dataCollection.localStorage.description')}</p>
                <ul className="mt-2 text-sm text-green-700 space-y-1">
                  {(t('privacy.dataCollection.localStorage.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">{t('privacy.dataCollection.noPersonalData.title')}</h3>
                <p className="text-blue-700 text-sm">{t('privacy.dataCollection.noPersonalData.description')}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-800 mb-2">{t('privacy.dataCollection.noTracking.title')}</h3>
                <p className="text-purple-700 text-sm">{t('privacy.dataCollection.noTracking.description')}</p>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800">{t('privacy.dataUsage.title')}</h2>
            </div>
            <p className="text-slate-600 mb-4">{t('privacy.dataUsage.description')}</p>
            <ul className="space-y-2">
              {(t('privacy.dataUsage.purposes', { returnObjects: true }) as string[]).map((purpose, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-600">
                  <span className="text-blue-500 mt-0.5">•</span>
                  {purpose}
                </li>
              ))}
            </ul>
          </div>

          {/* Third-Party Services */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-slate-800">{t('privacy.thirdParty.title')}</h2>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-medium text-orange-800 mb-2">{t('privacy.thirdParty.exchangeApi.title')}</h3>
              <p className="text-orange-700 text-sm mb-2">{t('privacy.thirdParty.exchangeApi.description')}</p>
              <a 
                href="https://exchangerate-api.com/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
              >
                {t('privacy.thirdParty.exchangeApi.linkText')}
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Data Security */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-slate-800">{t('privacy.security.title')}</h2>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-700 text-sm">{t('privacy.security.description')}</p>
              <ul className="mt-2 text-sm text-green-700 space-y-1">
                {(t('privacy.security.measures', { returnObjects: true }) as string[]).map((measure, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {measure}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PWA and Offline Features */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-slate-800">{t('privacy.pwa.title')}</h2>
            </div>
            <p className="text-slate-600 mb-4">{t('privacy.pwa.description')}</p>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h3 className="font-medium text-indigo-800 mb-2">{t('privacy.pwa.offlineData.title')}</h3>
              <p className="text-indigo-700 text-sm">{t('privacy.pwa.offlineData.description')}</p>
            </div>
          </div>

          {/* Your Rights */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-semibold text-slate-800">{t('privacy.rights.title')}</h2>
            </div>
            <p className="text-slate-600 mb-4">{t('privacy.rights.description')}</p>
            <ul className="space-y-2">
              {(t('privacy.rights.list', { returnObjects: true }) as string[]).map((right, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-600">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  {right}
                </li>
              ))}
            </ul>
          </div>

          {/* Changes to Policy */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-slate-800">{t('privacy.changes.title')}</h2>
            </div>
            <p className="text-slate-600">{t('privacy.changes.description')}</p>
          </div>

          {/* Contact */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800">{t('privacy.contact.title')}</h2>
            </div>
            <p className="text-slate-600 mb-4">{t('privacy.contact.description')}</p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <a 
                href="https://github.com/yashUcr773/currency-converter" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('privacy.backToApp')}
          </Link>
        </div>
      </main>
    </div>
  );
};

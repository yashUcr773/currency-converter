import { MessageSquare, Github, ExternalLink, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactForm } from './ContactForm';

export const FeatureRequestSection = () => {
  const contactMethods = [
    {
      icon: <Github className="w-5 h-5" />,
      title: "GitHub Issues",
      description: "Create an issue on our GitHub repository",
      action: "Open GitHub",
      color: "bg-gray-800 hover:bg-gray-700",
      onClick: () => window.open('https://github.com/yashUcr773/currency-converter/issues', '_blank')
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Quick Feedback",
      description: "Send a quick message with your suggestions",
      action: "Quick Message",
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => {
        const subject = encodeURIComponent('Currency Converter - Feature Request');
        const body = encodeURIComponent(`Hi there!\n\nI have a feature request for the Currency Converter app:\n\n[Please describe your feature request here]\n\nThanks!`);
        window.open(`mailto:feedback@currencyconverter.com?subject=${subject}&body=${body}`, '_blank');
      }
    }
  ];

  const featureIdeas = [
    {
      icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      title: "Historical Rate Charts",
      description: "View currency trends over time"
    },
    {
      icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      title: "Rate Alerts",
      description: "Get notified when rates hit your target"
    },
    {
      icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      title: "Cryptocurrency Support",
      description: "Convert between crypto and fiat currencies"
    },
    {
      icon: <AlertCircle className="w-4 h-4 text-orange-500" />,
      title: "Multiple Portfolios",
      description: "Save different currency combinations"
    },
    {
      icon: <AlertCircle className="w-4 h-4 text-orange-500" />,
      title: "Export Data",
      description: "Export conversion history to CSV"
    },
    {
      icon: <AlertCircle className="w-4 h-4 text-orange-500" />,
      title: "Dark Mode",
      description: "Toggle between light and dark themes"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-4">Help Shape the Future</h3>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Your feedback drives our development. Share your ideas and help us build the perfect currency converter.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Email Form */}
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center pb-3">
            <div className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3">
              <Send className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg text-slate-800">Email Feedback</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 text-sm mb-4">Send detailed feature requests via email</p>
            <ContactForm
              type="feature"
              title="Feature Request"
              triggerButton={
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0">
                  Send Email
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              }
            />
          </CardContent>
        </Card>

        {/* Other contact methods */}
        {contactMethods.map((method, index) => (
          <Card key={index} className="bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-3">
              <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center text-white mx-auto mb-3`}>
                {method.icon}
              </div>
              <CardTitle className="text-lg text-slate-800">{method.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 text-sm mb-4">{method.description}</p>
              <Button 
                onClick={method.onClick}
                className={`w-full ${method.color} text-white border-0`}
              >
                {method.action}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Ideas */}
      <div className="space-y-6">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-slate-800 mb-4">Planned Features</h4>
          <p className="text-slate-600 max-w-xl mx-auto">
            Here's what we're working on and considering. Let us know which features matter most to you!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureIdeas.map((idea, index) => (
            <div key={index} className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                {idea.icon}
                <div>
                  <h5 className="font-semibold text-slate-800 text-sm">{idea.title}</h5>
                  <p className="text-slate-600 text-xs mt-1">{idea.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-slate-200">
        <h4 className="text-xl font-bold text-slate-800 mb-3">Have a Great Idea?</h4>
        <p className="text-slate-600 mb-6 max-w-lg mx-auto">
          We love hearing from our users! Whether it's a small improvement or a game-changing feature, 
          your input helps us prioritize what to build next.
        </p>
        <ContactForm
          type="feature"
          title="Feature Request"
          triggerButton={
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-3">
              <Send className="w-4 h-4 mr-2" />
              Submit Feature Request
            </Button>
          }
        />
      </div>
    </div>
  );
};

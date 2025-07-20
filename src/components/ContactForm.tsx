import { useState } from 'react';
import { Send, Mail, User, MessageSquare, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ContactFormProps {
  type: 'feature' | 'support' | 'general';
  title: string;
  triggerButton: React.ReactNode;
}

export const ContactForm = ({ type, title, triggerButton }: ContactFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: type
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Try to submit via API first
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: formData.subject || `${title} - ${formData.name}`
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          type: type
        });
      } else {
        throw new Error('API submission failed');
      }
    } catch (error) {
      // Fallback to mailto if API fails
      console.log('API submission failed, falling back to mailto:', error);
      
      const subject = encodeURIComponent(formData.subject || `${title} - ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Type: ${formData.type}\n\n` +
        `Message:\n${formData.message}\n\n` +
        `---\n` +
        `Sent via Currency Converter Pro Contact Form`
      );
      
      window.open(`mailto:feedback@currencyconverter.com?subject=${subject}&body=${body}`, '_blank');
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: type
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSubmitted(false);
    setError(null);
  };

  const getDefaultSubject = () => {
    switch (type) {
      case 'feature':
        return 'Feature Request';
      case 'support':
        return 'Support Request';
      default:
        return 'General Inquiry';
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'feature':
        return 'Describe your feature idea in detail. What problem would it solve? How would you use it?';
      case 'support':
        return 'Please describe the issue you\'re experiencing in detail. Include any error messages and steps to reproduce the problem.';
      default:
        return 'Please describe your inquiry or feedback...';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] max-w-md mx-auto bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-700">
            <Mail className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        {submitted ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-800 mb-2">Message Sent!</h3>
              <p className="text-slate-600 text-sm">
                Thank you for your {type === 'feature' ? 'feature request' : 'message'}. 
                We'll get back to you as soon as possible.
              </p>
            </div>
            <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700 text-white">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder={getDefaultSubject()}
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                Message *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full min-h-[100px] pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder={getPlaceholder()}
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

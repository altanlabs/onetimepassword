import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { LanguageSwitcher } from '@/components/blocks/language-switcher';
import { CopyButton } from '@/components/ui/copy-button';
import { storeMessage } from '@/utils/api';

const generateSecurePassword = () => {
  const length = 16;
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const allChars = lowercase + uppercase + numbers + symbols;
  
  // Asegurar al menos un carácter de cada tipo
  let password = 
    lowercase[Math.floor(Math.random() * lowercase.length)] +
    uppercase[Math.floor(Math.random() * uppercase.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    symbols[Math.floor(Math.random() * symbols.length)];
  
  // Rellenar el resto de la contraseña
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  // Mezclar la contraseña
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState<'message' | 'password'>('message');

  const handleSubmit = async () => {
    if (!message) return;
    
    setLoading(true);
    try {
      const token = await storeMessage(message, currentTab === 'password');
      const link = `${window.location.origin}/view/${token}`;
      setGeneratedLink(link);
      
      toast({
        title: t('linkGenerated'),
        description: t('linkSuccess'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('linkError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePassword = () => {
    const password = generateSecurePassword();
    setMessage(password);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value as 'message' | 'password');
    setMessage('');
    setGeneratedLink('');
  };

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <LanguageSwitcher />
      </div>
      
      <Card className="p-6">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="message">{t('messageTab')}</TabsTrigger>
            <TabsTrigger value="password">{t('passwordTab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="message">
            <div className="space-y-4">
              <Textarea
                placeholder={t('enterMessage')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="password">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('passwordPlaceholder')}
                  readOnly
                />
                {message && <CopyButton value={message} />}
              </div>
              <Button 
                onClick={handleGeneratePassword}
                className="w-full"
                variant="outline"
              >
                {t('generatePassword')}
              </Button>
            </div>
          </TabsContent>

          <div className="mt-6">
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={!message || loading}
            >
              {loading ? t('generating') : t('generateLink')}
            </Button>
          </div>

          {generatedLink && (
            <Alert className="mt-6">
              <AlertDescription>
                <div className="break-all">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{t('secureLink')}</p>
                    <CopyButton value={generatedLink} />
                  </div>
                  <p className="text-sm">{generatedLink}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('linkWarning')}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </Tabs>
      </Card>
    </div>
  );
}
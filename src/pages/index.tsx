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

const generateSecurePassword = () => {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (isPassword: boolean) => {
    setLoading(true);
    try {
      // Here we'll implement the API call to store the encrypted message
      const dummyLink = `${window.location.origin}/view/${Math.random().toString(36).substring(7)}`;
      setGeneratedLink(dummyLink);
      
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
    }
    setLoading(false);
  };

  const handleGeneratePassword = () => {
    const password = generateSecurePassword();
    setMessage(password);
  };

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <LanguageSwitcher />
      </div>
      
      <Card className="p-6">
        <Tabs defaultValue="message" className="w-full">
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
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                readOnly
              />
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
              onClick={() => handleSubmit(false)}
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
                  <p className="font-medium mb-2">{t('secureLink')}</p>
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
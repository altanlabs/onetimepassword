import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { LanguageSwitcher } from '@/components/blocks/language-switcher';

export default function ViewMessagePage() {
  const { token } = useParams();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        // Here we'll implement the API call to fetch and decrypt the message
        // For now, simulating API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate an expired or already viewed message
        if (Math.random() > 0.5) {
          setError(t('messageExpired'));
        } else {
          setMessage('This is a secure message that will be shown only once.');
        }
      } catch (err) {
        setError(t('fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [token, t]);

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('secureMessage')}</h1>
        <LanguageSwitcher />
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>{t('messageUnavailable')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertTitle>{t('secureMessage')}</AlertTitle>
            <AlertDescription className="mt-2 whitespace-pre-wrap">
              {message}
            </AlertDescription>
            <p className="text-sm text-muted-foreground mt-4">
              {t('deleteWarning')}
            </p>
          </Alert>
        )}
      </Card>
    </div>
  );
}
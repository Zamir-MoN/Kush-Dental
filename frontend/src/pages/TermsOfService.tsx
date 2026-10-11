import { LegalPage } from './LegalPage';
import { termsOfServiceMarkdown } from '../content/termsOfService';

export const TermsOfService = () => {
  return <LegalPage title="Terms of Service" markdownContent={termsOfServiceMarkdown} />;
};

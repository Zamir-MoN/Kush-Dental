import { LegalPage } from './LegalPage';
import { privacyPolicyMarkdown } from '../content/privacyPolicy';

export const PrivacyPolicy = () => {
  return <LegalPage title="Privacy Policy" markdownContent={privacyPolicyMarkdown} />;
};

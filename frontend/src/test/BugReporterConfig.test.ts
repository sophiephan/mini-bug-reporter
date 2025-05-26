import { describe, it, expect } from 'vitest';
import { DEFAULT_CONFIG } from '../components/BugReporterConfig';

describe('BugReporterConfig', () => {
  it('has the expected default values', () => {
    expect(DEFAULT_CONFIG).toEqual({
      showDescription: true,
      showPriority: true,
      showScreenshotUrl: true,
      showMetadataFields: false,
      defaultPriority: 'MEDIUM',
      title: 'Report a Bug',
      submitButtonText: 'Submit Bug Report',
      successMessage: 'Bug report submitted successfully!',
      apiEndpoint: 'http://localhost:8080/api/bugs',
    });
  });

  it('has all required configuration options', () => {
    // Ensure all expected properties are present
    const expectedProps = [
      'showDescription',
      'showPriority',
      'showScreenshotUrl',
      'showMetadataFields',
      'defaultPriority',
      'title',
      'submitButtonText',
      'successMessage',
      'apiEndpoint'
    ];

    expectedProps.forEach(prop => {
      expect(DEFAULT_CONFIG).toHaveProperty(prop);
    });
  });
}); 
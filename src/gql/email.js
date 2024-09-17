import { gql } from '@apollo/client';

export const SAVE_EMAIL_CONFIG = gql`
  mutation SaveEmailConfig($payload: EmailConfigurationInput!) {
    saveEmailConfig(payload: $payload) {
      id
      fromName
      fromEmail
      username
      password
      smtpHost
      smtpPort
      smtpEncryption
      messagePerDay
      minTimeGap
      replyToEmail
      useDifferentEmailForImap
      imapHost
      imapPort
      imapEncryption
    }
  }
`;

export const GET_EMAIL_CONFIG = gql`
  query GetEmailConfig($id: String!) {
    getEmailConfig(id: $id) {
      id
      fromName
      fromEmail
      username
      password
      smtpHost
      smtpPort
      smtpEncryption
      messagePerDay
      minTimeGap
      replyToEmail
      useDifferentEmailForImap
      imapHost
      imapPort
      imapEncryption
    }
  }
`;

export const SEND_EMAIL = gql`
  mutation SendEmail($payload: SendEmail!) {
    sendEmail(payload: $payload) {
      status
      message
    }
  }
`;

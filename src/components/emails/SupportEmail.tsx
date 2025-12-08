import { Html, Body, Container, Text, Section, Hr } from '@react-email/components';

export default function SupportEmail({
  name,
  email,
  phone,
  type,
  subject,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  type: string;
  subject: string;
  message: string;
}) {
  return (
    <Html>
      <Body
        style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}
      >
        <Container
          style={{
            background: '#ffffff',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '600px',
            margin: '0 auto',
            boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
          }}
        >
          <Section style={{ marginBottom: '20px' }}>
            <Text style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
              📩 رسالة جديدة من {name}
            </Text>
          </Section>

          <Section style={{ marginBottom: '20px' }}>
            <Text style={{ fontSize: '14px', color: '#6b7280' }}>البريد: {email}</Text>
            <Text style={{ fontSize: '14px', color: '#6b7280' }}>الهاتف: {phone}</Text>
            <Text style={{ fontSize: '14px', color: '#6b7280' }}>نوع المشكلة: {type}</Text>
            <Text style={{ fontSize: '14px', color: '#6b7280' }}>الموضوع: {subject}</Text>
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

          <Section>
            <Text style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>{message}</Text>
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

          <Section>
            <Text style={{ fontSize: '12px', color: '#9ca3af' }}>
              🚀 أُرسلت من منصتك - dropwave.cloud
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

import React from 'react';

interface EmailTemplateProps {
  name: string;
  phone: string;
  email: string;
  industry: string;
  budget: string;
  helpNeeded: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  phone,
  email,
  industry,
  budget,
  helpNeeded,
}) => (
  <div
    style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      color: '#333',
    }}
  >
    <h1 style={{ color: '#0056b3' }}>{`Nová poptávka od ${name}`}</h1>
    <p style={{ marginBottom: '10px' }}>Dobrý den,</p>
    <p style={{ marginBottom: '10px' }}>
      právě jste obdrželi novou poptávku z kontaktního formuláře na vašem webu:
    </p>
    <hr
      style={{
        border: '0',
        height: '1px',
        background: '#ccc',
        margin: '20px 0',
      }}
    />
    <p style={{ marginBottom: '10px' }}>
      <strong style={{ fontWeight: 'bold' }}>Jméno:</strong> {name}
    </p>
    <p style={{ marginBottom: '10px' }}>
      <strong style={{ fontWeight: 'bold' }}>Telefon:</strong> {phone}
    </p>
    <p style={{ marginBottom: '10px' }}>
      <strong style={{ fontWeight: 'bold' }}>Email:</strong>{' '}
      <a href={`mailto:${email}`} style={{ color: '#0056b3', textDecoration: 'none' }}>
        {email}
      </a>
    </p>
    <p style={{ marginBottom: '10px' }}>
      <strong style={{ fontWeight: 'bold' }}>Odvětví:</strong> {industry}
    </p>
    <p style={{ marginBottom: '10px' }}>
      <strong style={{ fontWeight: 'bold' }}>Rozpočet:</strong> {budget} Kč
    </p>
    <p style={{ marginBottom: '10px' }}>
      <strong style={{ fontWeight: 'bold' }}>S čím potřebuje pomoci:</strong>
    </p>
    <p style={{ marginBottom: '10px' }}>{helpNeeded}</p>
    <hr
      style={{
        border: '0',
        height: '1px',
        background: '#ccc',
        margin: '20px 0',
      }}
    />
    <p style={{ marginBottom: '10px' }}>Prosím, kontaktujte zájemce co nejdříve.</p>
    <p style={{ marginBottom: '10px' }}>
      S pozdravem,
      <br />
      Váš webový formulář
    </p>
  </div>
);

export default EmailTemplate;

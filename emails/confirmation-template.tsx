import React from 'react';

interface ConfirmationTemplateProps {
  name: string;
}

export const ConfirmationTemplate: React.FC<Readonly<ConfirmationTemplateProps>> = ({ name }) => (
  <div
    style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      color: '#333',
    }}
  >
    <h1 style={{ color: '#0056b3' }}>Děkujeme za Vaši poptávku!</h1>
    <p style={{ marginBottom: '15px' }}>Vážený/á {name},</p>
    <p style={{ marginBottom: '15px' }}>
      děkujeme Vám za zájem o naše služby. Vaši poptávku jsme úspěšně přijali a v nejbližší době se
      Vám ozveme s odpovědí.
    </p>
    <p style={{ marginBottom: '15px' }}>Obvykle odpovídáme do 24 hodin v pracovních dnech.</p>
    <hr
      style={{
        border: '0',
        height: '1px',
        background: '#ccc',
        margin: '20px 0',
      }}
    />
    <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
      Pokud máte nějaké urgentní dotazy, můžete nás kontaktovat přímo na:
    </p>
    <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
      📧 Email: info@vojtechkochta.cz
      <br />
      📞 Telefon: +420 123 456 789
    </p>
    <hr
      style={{
        border: '0',
        height: '1px',
        background: '#ccc',
        margin: '20px 0',
      }}
    />
    <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
      S pozdravem,
      <br />
      Tým Vojtěch Kochta
    </p>
  </div>
);

export default ConfirmationTemplate;

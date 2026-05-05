import React from 'react';

export default function PasswordStrength({ password }) {
  if (!password) return null;

  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 2) return { level: 'fraca', color: 'var(--danger)', percent: 25 };
    if (score <= 4) return { level: 'média', color: 'var(--warning)', percent: 50 };
    if (score <= 5) return { level: 'boa', color: '#22d3ee', percent: 75 };
    return { level: 'forte', color: 'var(--success)', percent: 100 };
  };

  const strength = getStrength(password);

  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div
          className="strength-fill"
          style={{ width: `${strength.percent}%`, backgroundColor: strength.color }}
        />
      </div>
      <span className="strength-label" style={{ color: strength.color }}>
        Força: {strength.level}
      </span>
    </div>
  );
}

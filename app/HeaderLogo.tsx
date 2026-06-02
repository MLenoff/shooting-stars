'use client';
import { useState } from 'react';

export default function HeaderLogo() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <img
      src="/logo.avif"
      alt="Shooting Stars Indoor Soccer"
      style={{ height: '52px', width: 'auto', display: 'block' }}
      onError={() => setShow(false)}
    />
  );
}

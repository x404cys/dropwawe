'use client';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

export function useTrackVisitor(path: string) {
  useEffect(() => {
    let visitorId = localStorage.getItem('visitorId');

    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('visitorId', visitorId);
    }

    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        path,
      }),
    });
  }, [path]);
}

export function useTrackVisitor4landing(path: string) {
  useEffect(() => {
    let visitorId = localStorage.getItem('visitorId');

    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('visitorId', visitorId);
    }

    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        path,
      }),
    });
  }, [path]);
}

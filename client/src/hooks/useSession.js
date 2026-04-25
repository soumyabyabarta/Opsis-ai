import { useState, useEffect, useCallback } from 'react';
import { createSession, getSessionInfo } from '../services/api';

export function useSession() {
  const [sessionId, setSessionId] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const initSession = useCallback(async () => {
    try {
      let token = localStorage.getItem('opsis_token');
      let storedId = localStorage.getItem('opsis_session');

      if (!token || !storedId) {
        const res = await createSession();
        token = res.data.token;
        storedId = res.data.sessionId;
        localStorage.setItem('opsis_token', token);
        localStorage.setItem('opsis_session', storedId);
      }

      setSessionId(storedId);

      // Fetch session info
      try {
        const info = await getSessionInfo();
        setSessionInfo(info.data);
      } catch (_) {
        // Token expired — recreate
        localStorage.removeItem('opsis_token');
        localStorage.removeItem('opsis_session');
        const res = await createSession();
        localStorage.setItem('opsis_token', res.data.token);
        localStorage.setItem('opsis_session', res.data.sessionId);
        setSessionId(res.data.sessionId);
      }
    } catch (err) {
      console.error('[Session Init Error]', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  return { sessionId, sessionInfo, loading, refresh: initSession };
}

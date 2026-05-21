/**
 * Verifica estructura de mensajes; el entorno real lo fija NODE_ENV al ejecutar Jest.
 */
import { sessionMessages } from './session-messages';

describe('sessionMessages', () => {
  it('login.checking siempre tiene título', () => {
    expect(sessionMessages.login.checking().title.length).toBeGreaterThan(0);
  });

  it('admin.apiUnavailable siempre tiene título', () => {
    expect(sessionMessages.admin.apiUnavailable().title.length).toBeGreaterThan(0);
  });
});

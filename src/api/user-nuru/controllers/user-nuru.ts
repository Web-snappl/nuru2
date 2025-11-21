// controllers/user-nuru.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::user-nuru.user-nuru', ({ strapi }) => ({
  async login(ctx) {
    const { email, password } = ctx.request.body;
    if (!email || !password) return ctx.badRequest('Brak email lub hasła');

    const user = await strapi.db.query('api::user-nuru.user-nuru').findOne({ where: { email } });

    if (!user || user.password !== password) return ctx.unauthorized('Nieprawidłowy email lub hasło');

    return ctx.send({ message: 'Zalogowano', user: { email: user.email } });
  },
  // Nowa akcja rejestracji
  async register(ctx) {
    const { email, password } = ctx.request.body.data;

    if (!email || !password) return ctx.badRequest('Brak email lub hasła');

    // Sprawdzenie, czy email istnieje
    const existing = await strapi.db.query('api::user-nuru.user-nuru').findOne({ where: { email } });
    if (existing) return ctx.badRequest('Ten adres e-mail jest już zarejestrowany.');

    // Generujemy token
    const authToken = crypto.randomUUID();

    // Tworzymy użytkownika w bazie z isConfirmed=false
    const user = await strapi.db.query('api::user-nuru.user-nuru').create({
      data: { email, password, authToken, isConfirmed: false },
    });

    // Wysyłamy maila weryfikacyjnego
    try {
      await strapi.plugin('email').service('email').send({
        to: email,
        subject: 'Potwierdź swój e-mail',
        html: `
          <p>Dziękujemy za rejestrację!</p>
          <p>Kliknij w link, aby aktywować konto:</p>
          <a href="https://nuru-ms-strapi-render-1.onrender.com/verify-email?token=${authToken}">Aktywuj konto</a>
        `,
      });
    } catch (err) {
      console.error('Błąd wysyłki maila:', err);
    }

    return ctx.send({ message: 'Konto utworzone, sprawdź maila.' });
  },

  // Akcja potwierdzania maila
  async confirmEmail(ctx) {
    const { token } = ctx.request.query;
    if (!token) return ctx.badRequest('Brak tokenu');

    const user = await strapi.db.query('api::user-nuru.user-nuru').findOne({ where: { authToken: token } });
    if (!user) return ctx.notFound('Nieprawidłowy token');

    await strapi.db.query('api::user-nuru.user-nuru').update({
      where: { id: user.id },
      data: { isConfirmed: true, authToken: null },
    });

    return ctx.send({ message: 'Konto potwierdzone. Możesz się teraz zalogować.' });
  },
}));
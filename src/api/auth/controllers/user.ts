import bcrypt from "bcryptjs";

export default {
  async register(ctx: any) {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      return ctx.badRequest("Email i hasło są wymagane");
    }

    try {
      const password_hash = await bcrypt.hash(password, 10);

      // Bezpośrednie zapytanie SQL do własnej tabeli 'users'
      const newUser = await strapi.db.connection
        .from("users")
        .insert({ email, password_hash, is_active: true })
        .returning("*");

      ctx.send({ user: newUser[0] });
    } catch (err) {
      ctx.badRequest("Nie udało się utworzyć użytkownika", { err });
    }
  },
};

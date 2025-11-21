// src/api/ogloszenie-nuru/controllers/ogloszenie-nuru.ts
import { factories } from '@strapi/strapi';

function normalizeRawFile(f: any) {
  const path = f?.path ?? f?.filepath ?? f?.tempFilePath ?? f?.tempFilepath ?? null;
  const name = f?.originalname ?? f?.name ?? f?.filename ?? (path ? path.split('/').pop() : null) ?? null;
  const type = f?.mimetype ?? f?.mime ?? f?.type ?? null;

  return {
    path,
    name,
    type,
    _raw: f,
  };
}

export default factories.createCoreController(
  'api::ogloszenie-nuru.ogloszenie-nuru',
  ({ strapi }) => ({
    async create(ctx) {
      try {
        // Parsujemy JSON z pola "data" (frontend wysyła FormData z "data" = JSON)
        const rawData = ctx.request.body?.data;
        if (!rawData) return ctx.badRequest('Brak danych');

        const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

        const userEmail = data.userEmail;
        if (!userEmail) return ctx.badRequest('Nie jesteś zalogowany');

        const user = await strapi.db.query('api::user-nuru.user-nuru').findOne({
          where: { email: userEmail },
        });
        if (!user) return ctx.badRequest('Nie znaleziono użytkownika');

        const { userEmail: _, ...rest } = data;

        const prepared: any = {
          ...rest,
          OgloszeniaMailUsera: user.email,
          isConfirmed: false,

          // <<< TUTAJ domyślne wartości dla nowych pól:
          OgloszenieOcena: 0.0,      // number (double)
          OgloszenieIloscOcen: 0,    // number (integer)
        };

        if (rest.OgloszenieGodziny && Array.isArray(rest.OgloszenieGodziny)) {
          prepared.OgloszenieGodziny = rest.OgloszenieGodziny.map((g: any) => ({
            DzienTygodnia: g.DzienTygodnia,
            GodzinaOd: g.GodzinaOd,
            GodzinaDo: g.GodzinaDo,
          }));
        }

        if (rest.Preferencje && Array.isArray(rest.Preferencje)) {
          prepared.Preferencje = rest.Preferencje.map((p: any) => ({
            Preferencja: p?.Preferencja ?? p,
          }));
        }

        console.log('Tworzę ogłoszenie (prepared):', prepared);

        // 1) utwórz wpis bez plików (relacje/zdjęcia dodamy później)
        const created = await strapi.entityService.create(
          'api::ogloszenie-nuru.ogloszenie-nuru',
          { data: prepared }
        );

        if (!created?.id) {
          console.error('Nie udało się utworzyć wpisu:', created);
          return ctx.internalServerError('Nie udało się utworzyć ogłoszenia');
        }

        // 2) obsługa plików z ctx.request.files
        const rawFiles = ctx.request.files || {};
        console.log('RAW ctx.request.files keys:', Object.keys(rawFiles));

        // zbieramy kandydatów do uploadu (heurystyka: klucz zawierający "zdjec")
        const candidates: any[] = [];
        for (const k of Object.keys(rawFiles)) {
          if (k === 'Zdjecia' || k === 'files.Zdjecia' || k.toLowerCase().includes('zdjec')) {
            const v = (rawFiles as any)[k];
            const arr = Array.isArray(v) ? v : [v];
            arr.forEach((f: any) => candidates.push(f));
          }
        }

        if (candidates.length === 0) {
          console.log('Brak plików do uploadu (pole Zdjecia/zdjecia nieznalezione)');
        } else {
          const normalized = candidates
            .map((f: any) => normalizeRawFile(f))
            .filter(n => n.path && n.name);

          normalized.forEach((n, idx) => {
            console.log(`Normalized Zdjecia[${idx}] -> name=${n.name} size=${n._raw?.size ?? 'unknown'} type=${n.type} path=${n.path}`);
          });

          const filesToUpload = normalized.map(n => n._raw ?? { path: n.path, name: n.name, type: n.type });

          try {
            const uploadService = strapi.plugin('upload').service('upload');

            const uploaded = await uploadService.upload({
              files: filesToUpload,
              data: {
                refId: created.id,
                ref: 'api::ogloszenie-nuru.ogloszenie-nuru',
                field: 'Zdjecia',
              },
            });

            console.log('Uploaded files:', (uploaded || []).map((u: any) => ({ id: u.id, name: u.name, url: u.url })));

            const uploadedIds = (uploaded || []).map((u: any) => u.id).filter(Boolean);
            if (uploadedIds.length) {
              await strapi.entityService.update('api::ogloszenie-nuru.ogloszenie-nuru', created.id, {
                data: { Zdjecia: uploadedIds },
              });
            } else {
              console.log('upload returned no ids, pomijam przypisanie.');
            }
          } catch (uploadErr) {
            console.error('Błąd podczas uploadu plików:', uploadErr);
          }
        }

        // 3) przypisz relację user_nurus
        const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
        await strapi.entityService.update('api::ogloszenie-nuru.ogloszenie-nuru', created.id, {
          data: { user_nurus: userId },
        });

        // 4) pobierz pełny wpis z populate i zwróć
        const entry = await strapi.entityService.findOne(
          'api::ogloszenie-nuru.ogloszenie-nuru',
          created.id,
          { populate: '*' }
        );

        return ctx.send({ message: 'Ogłoszenie dodane', entry });
      } catch (err) {
        console.error('Błąd dodawania ogłoszenia:', err);
        return ctx.internalServerError('Nie udało się dodać ogłoszenia');
      }
    },
  })
);

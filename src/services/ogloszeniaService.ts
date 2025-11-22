import { supabase } from '../lib/supabase';

export interface OgloszenieFilters {
  kategoria?: string;
  wojewodztwo?: string;
  miasto?: string;
  typ?: string;
}

export async function fetchOgloszenia(filters?: OgloszenieFilters) {
  let query = supabase
    .from('ogloszenia')
    .select(`
      *,
      ogloszenia_images (
        id,
        storage_path,
        display_order
      ),
      ogloszenia_godziny (
        id,
        dzien_tygodnia,
        godzina_od,
        godzina_do
      ),
      ogloszenia_preferencje (
        id,
        preferencja
      )
    `)
    .eq('is_active', true)
    .eq('is_confirmed', true)
    .order('created_at', { ascending: false });

  if (filters?.kategoria) {
    query = query.eq('kategoria', filters.kategoria);
  }

  if (filters?.wojewodztwo) {
    query = query.eq('wojewodztwo', filters.wojewodztwo);
  }

  if (filters?.miasto) {
    query = query.ilike('miasto', `%${filters.miasto}%`);
  }

  if (filters?.typ) {
    query = query.eq('typ', filters.typ);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching ogloszenia:', error);
    return [];
  }

  return data || [];
}

export async function fetchOgloszenieById(id: string) {
  const { data, error } = await supabase
    .from('ogloszenia')
    .select(`
      *,
      ogloszenia_images (
        id,
        storage_path,
        display_order
      ),
      ogloszenia_godziny (
        id,
        dzien_tygodnia,
        godzina_od,
        godzina_do
      ),
      ogloszenia_preferencje (
        id,
        preferencja
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching ogloszenie:', error);
    return null;
  }

  return data;
}

export async function fetchUserOgloszenia(userId: string) {
  const { data, error } = await supabase
    .from('ogloszenia')
    .select(`
      *,
      ogloszenia_images (
        id,
        storage_path,
        display_order
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user ogloszenia:', error);
    return [];
  }

  return data || [];
}

export async function uploadOgloszenieImage(
  file: File,
  userId: string,
  index: number
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}-${index}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('ogloszenia-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  return fileName; // Zwracamy ścieżkę, nie publicUrl
}

export async function createOgloszenie(ogloszenieData: any) {
  const { data, error } = await supabase
    .from('ogloszenia')
    .insert([ogloszenieData])
    .select()
    .single();

  if (error) {
    console.error('Error creating ogloszenie:', error);
    throw error;
  }

  return data;
}

export async function updateOgloszenie(id: string, updates: any) {
  const { data, error } = await supabase
    .from('ogloszenia')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating ogloszenie:', error);
    throw error;
  }

  return data;
}

export async function deleteOgloszenie(id: string) {
  const { error } = await supabase
    .from('ogloszenia')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting ogloszenie:', error);
    throw error;
  }
}

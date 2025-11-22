-- Create storage bucket for ogloszenia images
insert into storage.buckets (id, name, public)
values ('ogloszenia-images', 'ogloszenia-images', true);

-- Storage policies
create policy "Public images are viewable by everyone"
  on storage.objects for select
  using (bucket_id = 'ogloszenia-images');

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'ogloszenia-images'
    and auth.role() = 'authenticated'
  );

create policy "Users can update own images"
  on storage.objects for update
  using (
    bucket_id = 'ogloszenia-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own images"
  on storage.objects for delete
  using (
    bucket_id = 'ogloszenia-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop table if exists folders;

create table folders (
    id uuid primary key default gen_random_uuid() not null,
    created_at timestamptz default now() not null,
    name text not null,
    public bool default false not null,
    folder uuid references folders (id) on delete cascade,
    owner uuid references auth.users (id) on delete cascade not null,
    icon text default 'akar-icons:folder' not null
);


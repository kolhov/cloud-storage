drop table if exists files;

create table files (
    id uuid primary key default gen_random_uuid() not null,
    created_at timestamptz default now() not null,
    name text not null,
    folder uuid references folders (id) on delete cascade,
    public boolean default false not null,
    size bigint,
    mime text not null,
    owner uuid references auth.users (id) on delete cascade not null
);
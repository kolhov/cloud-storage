drop table if exists files;

create table download_tokens
(
    id              uuid primary key default gen_random_uuid()            not null,
    created_at      timestamptz      default now()                        not null,
    expiration_time timestamptz      default now() + INTERVAL '5 minutes' not null,
    file_id         uuid references files (id) on delete cascade,
    folder_id       uuid references folders (id) on delete cascade
);
import type {ColumnDef} from "@tanstack/vue-table";
import {h} from "vue";
import {RouterLink} from "vue-router";
import type {Files, Folders} from "@/lib/supabase/supabaseQueryTypes.ts";
import { Checkbox } from '@/components/ui/checkbox'
import { TableFileName } from '@/components/ui/table'

export const columns: ColumnDef<Files[0] | Folders[0]>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
    }),
    cell: ({ row }) => h(Checkbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': value => row.toggleSelected(!!value),
      'ariaLabel': 'Select row',
    }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: () => h('div', { class: 'text-left' }, 'Name'),
    cell: ({ row }) => {
      return h(TableFileName, {
        class: 'text-left font-medium hover:bg-muted block w-full',
        name: row.getValue('name'),
        mime: row.getValue('mime'),
        isPublic: row.getValue('public')
      })
    }
  },{
    accessorKey: 'public',
    header: () => h('div', { class: 'text-left' }, 'Status'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' }, row.getValue('status'))
    },
  },{
    accessorKey: 'due_date',
    header: () => h('div', { class: 'text-left' }, 'Due date'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' }, row.getValue('due_date'))
    },
  },
  {
    accessorKey: 'projects',
    header: () => h('div', { class: 'text-left' }, 'Project'),
    cell: ({ row }) => {
      return row.original.projects? h(RouterLink, {to: `/projects/${row.original.projects.slug}`,
          class: 'text-left font-medium hover:bg-muted block w-full'},
        () => row.original.projects?.name) : ''
    },
  },
  {
    accessorKey: 'collaborators',
    header: () => h('div', { class: 'text-left' }, 'Collaborators'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' }, JSON.stringify(row.getValue('collaborators')))
    },
  },
]

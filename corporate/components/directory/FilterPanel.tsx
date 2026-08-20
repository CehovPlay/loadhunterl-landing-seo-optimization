import {
  AUTHORITY_FILTERS,
  DRIVER_COUNTS,
  ENTITY_TYPES,
  FLEET_SIZES,
  FREIGHT_TYPES,
  FREIGHT_VISIBLE,
  OPERATIONS,
  SAFETY_RATINGS,
} from "@/content/directory/taxonomy"
import type { City } from "@/content/directory/types"

/**
 * The filter rail, as a plain GET form.
 *
 * No client component and no state: the form submits to the same page, the
 * browser writes the query string, and the server filters. That is not a
 * simplification, it is §14.1 - "основной текст, навигация и ссылки должны
 * читаться даже без клиентской гидратации" - and §17.2, which requires every
 * primary flow to complete on the keyboard. It also means a filtered view is a
 * URL, so a broker can send one to a colleague.
 *
 * The freight list is 30 entries. `<details>` collapses the tail natively, with
 * the expanded state announced and no script involved.
 */

type Props = {
  city: City | null
  params: Record<string, string | string[] | undefined>
  /** Only a filtered view can be cleared, and only then is the reset a link
      somewhere else. On the bare page it would point at the page it is on. */
  filtered: boolean
}

const arr = (v: string | string[] | undefined): string[] =>
  v === undefined ? [] : Array.isArray(v) ? v : [v]

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-rule-soft py-5 first:border-t-0 first:pt-0">
      <legend className="text-small font-medium text-ink">{title}</legend>
      <div className="mt-3 flex flex-col gap-2.5">{children}</div>
    </fieldset>
  )
}

function Check({
  name,
  value,
  label,
  checked,
}: {
  name: string
  value: string
  label: string
  checked: boolean
}) {
  return (
    <label className="flex min-h-6 cursor-pointer items-center gap-2.5 text-small text-ink-2">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={checked}
        className="size-4 shrink-0 rounded-[4px] border-rule accent-violet"
      />
      {label}
    </label>
  )
}

export function FilterPanel({ city, params, filtered }: Props) {
  const on = (name: string, value: string) => arr(params[name]).includes(value)

  return (
    <form method="get" className="flex flex-col">
      <div className="flex items-baseline justify-between gap-3 pb-4">
        <h2 className="text-small font-medium text-ink">Filters</h2>
        {filtered ? (
          <a
            href={city ? `/trucking-directory/${city.slug}` : "/trucking-directory"}
            className="text-meta text-ink-3 underline-offset-2 hover:text-ink hover:underline"
          >
            Clear all filters
          </a>
        ) : null}
      </div>

      <Group title="Entity">
        {ENTITY_TYPES.map((e) => (
          <Check key={e.value} name="entity" value={e.value} label={e.label} checked={on("entity", e.value)} />
        ))}
      </Group>

      <Group title="Authority">
        {AUTHORITY_FILTERS.map((a) => (
          <Check key={a.value} name="authority" value={a.value} label={a.label} checked={on("authority", a.value)} />
        ))}
      </Group>

      <Group title="Insurance (BIPD)">
        {/* grid, not flex: two `flex-1` number inputs refuse to shrink below
            their intrinsic width and push out of a 3-column rail. */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex min-w-0 flex-col gap-1">
            <span className="text-meta text-ink-4">Min</span>
            <input
              type="number"
              name="bipdMin"
              inputMode="numeric"
              defaultValue={(params.bipdMin as string) ?? ""}
              className="h-9 w-full min-w-0 rounded-chip border border-rule bg-paper-2 px-2.5 font-mono text-small tabular-nums text-ink"
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1">
            <span className="text-meta text-ink-4">Max</span>
            <input
              type="number"
              name="bipdMax"
              inputMode="numeric"
              defaultValue={(params.bipdMax as string) ?? ""}
              className="h-9 w-full min-w-0 rounded-chip border border-rule bg-paper-2 px-2.5 font-mono text-small tabular-nums text-ink"
            />
          </label>
        </div>
      </Group>

      <Group title="Insurance (bond)">
        <Check name="bond" value="yes" label="On file" checked={on("bond", "yes")} />
      </Group>

      <Group title="Insurance (cargo)">
        <Check name="cargo" value="yes" label="On file" checked={on("cargo", "yes")} />
      </Group>

      <Group title="Freight type">
        {FREIGHT_TYPES.slice(0, FREIGHT_VISIBLE).map((f) => (
          <Check key={f} name="freight" value={f} label={f} checked={on("freight", f)} />
        ))}
        <details className="group">
          <summary className="cursor-pointer list-none text-meta text-violet-ink underline-offset-2 hover:underline [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Show {FREIGHT_TYPES.length - FREIGHT_VISIBLE} more</span>
            <span className="hidden group-open:inline">Show less</span>
          </summary>
          <div className="mt-2.5 flex flex-col gap-2.5">
            {FREIGHT_TYPES.slice(FREIGHT_VISIBLE).map((f) => (
              <Check key={f} name="freight" value={f} label={f} checked={on("freight", f)} />
            ))}
          </div>
        </details>
      </Group>

      <Group title="Operations">
        {OPERATIONS.map((o) => (
          <Check key={o.value} name="ops" value={o.value} label={o.label} checked={on("ops", o.value)} />
        ))}
      </Group>

      <Group title="Fleet size and drivers">
        <label className="flex flex-col gap-1">
          <span className="text-meta text-ink-4">Fleet size</span>
          <select
            name="fleet"
            defaultValue={(params.fleet as string) ?? ""}
            className="h-9 rounded-chip border border-rule bg-paper-2 px-2.5 text-small text-ink"
          >
            <option value="">Any</option>
            {FLEET_SIZES.map((f) => (
              <option key={f.label} value={f.label}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-meta text-ink-4">Drivers</span>
          <select
            name="drivers"
            defaultValue={(params.drivers as string) ?? ""}
            className="h-9 rounded-chip border border-rule bg-paper-2 px-2.5 text-small text-ink"
          >
            <option value="">Any</option>
            {DRIVER_COUNTS.map((d) => (
              <option key={d.label} value={d.label}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
      </Group>

      <Group title="Inspections (last 24 months)">
        <Check name="inspected" value="yes" label="On file" checked={on("inspected", "yes")} />
      </Group>

      <Group title="Safety rating">
        {SAFETY_RATINGS.map((r) => (
          <Check key={r} name="safety" value={r} label={r} checked={on("safety", r)} />
        ))}
      </Group>

      <Group title="Contacts">
        <Check name="contact" value="phone" label="Phone number" checked={on("contact", "phone")} />
        <Check name="contact" value="email" label="Email address" checked={on("contact", "email")} />
      </Group>

      <button
        type="submit"
        className="mt-2 flex h-10 items-center justify-center rounded-full bg-violet px-5 text-small font-medium text-white transition-opacity duration-150 hover:opacity-90"
      >
        Apply filters
      </button>
    </form>
  )
}

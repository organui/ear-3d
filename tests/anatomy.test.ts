import { describe, expect, test } from 'bun:test'
import { emphasis, structures } from '../src/anatomy'

describe('selection emphasis', () => {
  test('keeps every structure normal without a selection', () => {
    expect(structures.every((s) => emphasis(s.id, null) === 'normal')).toBe(true)
  })

  test('keeps the selection solid and ghosts everything else', () => {
    const states = structures.map((s) => emphasis(s.id, 'stapes'))
    expect(states.filter((s) => s === 'selected')).toHaveLength(1)
    expect(emphasis('stapes', 'stapes')).toBe('selected')
    expect(emphasis('cochlea', 'stapes')).toBe('ghosted')
  })
})

describe('source ownership', () => {
  test('assigns every source object to exactly one structure', () => {
    const objects = structures.flatMap((s) =>
      s.sources.flatMap((x) => x.objects.map((o) => `${x.file}/${o}`)),
    )
    expect(new Set(objects).size).toBe(objects.length)
  })
})

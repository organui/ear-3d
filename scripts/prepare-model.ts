import { mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { Document, NodeIO } from '@gltf-transform/core'
import { BufferAttribute, BufferGeometry, Color, Mesh, type Object3D } from 'three'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import inputs from './model-inputs.json'
import { sourceObjects, structures, type SourceFile } from '../src/anatomy'

// FBXLoader only touches these globals for texture loading, which these files don't use.
Object.assign(globalThis, { window: globalThis, self: globalThis })

const sha = (data: Uint8Array) => createHash('sha256').update(data).digest('hex')
await mkdir('.asset-cache/fbx', { recursive: true })
await mkdir('public/models', { recursive: true })
const roots = new Map<SourceFile, Object3D>()
for (const input of inputs.files) {
  const file = Bun.file(`.asset-cache/fbx/${input.name}.fbx`)
  if (!(await file.exists())) {
    console.log(`Downloading ${input.path}…`)
    const response = await fetch(input.url)
    if (!response.ok) throw new Error(`${input.name}: HTTP ${response.status}`)
    await Bun.write(file, response)
  }
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (bytes.length !== input.bytes || sha(bytes) !== input.sha256)
    throw new Error(
      `Checksum mismatch: ${input.name}. Refusing changed upstream data; review it before updating the pin.`,
    )
  const root = new FBXLoader().parse(bytes.buffer, '')
  root.updateMatrixWorld(true)
  roots.set(input.name as SourceFile, root)
}

function findMesh(file: SourceFile, name: string) {
  const found: Mesh[] = []
  roots.get(file)!.traverse((o) => {
    if (o instanceof Mesh && o.name === name) found.push(o)
  })
  if (found.length !== 1)
    throw new Error(`${file}: expected one mesh named ${name}, found ${found.length}`)
  return found[0]
}

const used = new Set<string>()
const min = [Infinity, Infinity, Infinity],
  max = [-Infinity, -Infinity, -Infinity]
const prepared = []
for (const structure of structures) {
  const positions: number[] = [],
    indices: number[] = []
  const objects = []
  for (const { file, objects: names } of structure.sources) {
    for (const name of names) {
      const key = `${file}/${name}`
      if (used.has(key)) throw new Error(`Duplicate ownership: ${key}`)
      used.add(key)
      const mesh = findMesh(file, name)
      // Keep positions only, apply the object's world transform, then weld
      // coincident vertices so normals can be smoothed.
      const source = new BufferGeometry().setAttribute(
        'position',
        mesh.geometry.getAttribute('position').clone(),
      )
      if (mesh.geometry.index) source.setIndex(mesh.geometry.index.clone())
      source.applyMatrix4(mesh.matrixWorld)
      const geometry = mergeVertices(source, 1e-5)
      const p = geometry.getAttribute('position') as BufferAttribute
      const index = geometry.index!
      const offset = positions.length / 3
      for (let i = 0; i < p.count; i++) {
        const v = [p.getX(i), p.getY(i), p.getZ(i)]
        if (!v.every(Number.isFinite)) throw new Error(`Invalid vertex: ${key}`)
        v.forEach((value, axis) => {
          min[axis] = Math.min(min[axis], value)
          max[axis] = Math.max(max[axis], value)
        })
        positions.push(...v)
      }
      for (let i = 0; i < index.count; i++) indices.push(offset + index.getX(i))
      const triangles = index.count / 3
      if (!p.count || !triangles) throw new Error(`Empty mesh: ${key}`)
      objects.push({ file, object: name, vertices: p.count, triangles })
      source.dispose()
      geometry.dispose()
    }
  }
  prepared.push({ structure, positions, indices, objects })
}
if (used.size !== structures.flatMap(sourceObjects).length) throw new Error('Source count mismatch')

const doc = new Document()
doc.getRoot().getAsset().copyright =
  'Z-Anatomy (CC BY-SA 4.0), based in part on BodyParts3D, © The Database Center for Life Science (CC BY-SA 2.1 Japan). Adapted by OrganUI.'
const scene = doc.createScene('OrganUI Ear — Z-Anatomy')
const buffer = doc.createBuffer()
const center = min.map((v, i) => (v + max[i]) / 2)
// Source units are centimetres, Y up, +Z anterior, patient right at −X, so the
// axes already match the display. Uniform scale only, no anatomical reshaping.
const scale = 0.5
for (const { structure, positions, indices } of prepared) {
  const transformed = new Float32Array(positions.length)
  for (let i = 0; i < positions.length; i++) transformed[i] = (positions[i] - center[i % 3]) * scale
  const geometry = new BufferGeometry()
    .setAttribute('position', new BufferAttribute(transformed, 3))
    .setIndex(indices)
  geometry.computeVertexNormals()
  const color = new Color(structure.color)
  const material = doc
    .createMaterial(structure.id)
    .setBaseColorFactor([color.r, color.g, color.b, 1])
    .setRoughnessFactor(0.65)
    .setMetallicFactor(0)
    .setDoubleSided(true)
  const primitive = doc
    .createPrimitive()
    .setAttribute(
      'POSITION',
      doc.createAccessor().setType('VEC3').setArray(transformed).setBuffer(buffer),
    )
    .setAttribute(
      'NORMAL',
      doc
        .createAccessor()
        .setType('VEC3')
        .setArray(new Float32Array(geometry.getAttribute('normal').array))
        .setBuffer(buffer),
    )
    .setIndices(
      doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(indices)).setBuffer(buffer),
    )
    .setMaterial(material)
  const mesh = doc.createMesh(structure.id).addPrimitive(primitive)
  scene.addChild(
    doc
      .createNode(structure.id)
      .setMesh(mesh)
      .setExtras({ structureId: structure.id, sources: sourceObjects(structure) }),
  )
  geometry.dispose()
}
const runtime = await new NodeIO().writeBinary(doc)
await Bun.write('public/models/ear.glb', runtime)
const manifest = {
  dataset: 'Z-Anatomy',
  license: 'CC-BY-SA-4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  basedOn: {
    dataset: 'BodyParts3D / Anatomography',
    license: 'CC-BY-SA-2.1-JP',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en',
  },
  credit: doc.getRoot().getAsset().copyright,
  retrieved: '2026-10-16',
  source: { repository: inputs.repository, commit: inputs.commit, files: inputs.files },
  transform: { sourceBoundsCm: { min, max }, centerCm: center, scale, axes: '[x, y, z]' },
  runtime: { file: 'ear.glb', bytes: runtime.byteLength, sha256: sha(runtime) },
  structures: prepared.map(({ structure, objects }) => ({ id: structure.id, objects })),
}
await Bun.write('public/models/manifest.json', JSON.stringify(manifest, null, 2) + '\n')
console.log(
  `Prepared ${structures.length} structures from ${used.size} source objects, ${runtime.byteLength} bytes. SHA-256 ${sha(runtime)}`,
)

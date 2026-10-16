export type SourceFile = 'SkeletalSystem100' | 'NervousSystem100' | 'Regions of human body100'
export type Structure = {
  id: string
  name: string
  group: 'Outer ear' | 'Middle ear' | 'Inner ear'
  // Z-Anatomy FBX file and object names this structure is built from. All are
  // from the right ear; each source object belongs to exactly one structure.
  sources: { file: SourceFile; objects: string[] }[]
  color: string
  description: string
  note: string
}

export const anatomySource = 'https://www.nidcd.nih.gov/health/how-do-we-hear'
export const structures: Structure[] = [
  {
    id: 'helix',
    name: 'Helix',
    group: 'Outer ear',
    sources: [
      {
        file: 'Regions of human body100',
        objects: ['Helixr', 'Apex_of_auricler', 'Auricular_tubercler'],
      },
    ],
    color: '#e0a48f',
    description:
      'The curled outer rim of the auricle. It runs from above the ear canal up and around the top and back of the ear.',
    note: 'Includes the apex and the small auricular tubercle. The auricle is modelled as a skin surface split into named regions; its cartilage is not a separate mesh.',
  },
  {
    id: 'antihelix',
    name: 'Antihelix',
    group: 'Outer ear',
    sources: [{ file: 'Regions of human body100', objects: ['Antihelixr', 'Crura_of_antihelixr'] }],
    color: '#d18f7c',
    description:
      'A curved ridge inside the helix. At the top it splits into two crura that frame the triangular fossa.',
    note: 'The ridge and both crura are grouped as one selectable region.',
  },
  {
    id: 'scapha-and-fossa',
    name: 'Scapha and triangular fossa',
    group: 'Outer ear',
    sources: [{ file: 'Regions of human body100', objects: ['Scaphar', 'Triangular_fossar'] }],
    color: '#ebbba7',
    description:
      'Shallow hollows of the auricle: the scapha is the groove between helix and antihelix, the triangular fossa sits between the crura.',
    note: 'Two surface regions grouped together.',
  },
  {
    id: 'concha',
    name: 'Concha',
    group: 'Outer ear',
    sources: [
      {
        file: 'Regions of human body100',
        objects: ['Concha_of_auricler', 'Cymba_conchaer', 'Cavity_of_conchar'],
      },
    ],
    color: '#bf7d6e',
    description:
      'The deep bowl at the centre of the auricle. It funnels sound into the ear canal, which opens from its lower part.',
    note: 'Cymba and cavity of the concha are grouped. The ear canal itself is not in the source model, so there is a gap between the concha and the eardrum.',
  },
  {
    id: 'tragus',
    name: 'Tragus and antitragus',
    group: 'Outer ear',
    sources: [
      {
        file: 'Regions of human body100',
        objects: ['Tragusr', 'Antitragusr', 'Intertragic_incisurer', 'Anterior_notch_of_auricler'],
      },
    ],
    color: '#c98f84',
    description:
      'Two small flaps either side of the opening of the ear canal. The tragus is in front, the antitragus below and behind it.',
    note: 'Includes the intertragic notch and the anterior notch.',
  },
  {
    id: 'lobule',
    name: 'Lobule',
    group: 'Outer ear',
    sources: [{ file: 'Regions of human body100', objects: ['Lobule_of_auricler'] }],
    color: '#efc2b2',
    description: 'The soft earlobe at the bottom of the auricle. It contains fat and no cartilage.',
    note: 'A surface region of the auricle.',
  },
  {
    id: 'back-of-auricle',
    name: 'Back of the auricle',
    group: 'Outer ear',
    sources: [
      {
        file: 'Regions of human body100',
        objects: [
          'Eminentia_conchaer',
          'Eminentia_scaphaer',
          'Eminentia_fossae_triangularisr',
          'Fossa_antihelicar',
          'Posterior_auricular_groover',
        ],
      },
    ],
    color: '#d7a596',
    description:
      'The surface facing the head. Its bulges mirror the hollows on the front, and a groove joins it to the scalp.',
    note: 'Best seen from behind. Five surface regions are grouped together.',
  },
  {
    id: 'tympanic-membrane',
    name: 'Eardrum',
    group: 'Outer ear',
    sources: [{ file: 'NervousSystem100', objects: ['Tympanic_membraner'] }],
    color: '#c8b6d8',
    description:
      'A thin membrane at the end of the ear canal. Sound makes it vibrate, and the malleus attached to it passes the vibration on.',
    note: 'Also called the tympanic membrane. It forms the boundary with the middle ear.',
  },
  {
    id: 'malleus',
    name: 'Malleus',
    group: 'Middle ear',
    sources: [{ file: 'SkeletalSystem100', objects: ['Malleusr'] }],
    color: '#efe2c4',
    description:
      'The first and largest ossicle, about 8 mm long. Its handle is attached to the eardrum and its head joins the incus.',
    note: 'Also called the hammer. Its ligaments and the tensor tympani muscle are omitted.',
  },
  {
    id: 'incus',
    name: 'Incus',
    group: 'Middle ear',
    sources: [{ file: 'SkeletalSystem100', objects: ['Incusr'] }],
    color: '#e3cf9f',
    description:
      'The middle ossicle. Its body joins the malleus and its long limb reaches down to the stapes.',
    note: 'Also called the anvil.',
  },
  {
    id: 'stapes',
    name: 'Stapes',
    group: 'Middle ear',
    sources: [{ file: 'SkeletalSystem100', objects: ['Stapesr'] }],
    color: '#d5bb7e',
    description:
      'The smallest bone in the body. Its footplate sits in the oval window and pushes vibrations into the fluid of the inner ear.',
    note: 'Also called the stirrup. The stapedius muscle is omitted.',
  },
  {
    id: 'auditory-tube',
    name: 'Auditory tube',
    group: 'Middle ear',
    sources: [{ file: 'NervousSystem100', objects: ['Auditory_tuber'] }],
    color: '#9fb8a0',
    description:
      'Connects the middle ear to the back of the nose. It opens when you swallow or yawn to balance pressure on both sides of the eardrum.',
    note: 'Also called the Eustachian tube. In the source it starts a little medial to the middle ear, leaving a gap. The air space of the middle ear is not modelled.',
  },
  {
    id: 'chorda-tympani',
    name: 'Chorda tympani',
    group: 'Middle ear',
    sources: [{ file: 'NervousSystem100', objects: ['Chorda_tympanir'] }],
    color: '#e39a52',
    description:
      'A branch of the facial nerve that crosses the middle ear between the malleus and incus, carrying taste from the front of the tongue.',
    note: 'Only this branch is shown; the rest of the facial nerve is omitted.',
  },
  {
    id: 'cochlea',
    name: 'Cochlea',
    group: 'Inner ear',
    sources: [{ file: 'NervousSystem100', objects: ['Cochlear'] }],
    color: '#7f9fc4',
    description:
      'A fluid-filled spiral of about two and a half turns. Hair cells along it turn vibrations into nerve signals, high pitches at the base and low pitches at the apex.',
    note: 'The bony cochlea is shown as one surface; its inner ducts and the organ of Corti are not modelled.',
  },
  {
    id: 'vestibule',
    name: 'Vestibule and semicircular canals',
    group: 'Inner ear',
    sources: [{ file: 'NervousSystem100', objects: ['Vestibuler'] }],
    color: '#93b4cf',
    description:
      'The balance organ. The vestibule senses gravity and straight-line motion, and three canals at right angles to each other sense head rotation.',
    note: 'The bony vestibule and the anterior, posterior and lateral canals are one mesh, so they cannot be selected separately.',
  },
  {
    id: 'vestibulocochlear-nerve',
    name: 'Vestibulocochlear nerve',
    group: 'Inner ear',
    sources: [
      {
        file: 'NervousSystem100',
        objects: ['Vestibulocochlear_nerve_(VIII)r', 'Cochlear_nerve', 'Vestibular_nerver'],
      },
    ],
    color: '#e9d36f',
    description:
      'Cranial nerve VIII. Its cochlear part carries hearing and its vestibular part carries balance from the inner ear to the brainstem.',
    note: 'The trunk and its cochlear and vestibular parts are grouped as one selectable set.',
  },
]
export const groups = ['Outer ear', 'Middle ear', 'Inner ear'] as const
export const byId = Object.fromEntries(structures.map((s) => [s.id, s]))
export const sourceObjects = (s: Structure) => s.sources.flatMap((x) => x.objects)
export type View = 'Anterior' | 'Lateral' | 'Superior'
export const tour: { id: string; title: string; text: string; view: View; isolate?: boolean }[] = [
  {
    id: 'concha',
    title: 'Collecting sound',
    text: 'The auricle gathers sound and the bowl of the concha funnels it toward the ear canal. Rotate the model to see how much lies hidden behind it.',
    view: 'Lateral',
  },
  {
    id: 'tympanic-membrane',
    title: 'The eardrum',
    text: 'Deep inside, the eardrum closes off the ear canal. It vibrates with every sound that reaches it.',
    view: 'Anterior',
  },
  {
    id: 'malleus',
    title: 'Three tiny bones',
    text: 'The malleus is isolated here. Together with the incus and stapes it passes the eardrum’s vibration across the middle ear. Restore all to see the chain.',
    view: 'Anterior',
    isolate: true,
  },
  {
    id: 'cochlea',
    title: 'Hearing',
    text: 'The stapes pushes on the fluid of the cochlea. Hair cells along its spiral turn that motion into nerve signals.',
    view: 'Superior',
  },
  {
    id: 'vestibule',
    title: 'Balance',
    text: 'Next to the cochlea, the vestibule and three semicircular canals sense gravity and every turn of the head.',
    view: 'Superior',
  },
]

export type Emphasis = 'normal' | 'selected' | 'ghosted'
// With nothing selected every structure keeps its own color. A selection
// keeps its structure solid and ghosts the rest so it stays visible even
// when it sits behind or inside other geometry (ossicles, inner ear).
export function emphasis(id: string, selected: string | null): Emphasis {
  if (!selected) return 'normal'
  return id === selected ? 'selected' : 'ghosted'
}

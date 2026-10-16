# Model provenance and preparation

## Source and license

The runtime model uses meshes from **[Z-Anatomy](https://github.com/LluisV/Z-Anatomy)**, an open 3D anatomy atlas, retrieved **2026-10-16**. Z-Anatomy's models are licensed under **[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)** (see the [snapshot of its LICENSE file](model-source/z-anatomy-LICENSE.txt)). Z-Anatomy builds in part on **BodyParts3D / Anatomography, © The Database Center for Life Science (DBCLS)**, licensed under [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en), whose share-alike terms allow adaptations under later versions of the licence such as 4.0.

This licence governs `public/models/ear.glb`, the manifest's model data and the model screenshots, separately from the MIT application code.

Credit: **Z-Anatomy (Gauthier Kervyn, Lluís Vinent Juanico and contributors), based in part on BodyParts3D / Anatomography, © DBCLS.** Adapted by OrganUI. No endorsement is implied.

## Why not BodyParts3D directly

The other OrganUI explorers use BodyParts3D 4.3 from the [olivercase/body_parts_3d_api](https://github.com/olivercase/body_parts_3d_api) mirror. That release, and the 3.0 release, model the ear only as one coarse mesh of both auricles (`FJ2811`, FMA52781 external ear); there are no ossicles, eardrum, cochlea or semicircular canals. Z-Anatomy adds these, so the ear explorer uses it instead.

## Retrieval and pinning

Geometry comes from the Z-Anatomy Unity project's FBX exports, pinned at commit `6c7f9016bd5899ac8edafd31b9900c151df42ed6` of `LluisV/Z-Anatomy`. Three files are used; each is checked by size and SHA-256 before parsing (values and Git blob IDs are in [model-inputs.json](../scripts/model-inputs.json)):

| File | Used for |
| --- | --- |
| `Resources/Models/FBX/SkeletalSystem100.fbx` | Malleus, incus, stapes |
| `Resources/Models/FBX/NervousSystem100.fbx` | Eardrum, auditory tube, cochlea, vestibule, vestibulocochlear nerve, chorda tympani |
| `Resources/Models/FBX/Regions of human body100.fbx` | Regions of the auricle |

`prepare-model.ts` looks up each source object by its exact Z-Anatomy name and refuses to run if a name matches zero or several meshes, or if an object is assigned to two structures.

## Selected structures

All structures are from the **right** ear (Z-Anatomy object names ending in `r`).

| Structure | Z-Anatomy objects |
| --- | --- |
| Helix | `Helixr`, `Apex_of_auricler`, `Auricular_tubercler` |
| Antihelix | `Antihelixr`, `Crura_of_antihelixr` |
| Scapha and triangular fossa | `Scaphar`, `Triangular_fossar` |
| Concha | `Concha_of_auricler`, `Cymba_conchaer`, `Cavity_of_conchar` |
| Tragus and antitragus | `Tragusr`, `Antitragusr`, `Intertragic_incisurer`, `Anterior_notch_of_auricler` |
| Lobule | `Lobule_of_auricler` |
| Back of the auricle | `Eminentia_conchaer`, `Eminentia_scaphaer`, `Eminentia_fossae_triangularisr`, `Fossa_antihelicar`, `Posterior_auricular_groover` |
| Eardrum | `Tympanic_membraner` |
| Malleus | `Malleusr` |
| Incus | `Incusr` |
| Stapes | `Stapesr` |
| Auditory tube | `Auditory_tuber` |
| Chorda tympani | `Chorda_tympanir` |
| Cochlea | `Cochlear` |
| Vestibule and semicircular canals | `Vestibuler` |
| Vestibulocochlear nerve | `Vestibulocochlear_nerve_(VIII)r`, `Cochlear_nerve`, `Vestibular_nerver` |

31 source objects, 41,101 triangles. Per-object vertex and triangle counts are in the [manifest](../public/models/manifest.json).

Decisions and gaps:

- **Auricle.** Z-Anatomy has no auricular cartilage mesh. Its auricle is the skin surface, split into named regions in the "Regions of human body" collection. These regions are low-poly (2,124 triangles in total), so the outer ear looks faceted, and colour seams between regions are deliberate. The surrounding `Auricular_regionr` skin patch is omitted.
- **Ear canal.** There is no external acoustic meatus in the source, so a gap separates the concha from the eardrum.
- **Auditory tube.** In the source it starts a little medial to the middle ear, leaving a gap.
- **Not modelled in the source:** the air space of the middle ear, the ossicular ligaments and muscles, the membranous labyrinth and organ of Corti. The cochlea and the vestibule with its three canals are bony-labyrinth surfaces; the canals are part of the vestibule mesh and cannot be selected separately.
- **Omitted:** the temporal bone (it would enclose everything), the rest of the facial nerve, vessels and the left ear.
- Label pins in the FBX files (12-triangle helper meshes) are never used.

## Transformation and orientation

FBX object transforms are applied, coincident vertices are welded (tolerance 1e-5 cm) and smooth normals recomputed. Vertices are recentred on the selection's bounding box and uniformly scaled by `0.5` per centimetre. The source axes already match the display (Y up, +Z anterior, patient right at −X), so no axis change is needed. The anterior view looks along −Z, with the auricle on the viewer's left and the auditory tube running toward the midline; the lateral view looks at the auricle from the patient's right; the superior view looks down from above and slightly in front. No anatomical reshaping or decimation is performed.

## Reproduce

```sh
bun run prepare:model   # downloads the three FBX files (≈100 MB) into .asset-cache/fbx, verifies, writes the GLB and manifest
bun run verify:model    # checks the GLB hash, structure IDs, source object lists and geometry
```

Running `prepare:model` twice produces byte-identical output.

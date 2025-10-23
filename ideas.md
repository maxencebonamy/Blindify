Mode avce plusieurs extraots en même temps
Pour trouver le bon son : soit valider si on a trouvé, soit entrer le titre + artiste + album (comme Blinest), soit un QCM avec plusieurs propositions (éventuellement plusieurs QCM, un pour le titre, un pour l'artiste, un pour l'album)


Algo pour les titres des tracks :
- liste des artistes -> enlever tous les noms qui apparaissent dans le titre (avec lowercase)
- enlever les ft, feat (avec ou sans point après), les , et les &
- enlever les parenthèses vides



## Cahier des charges

Écrans :
- connexion
- choix de la playlist
- création de la partie
- préparation de la partie (3, 2, 1)
- écoute d'un extrait
- révélation du morceau
- fin de la partie

Connexion :
- Spotify
- Apple Music (soon)
- Deezer (soon)
- Youtube Music (soon)

Choix de la playlist :
- Affichage de toutes les playlists de l'utilisateur connecté (avec pagination ou infinite scroll, tri et filtrage)
- Infos à afficher pour chaque playlist : nom, description (optionnelle), cover (optionnelle), nombre de tracks
- Pour chaque playlist, soit un bouton de sélection unique puis un bouton jouer global soit directement un bouton jouer pour chaque playlist
- Le bouton jouer redirige vers la page de création de la partie

Création de la partie :
- Affichage des infos de la playlist sélectionnée
- Paramètres : nombre d'extraits (10, 20, ou +, mais des nombres fixes), durée des extraits (durées fixes pareil : 2s, 5s, 10s, 20s)
- Bouton commencer la partie

Préparation de la partie :
- Au début un affichage de chargement
- Au bout d'un certain temps (utiliser un timer pour mock le chargement), afficher un compte à rebours de 3, 2, 1 et c'est parti
- À la fin du compte à rebours passer automatiquement à l'écran suivant

Écoute d'un extrait :
- Affichage de la barre de progression de l'extrait et écoute de l'extrait automatique
- Animation de waveform ou équivalent
- Affiche d'autres infos : numéro de l'extrait actuel (manche), total d'extraits (de manches)
- Une fois la barre de progression arrivée à la fin, passer automatiquement à l'écran suivant

Révélation du morceau :
- Quasiment la même page mais sans la barre de progression, à la place d'autres infos
- Affichage des infos du morceau de l'extrait : titre, artiste(s), album, cover (optionnelle)
- Lecture de la suite de la fin de l'extrait en fond pendant 10s (chaque extrait dure au total 30s donc en considérant que la durée max ait été choisie, 20s, on pourra toujours jouer 10s ici pour terminer l'extrait), il ne faut pas de coupure dans l'extrait entre cet écran et le précédent
- Au bout de 10s, passer à l'extrait suivant sur l'écran d'écoute, sauf si c'est le dernier extrait dans ce cas passer à l'écran de fin de partie
- Effet reveal de blur pour les infos

Fin de partie :
- Affichage de la fin avec animation finale (confettis par exemple)
- Résumé basique sur la partie (playlist, nombre d'extraits joués, durée totale de la partie, etc)
- Bouton pour rejouer la même playlist qui redirige vers l'écran de création de la partie avec les mêmes paramètres que la partie précédente préremplis
- Bouton pour revenir à l'écran de sélection de la playlist


L'app pour le moment est faite pour être jouée en mode salon à plusieurs sur un même écran, donc c'est pour ça qu'on gère pas d'inputs pour deviner les infos, ou encore de score, les participants le font entre eux, l'app sert ici juste à choisir des extraits aléatoirement

Contraintes techniques / UX :
- Responsiveness : iPhone, iPad, Mac, TV
- Langue : uniquement en anglais
- Animations : légères, modernes, gamifiées (sans ralentir la fluidité)
- Style : interface fun mais clean (pas arcade rétro, plutôt moderne & dynamique)


## Types

```ts
const zPage = <T>(zItem: z.ZodType<T>) => z.object({
    page: z.number().int().min(1),
    previousPage: z.number().int().min(1).nullable(),
    nextPage: z.number().int().min(2).nullable(),
    totalPages: z.number().int().min(1),
    totalItems: z.number().int().min(0),
    pageSize: z.number().int().min(1),
    items: z.array(zItem)
})

const zPlaylist = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    coverUrl: z.string().url().nullable(),
    trackCount: z.number().int().min(0)
})

export const zGameSettings = z.object({
    samplesCount: z.union([z.literal(10), z.literal(20), z.literal(30)]),
    sampleDurationMs: z.union([ z.literal(2000), z.literal(5000), z.literal(10000), z.literal(20000)])
})

export const zGameStatus = z.enum(["loading", "ready", "listening", "reveal", "finished"])

export const zSampleMinimal = z.object({
    id: z.string(),
    order: z.number().int().min(0)
})

export const zGame = z.object({
    id: z.string(),
    playlist: zPlaylist,
    settings: zGameSettings,
    samples: z.array(zSampleMinimal),
    currentSampleIndex: z.number().int().min(0),
    status: zGameStatus,
	startTime: z.date().nullable(),
	endTime: z.date().nullable()
})

export const zSample = z.object({
    id: z.string(),
    order: z.number().int().min(0),
    clipUrl: z.string().url(),
})

export const zTrack = z.object({
    id: z.string(),
    title: z.string(),
    artists: z.array(z.string()).min(1),
    album: z.string(),
    coverUrl: z.string().url().nullable()
})

export const zPlaylistsQuery = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(50).default(20),
    search: z.string().optional(),
    sort: z.enum(["name", "trackCount"]).optional(),
    order: z.enum(["asc", "desc"]).optional()
})
```


## API

GET /playlists
- query : zPlaylistsQuery
- 200 : zPage(zPlaylist)

POST /games
- body : { playlistId: z.string(), settings: zGameSettings }
- 200 : zGame

GET /games/:gameId
- 200 : zGame

PATCH /games/:gameId/next
- 200 : zSample

PATCH /games/:gameId/reveal
- 200 : zTrack

PATCH /games/:gameId/finish
- 200 : zGame


## Flux classique

Connexion : bouton non fonctionnel pour le moment, on clique dessus et on se retrouve directement sur la page des playlists
Affichage des playlists avec le GET /playlists
Le clic sur le bouton d'une playlist n'appelle aucune route API
Configuration de la partie, clic sur le bouton créer le partie appelle POST /games
Une partie est renvoyée avec le status "loading", mais le backend effectue quelques opérations donc afficher l'écran de chargement à ce moment là
Appeler GET /games/:gameId à intervalle régulier jusqu'à ce que le status renvoyé soit "ready", dans ce cas afficher le compte à rebours
Appeler PATCH /games/:gameId/next pour récupérer le sample (un url d'un fichier mp3), puis le jouer (le status de la game passe à "listening")
À la fin appeler PATCH /games/:gameId/reveal pour récupérer les infos (le status de la game passe à "reveal")
Ensuite si la partie est terminée, le bouton affiché est "terminer la partie" (on appelle alors PATCH /games/:gameId/finish et le status passe à "finished")

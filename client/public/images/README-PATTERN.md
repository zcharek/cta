# Instructions pour ajouter les patterns

Pour utiliser les patterns géométriques dans le projet, ajoutez les deux fichiers suivants dans ce dossier (`/client/public/images/`) :

1. **pattern-light.svg** - Pattern avec fond blanc (pour les sections claires)
2. **pattern-dark.svg** - Pattern avec fond bleu marine (pour les sections sombres)

✅ **Les fichiers ont été ajoutés avec succès !**

## Utilisation

Le composant `PatternBackground` utilise automatiquement ces images selon le variant :

```tsx
// Pattern light (par défaut)
<PatternBackground variant="light" opacity={0.15}>
  {/* Contenu */}
</PatternBackground>

// Pattern dark
<PatternBackground variant="dark" opacity={0.2}>
  {/* Contenu */}
</PatternBackground>
```

## Paramètres disponibles

- `variant`: 'light' | 'dark' (défaut: 'light')
- `opacity`: nombre entre 0 et 1 (défaut: 0.15)
- `blendMode`: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' (défaut: 'multiply')
- `className`: classes CSS supplémentaires
- `imageSrc`: chemin personnalisé vers une image (optionnel)


# Fotos originales

Copia aquí las fotografías **originales** de la boda (tal y como las entregue el
fotógrafo), organizadas en una carpeta por capítulo:

```
fotos/
├─ antes/           01 · Antes del sí
├─ ceremonia/       02 · La ceremonia
├─ just-married/    03 · Just married
├─ nosotros/        04 · Nosotros
├─ celebracion/     05 · La celebración
├─ fiesta/          06 · La fiesta
├─ vosotros/        07 · Los que estuvieron allí
└─ _og.jpg          (opcional) imagen para compartir en WhatsApp
```

Puedes poner un número delante para ordenarlas en el explorador (`02-ceremonia/`).
Una carpeta con otro nombre → esas fotos salen solo en «Todos los recuerdos».

Después ejecuta:

```bash
npm run photos
```

Esta carpeta **no se sube a GitHub** (está en `.gitignore`): solo se publican las
versiones optimizadas que genera el script en `public/images/wedding/`.
